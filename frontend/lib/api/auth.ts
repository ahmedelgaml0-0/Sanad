import type { AuthUser, ForgotPasswordInput, GoogleSignUpInput, ResetPasswordInput, SignInInput, SignUpInput } from "@/types/auth";
import { apiRequest } from "./client";

// The contract the auth module on the backend implements. The session lives in an httpOnly cookie
// that the API sets and the browser sends back automatically; the frontend never stores a token itself.

// POST /auth/sign-up → creates the account, signs it in (sets the cookie). Errors: EMAIL_TAKEN, RATE_LIMITED.
export function signUp(input: SignUpInput) {
  return apiRequest<{ user: AuthUser }>("/auth/sign-up", { method: "POST", body: JSON.stringify(input) });
}

// POST /auth/sign-in → signs in (sets the cookie). Errors: INVALID_CREDENTIALS, RATE_LIMITED.
export function signIn(input: SignInInput) {
  return apiRequest<{ user: AuthUser }>("/auth/sign-in", { method: "POST", body: JSON.stringify(input) });
}

// POST /auth/demo → creates a temporary demo account and signs it in.
export function startDemo() {
  return apiRequest<{ user: AuthUser }>("/auth/demo", { method: "POST" });
}

// GET /auth/me → the signed-in person, or 401 when there is no valid session.
export function getMe() {
  return apiRequest<{ user: AuthUser }>("/auth/me");
}

// POST /auth/sign-out → ends this session and clears the cookie. Answers 204 No Content.
export function signOut() {
  return apiRequest<void>("/auth/sign-out", { method: "POST" });
}

// GET /auth/google → a full-page redirect: the backend sends the browser to Google and back.
// Afterwards the backend redirects to /home, to /choose-pen-name (first time), or to /sign-in?error=CODE.
export function googleAuthUrl() {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
}

// POST /auth/google/complete → finishes a first Google sign-up with the chosen pen name (sets the cookie).
// Errors: GOOGLE_SIGNUP_EXPIRED (the 15-minute window passed), EMAIL_TAKEN.
export function completeGoogleSignUp(input: GoogleSignUpInput) {
  return apiRequest<{ user: AuthUser }>("/auth/google/complete", { method: "POST", body: JSON.stringify(input) });
}

// POST /auth/password/forgot { email } → 204, whether or not the email has an account,
// so the answer can't be used to find out who is registered. Errors: RATE_LIMITED.
export function requestPasswordReset(input: ForgotPasswordInput) {
  return apiRequest<void>("/auth/password/forgot", { method: "POST", body: JSON.stringify(input) });
}

// POST /auth/password/reset/verify { token } → { valid }. Lets the reset page say "expired" before the form is filled in.
export function verifyResetToken(token: string) {
  return apiRequest<{ valid: boolean }>("/auth/password/reset/verify", { method: "POST", body: JSON.stringify({ token }) });
}

// POST /auth/password/reset { token, password } → 204. Signs out every session (and clears this browser's cookie).
// Errors: RESET_TOKEN_INVALID (wrong, used or expired link), VALIDATION_ERROR, RATE_LIMITED.
export function resetPassword(input: ResetPasswordInput) {
  return apiRequest<void>("/auth/password/reset", { method: "POST", body: JSON.stringify(input) });
}

// POST /auth/email/verify { token } → { user } with emailVerified: true. Doesn't sign in or set a cookie.
// Errors: VERIFY_TOKEN_INVALID (wrong, used or older than 24 hours).
export function verifyEmail(token: string) {
  return apiRequest<{ user: AuthUser }>("/auth/email/verify", { method: "POST", body: JSON.stringify({ token }) });
}

// POST /auth/email/resend → 204. Signed-in only. Sends nothing if already verified or a link went out in the last minute.
export function resendVerificationEmail() {
  return apiRequest<void>("/auth/email/resend", { method: "POST" });
}
