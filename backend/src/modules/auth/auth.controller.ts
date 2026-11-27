import type { CookieOptions, Request, Response } from "express";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { parseInput } from "../../utils/validate";
import * as authService from "./auth.service";
import * as googleService from "./google.service";
import * as emailVerification from "./emailVerification.service";
import * as passwordReset from "./passwordReset.service";
import { GOOGLE_SIGNUP_COOKIE, GOOGLE_STATE_COOKIE, SESSION_COOKIE } from "./auth.tokens";
import {
  forgotPasswordSchema,
  googleSignUpSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
  verifyResetTokenSchema,
} from "./auth.validation";

// httpOnly keeps the token away from page scripts (XSS); lax blocks it on cross-site form posts (CSRF).
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

// Google-flow cookies are only sent to the Google routes, nowhere else.
const googleFlowCookie: CookieOptions = { ...cookieOptions, path: "/api/v1/auth/google" };

// Frontend pages the Google flow lands on; must match frontend/lib/routes.ts.
const clientPaths = { signIn: "/sign-in", choosePenName: "/choose-pen-name", app: "/home" };

function clientUrl(path: string, errorCode?: string): string {
  const url = new URL(path, env.CLIENT_ORIGIN);
  if (errorCode) url.searchParams.set("error", errorCode);
  return url.toString();
}

function queryString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function setSessionCookie(res: Response, result: authService.AuthResult) {
  res.cookie(SESSION_COOKIE, result.token, { ...cookieOptions, expires: result.expiresAt });
}

function sendSession(res: Response, status: number, result: authService.AuthResult) {
  setSessionCookie(res, result);
  res.status(status).json({ user: result.user });
}

export async function signUp(req: Request, res: Response) {
  const input = parseInput(signUpSchema, req.body);
  const result = await authService.signUp(input);
  sendSession(res, 201, result);
  // After the response: a slow or failing email provider must never fail or delay the sign-up itself.
  emailVerification.requestVerificationEmail(result.user.id).catch((err) => console.error("Verification email failed:", err));
}

export async function signIn(req: Request, res: Response) {
  const input = parseInput(signInSchema, req.body);
  sendSession(res, 200, await authService.signIn(input));
}

export async function startDemo(_req: Request, res: Response) {
  sendSession(res, 201, await authService.startDemo());
}

export async function me(req: Request, res: Response) {
  res.json({ user: await authService.getCurrentUser(req.auth!.userId) });
}

export async function signOut(req: Request, res: Response) {
  await authService.signOut(req.cookies?.[SESSION_COOKIE]);
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.status(204).end();
}

export async function googleStart(_req: Request, res: Response) {
  const { url, stateToken } = await googleService.startGoogle();
  res.cookie(GOOGLE_STATE_COOKIE, stateToken, { ...googleFlowCookie, maxAge: 10 * 60 * 1000 });
  res.redirect(url);
}

// A browser navigation, not a fetch: every outcome is a redirect, and errors travel as ?error=CODE.
export async function googleCallback(req: Request, res: Response) {
  res.clearCookie(GOOGLE_STATE_COOKIE, googleFlowCookie);

  // The person pressed "Cancel" on Google's screen; nothing went wrong, so no error message.
  if (req.query.error) {
    res.redirect(clientUrl(clientPaths.signIn));
    return;
  }

  try {
    const outcome = await googleService.finishGoogle({
      code: queryString(req.query.code),
      state: queryString(req.query.state),
      stateToken: req.cookies?.[GOOGLE_STATE_COOKIE],
    });
    if (outcome.kind === "signedIn") {
      setSessionCookie(res, outcome.session);
      res.redirect(clientUrl(clientPaths.app));
      return;
    }
    res.cookie(GOOGLE_SIGNUP_COOKIE, outcome.signUpToken, { ...googleFlowCookie, maxAge: 15 * 60 * 1000 });
    res.redirect(clientUrl(clientPaths.choosePenName));
  } catch (err) {
    if (!(err instanceof AppError)) console.error(err);
    res.redirect(clientUrl(clientPaths.signIn, err instanceof AppError ? err.code : "GOOGLE_FAILED"));
  }
}

export async function googleComplete(req: Request, res: Response) {
  const input = parseInput(googleSignUpSchema, req.body);
  const session = await googleService.completeGoogleSignUp(req.cookies?.[GOOGLE_SIGNUP_COOKIE], input);
  res.clearCookie(GOOGLE_SIGNUP_COOKIE, googleFlowCookie);
  sendSession(res, 201, session);
}

// Answer first, work afterwards: the response is identical and equally fast whether or not the account exists,
// so neither the reply nor its timing reveals which emails are registered.
export async function forgotPassword(req: Request, res: Response) {
  const { email } = parseInput(forgotPasswordSchema, req.body);
  res.set("Cache-Control", "no-store").status(204).end();
  passwordReset.requestPasswordReset(email).catch((err) => console.error("Password reset request failed:", err));
}

export async function verifyResetToken(req: Request, res: Response) {
  const { token } = parseInput(verifyResetTokenSchema, req.body);
  res.set("Cache-Control", "no-store").json({ valid: await passwordReset.isPasswordResetTokenValid(token) });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = parseInput(resetPasswordSchema, req.body);
  await passwordReset.resetPassword(token, password);
  // Every session was just ended on the server, so this browser's cookie goes too; they sign in with the new password.
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.set("Cache-Control", "no-store").status(204).end();
}

export async function verifyEmail(req: Request, res: Response) {
  const { token } = parseInput(verifyEmailSchema, req.body);
  res.set("Cache-Control", "no-store").json({ user: await emailVerification.verifyEmail(token) });
}

// Signed-in only (the banner's "send again"), so there's no email in the request and nothing to enumerate.
export async function resendVerification(req: Request, res: Response) {
  await emailVerification.requestVerificationEmail(req.auth!.userId);
  res.status(204).end();
}
