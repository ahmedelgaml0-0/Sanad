import { z } from "zod";

// Limits match frontend/lib/validation/auth.ts; the server re-checks because the browser can be bypassed.
const email = z.string().trim().toLowerCase().max(254).pipe(z.email());

const penName = z.string().trim().min(2).max(40);

const newPassword = z.string().min(12).max(128);

// Reset links carry a 43-character token; the bounds only reject obvious junk before any database work.
const resetToken = z.string().min(20).max(200);

export const signUpSchema = z.object({
  penName,
  email,
  password: newPassword,
});

// No minimum length on sign-in: a rule change later must not lock out accounts made under the old rule.
export const signInSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export const googleSignUpSchema = z.object({ penName });

export const forgotPasswordSchema = z.object({ email });

export const verifyResetTokenSchema = z.object({ token: resetToken });

// The new password follows the same rules as sign-up.
export const resetPasswordSchema = z.object({ token: resetToken, password: newPassword });

export const verifyEmailSchema = z.object({ token: resetToken });

export type SignUpInput = z.output<typeof signUpSchema>;
export type SignInInput = z.output<typeof signInSchema>;
export type GoogleSignUpInput = z.output<typeof googleSignUpSchema>;
