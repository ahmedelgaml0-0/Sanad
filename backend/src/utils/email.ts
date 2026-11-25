import { env } from "../config/env";

// Sends email through Resend's HTTP API (resend.com) with plain fetch, so no extra package is needed.
// To switch provider later, this is the only file that changes.

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Resend's shared test sender: works without a domain, but only delivers to your own Resend account's address.
const DEFAULT_FROM = "Sanad <onboarding@resend.dev>";

// Development: shows the email in the backend terminal, so a flow can be finished by copying the link.
function printEmail(message: EmailMessage, reason: string): void {
  console.log(
    [
      "",
      `---------------- EMAIL (not sent: ${reason}) ----------------`,
      `To:      ${message.to}`,
      `Subject: ${message.subject}`,
      "",
      message.text,
      "--------------------------------------------------------------",
      "",
    ].join("\n"),
  );
}

async function send(message: EmailMessage): Promise<void> {
  if (!env.RESEND_API_KEY) {
    // env.ts refuses to start production without a key, so this only happens in development and tests.
    printEmail(message, "RESEND_API_KEY is not set");
    return;
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM ?? DEFAULT_FROM,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });
  if (response.ok) return;

  const details = await response.text().catch(() => "");
  if (env.NODE_ENV === "production") {
    throw new Error(`Email could not be sent (status ${response.status}). ${details}`);
  }
  // Resend's test sender refuses every address except your own (403); print instead, so any address can be tested.
  console.warn(`Resend refused the email (status ${response.status}). ${details}`);
  printEmail(message, `Resend refused it, status ${response.status}`);
}

// One object, so tests can replace send() and read what would have gone out.
export const mailer = { send };
