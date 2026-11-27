import { AppError } from "../../utils/AppError";

export const emailTaken = () => new AppError(409, "EMAIL_TAKEN", "An account with this email already exists");

// One error for "no such email" and "wrong password", so the response can't reveal which accounts exist.
export const invalidCredentials = () => new AppError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");

// Google flow failures are shown on the sign-in page after a redirect, so these codes travel in the URL.
export const googleFailed = () => new AppError(400, "GOOGLE_FAILED", "Google sign-in failed");

// The email's account is already linked to a different Google account.
export const googleEmailInUse = () =>
  new AppError(409, "GOOGLE_EMAIL_IN_USE", "This email is linked to a different Google account");

export const googleSignUpExpired = () =>
  new AppError(401, "GOOGLE_SIGNUP_EXPIRED", "Google sign-up expired, start again");

// The reset link is wrong, already used, or older than 30 minutes. One code for all three: the page shows the same thing.
export const invalidResetToken = () =>
  new AppError(400, "RESET_TOKEN_INVALID", "This reset link is invalid or has expired");

export const invalidVerificationToken = () =>
  new AppError(400, "VERIFY_TOKEN_INVALID", "This confirmation link is invalid or has expired");

export const unauthenticated = () => new AppError(401, "UNAUTHENTICATED", "Not signed in");
