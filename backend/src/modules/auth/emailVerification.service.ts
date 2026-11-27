import { env } from "../../config/env";
import { mailer } from "../../utils/email";
import type { UserRecord } from "../users/user.model";
import { invalidVerificationToken } from "./auth.errors";
import { toAuthUser, type AuthUser } from "./auth.service";
import { buildVerificationEmail } from "./emailVerification.emails";
import * as repo from "./emailVerification.repository";
import { createOneTimeToken, hashOneTimeToken } from "./oneTimeToken";

const VERIFICATION_POLICY = {
  // Longer than a reset link: people often confirm hours later, and the link only proves an address.
  tokenLifetimeHours: 24,
  minSecondsBetweenEmails: 60,
} as const;

// The confirmation page in the frontend; must match frontend/lib/routes.ts.
const VERIFY_PAGE_PATH = "/verify-email";

// Creates a fresh link (older ones stop working) and emails it. Called right after sign-up and on "send again".
async function sendVerificationEmail(user: UserRecord): Promise<void> {
  if (!user.email) return;
  const { token, tokenHash } = createOneTimeToken();
  const expiresAt = new Date(Date.now() + VERIFICATION_POLICY.tokenLifetimeHours * 60 * 60 * 1000);
  await repo.replaceVerificationToken({ userId: user._id, tokenHash, expiresAt });

  const verificationLink = new URL(`${VERIFY_PAGE_PATH}?token=${token}`, env.CLIENT_ORIGIN).toString();
  await mailer.send({
    to: user.email,
    ...buildVerificationEmail({ penName: user.penName, verificationLink, expiresInHours: VERIFICATION_POLICY.tokenLifetimeHours }),
  });
}

// Sign-up, and "send again" from the banner. Quietly does nothing when there's nothing to send:
// no email (demo), already verified, or a link went out less than a minute ago.
export async function requestVerificationEmail(userId: string): Promise<void> {
  const user = await repo.findUserForVerification(userId);
  if (!user?.email || user.emailVerifiedAt) return;
  if (await repo.hasRecentVerificationToken(user._id, VERIFICATION_POLICY.minSecondsBetweenEmails)) return;
  await sendVerificationEmail(user);
}

// The person pressed "Confirm" on the page the link opened. Only marks the email as proven; it doesn't sign
// anyone in, so the link in the inbox never works as a way into the account.
export async function verifyEmail(token: string): Promise<AuthUser> {
  const userId = await repo.claimVerificationToken(hashOneTimeToken(token));
  if (!userId) throw invalidVerificationToken();
  const user = await repo.markEmailVerified(userId);
  if (!user) throw invalidVerificationToken();
  return toAuthUser(user);
}
