// Shared building blocks for every email Sanad sends. Inline styles only: email apps ignore <style> tags.

export type EmailContent = {
  subject: string;
  // Plain-text version, for email apps that don't render HTML (and for the development terminal).
  text: string;
  html: string;
};

const BRAND = "#606c50";
const INK = "#5a4636";
const MUTED = "#6a5b4e";

// Pen names come from users, so they're escaped before going into HTML.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function wrapHtml(bodyHtml: string): string {
  return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: ${INK}; background: #faf3ea;">
  <p style="font-family: Georgia, serif; font-size: 24px; margin: 0 0 24px; color: ${INK};">Sanad</p>
  ${bodyHtml}
</div>`.trim();
}

export function buttonHtml(label: string, link: string): string {
  return `
  <p style="margin: 28px 0;">
    <a href="${link}" style="background: ${BRAND}; color: #fffdf8; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: bold; display: inline-block;">${label}</a>
  </p>`;
}

export function noteHtml(text: string): string {
  return `
  <p style="font-size: 14px; color: ${MUTED};">${text}</p>`;
}
