import { Schema, model } from "mongoose";

const passwordResetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // sha256 of the emailed token; the token itself is never stored.
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    // Set when the link is used. Kept (not deleted) until it expires, so "already used" stays "invalid".
    usedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// MongoDB removes each token once it has expired, used or not.
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordReset = model("PasswordReset", passwordResetSchema);
