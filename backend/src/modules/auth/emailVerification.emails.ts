import { buttonHtml, escapeHtml, noteHtml, wrapHtml, type EmailContent } from "../../utils/emailLayout";

export function buildVerificationEmail(input: { penName: string; verificationLink: string; expiresInHours: number }): EmailContent {
  const { penName, verificationLink, expiresInHours } = input;

  // Matters for security, not just politeness: anyone can type someone else's email into the sign-up form,
  // so the real owner is told plainly not to confirm an account they didn't create.
  const notYou = "If you didn't create a Sanad account, don't press the button. You can ignore this email and nothing will happen.";

  return {
    subject: "Confirm your email for Sanad",
    text: [
      `Hi ${penName},`,
      "",
      "Welcome to Sanad. Open this link to confirm your email address:",
      "",
      verificationLink,
      "",
      `The link works once and expires in ${expiresInHours} hours.`,
      "",
      notYou,
    ].join("\n"),
    html: wrapHtml(`
  <p>Hi ${escapeHtml(penName)},</p>
  <p>Welcome to Sanad. Press the button to confirm your email address.</p>${buttonHtml("Confirm my email", verificationLink)}${noteHtml(`The link works once and expires in ${expiresInHours} hours.`)}${noteHtml(notYou)}`),
  };
}
