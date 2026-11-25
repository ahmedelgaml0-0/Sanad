import { createHash, randomBytes } from "node:crypto";

// The secret part of emailed links (password reset now, email verification later).
// The email gets the real token; the database only ever gets its hash, so a leaked database
// can't be turned back into working links.

// A long random token can't be guessed, so a fast hash is enough. (Passwords need slow argon2: people pick guessable ones.)
export function hashOneTimeToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createOneTimeToken(): { token: string; tokenHash: string } {
  // 32 random bytes = 256 bits, written as 43 URL-safe characters.
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashOneTimeToken(token) };
}
