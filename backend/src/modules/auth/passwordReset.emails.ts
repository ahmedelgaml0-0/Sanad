import { buttonHtml, escapeHtml, noteHtml, wrapHtml, type EmailContent } from "../../utils/emailLayout";

export function buildPasswordResetEmail(input: { penName: string; resetLink: string; expiresInMinutes: number }): EmailContent {
  const { penName, resetLink, expiresInMinutes } = input;
  return {
    subject: "Reset your Sanad password",
    text: [
      `Hi ${penName},`,
      "",
      "We received a request to reset your Sanad password. Open this link to choose a new one:",
      "",
      resetLink,
      "",
      `The link works once and expires in ${expiresInMinutes} minutes.`,
      "",
      "If you didn't ask for this, you can ignore this email. Your password stays the same.",
    ].join("\n"),
    html: wrapHtml(`
  <p>Hi ${escapeHtml(penName)},</p>
  <p>We received a request to reset your Sanad password. Press the button to choose a new one.</p>${buttonHtml("Choose a new password", resetLink)}${noteHtml(`The link works once and expires in ${expiresInMinutes} minutes.`)}${noteHtml("If you didn't ask for this, you can ignore this email. Your password stays the same.")}`),
  };
}

export function buildPasswordChangedEmail(input: { penName: string }): EmailContent {
  return {
    subject: "Your Sanad password was changed",
    text: [
      `Hi ${input.penName},`,
      "",
      "Your Sanad password was just changed, and you were signed out on every device.",
      "",
      "If this was you, there's nothing more to do. If it wasn't, reset your password right away from the sign-in page.",
    ].join("\n"),
    html: wrapHtml(`
  <p>Hi ${escapeHtml(input.penName)},</p>
  <p>Your Sanad password was just changed, and you were signed out on every device.</p>${noteHtml("If this was you, there's nothing more to do. If it wasn't, reset your password right away from the sign-in page.")}`),
  };
}
