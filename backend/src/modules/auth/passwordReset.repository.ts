import type { Types } from "mongoose";
import { User, type UserRecord } from "../users/user.model";
import { PasswordReset } from "./passwordReset.model";

// For the "one email per minute" rule.
export async function hasRecentResetToken(userId: Types.ObjectId, withinSeconds: number): Promise<boolean> {
  const since = new Date(Date.now() - withinSeconds * 1000);
  return (await PasswordReset.exists({ userId, createdAt: { $gt: since } })) !== null;
}

// Only the newest link ever works: older ones are removed before the new one is saved.
export async function replaceResetToken(input: { userId: Types.ObjectId; tokenHash: string; expiresAt: Date }) {
  await PasswordReset.deleteMany({ userId: input.userId });
  await PasswordReset.create(input);
}

const usable = (tokenHash: string) => ({ tokenHash, usedAt: null, expiresAt: { $gt: new Date() } });

export async function isResetTokenUsable(tokenHash: string): Promise<boolean> {
  return (await PasswordReset.exists(usable(tokenHash))) !== null;
}

// The check that counts: one atomic "find an unused, unexpired token and mark it used".
// Two requests with the same link can't both get a userId back.
export async function claimResetToken(tokenHash: string): Promise<Types.ObjectId | null> {
  const claimed = await PasswordReset.findOneAndUpdate(usable(tokenHash), { $set: { usedAt: new Date() } }).lean();
  return claimed?.userId ?? null;
}

// Saving the new password also marks the email as verified: opening the link proved they can read that inbox.
export function setPassword(userId: Types.ObjectId, passwordHash: string) {
  return User.findByIdAndUpdate(userId, { $set: { passwordHash, emailVerifiedAt: new Date() } }, { new: true }).lean<UserRecord>();
}
