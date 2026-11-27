import { Types } from "mongoose";
import { User, type UserRecord } from "../users/user.model";
import { EmailVerification } from "./emailVerification.model";

// For the "one email per minute" rule.
export async function hasRecentVerificationToken(userId: Types.ObjectId, withinSeconds: number): Promise<boolean> {
  const since = new Date(Date.now() - withinSeconds * 1000);
  return (await EmailVerification.exists({ userId, createdAt: { $gt: since } })) !== null;
}

// Only the newest link ever works.
export async function replaceVerificationToken(input: { userId: Types.ObjectId; tokenHash: string; expiresAt: Date }) {
  await EmailVerification.deleteMany({ userId: input.userId });
  await EmailVerification.create(input);
}

// One atomic "find an unused, unexpired token and mark it used", so two clicks can't both succeed.
export async function claimVerificationToken(tokenHash: string): Promise<Types.ObjectId | null> {
  const claimed = await EmailVerification.findOneAndUpdate(
    { tokenHash, usedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { usedAt: new Date() } },
  ).lean();
  return claimed?.userId ?? null;
}

// Keeps the first verification date if the email was already proven another way (Google, a password reset).
export async function markEmailVerified(userId: Types.ObjectId) {
  await User.updateOne({ _id: userId, emailVerifiedAt: { $exists: false } }, { $set: { emailVerifiedAt: new Date() } });
  return User.findById(userId).lean<UserRecord>();
}

export function findUserForVerification(userId: string) {
  if (!Types.ObjectId.isValid(userId)) return Promise.resolve(null);
  return User.findById(userId).lean<UserRecord>();
}
