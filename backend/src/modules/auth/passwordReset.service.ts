import argon2 from "argon2";
import { env } from "../../config/env";
import { mailer } from "../../utils/email";
import * as authRepo from "./auth.repository";
import { invalidResetToken } from "./auth.errors";
import { createOneTimeToken, hashOneTimeToken } from "./oneTimeToken";
import { buildPasswordChangedEmail, buildPasswordResetEmail } from "./passwordReset.emails";
import * as repo from "./passwordReset.repository";

const RESET_POLICY = {
  tokenLifetimeMinutes: 30,
  // At most one reset email per account in this window, so the form can't be used to flood someone's inbox.
  minSecondsBetweenEmails: 60,
} as const;

// The reset page in the frontend; must match frontend/lib/routes.ts.
const RESET_PAGE_PATH = "/reset-password";

// Step 1: someone asks for a reset link. Never throws for "no such account": the caller must not learn whether
// the email is registered. (The controller also answers before this runs, so timing can't tell either.)
export async function requestPasswordReset(email: string): Promise<void> {
  const user = await authRepo.findUserByEmail(email);
  if (!user?.email) return;
  if (await repo.hasRecentResetToken(user._id, RESET_POLICY.minSecondsBetweenEmails)) return;

  const { token, tokenHash } = createOneTimeToken();
  const expiresAt = new Date(Date.now() + RESET_POLICY.tokenLifetimeMinutes * 60 * 1000);
  await repo.replaceResetToken({ userId: user._id, tokenHash, expiresAt });

  const resetLink = new URL(`${RESET_PAGE_PATH}?token=${token}`, env.CLIENT_ORIGIN).toString();
  await mailer.send({
    to: user.email,
    ...buildPasswordResetEmail({ penName: user.penName, resetLink, expiresInMinutes: RESET_POLICY.tokenLifetimeMinutes }),
  });
}

// Step 2: the reset page asks whether its link still works, so it can say "expired" before the form is filled in.
export async function isPasswordResetTokenValid(token: string): Promise<boolean> {
  return repo.isResetTokenUsable(hashOneTimeToken(token));
}

// Step 3: the new password. Order matters, because MongoDB here runs each step on its own (no transaction):
//   1. claim the link   → it can never work again
//   2. end every session → anyone signed in with the old password is out
//   3. save the password
// If something fails part-way, the account is only ever left "safer" (signed out, password unchanged) and
// the person simply asks for a new link. Ending sessions last could leave an attacker signed in.
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const tokenHash = hashOneTimeToken(token);

  // Cheap check first, so a wrong link doesn't cost a slow argon2 hash.
  if (!(await repo.isResetTokenUsable(tokenHash))) throw invalidResetToken();
  const passwordHash = await argon2.hash(newPassword);

  const userId = await repo.claimResetToken(tokenHash);
  if (!userId) throw invalidResetToken();

  await authRepo.deleteSessionsForUser(userId);
  const user = await repo.setPassword(userId, passwordHash);
  if (!user?.email) return;

  // Tell the owner. If this email fails, the reset still succeeded, so it's logged rather than reported.
  try {
    await mailer.send({ to: user.email, ...buildPasswordChangedEmail({ penName: user.penName }) });
  } catch (err) {
    console.error("Could not send the password-changed email:", err);
  }
}
