import "dotenv/config";
import { z } from "zod";

// An empty line in .env ("RESEND_API_KEY=") means "not set", not an empty string.
const optional = z.preprocess((value) => (value === "" ? undefined : value), z.string().optional());

// Fail at startup, not mid-request, if config is missing.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5001),
  MONGODB_URI: z.string().min(1),
  CLIENT_ORIGIN: z.url(),
  // Signs session tokens; anyone holding it can forge a sign-in, so it must be long and secret.
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  // Must match a redirect URI registered on the Google client exactly.
  GOOGLE_CALLBACK_URL: z.url(),
  // Email (Resend). Optional in development: without a key, emails are printed to this terminal instead of sent.
  RESEND_API_KEY: optional,
  EMAIL_FROM: optional,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

// Production can't fall back to printing emails: nobody reads the server's terminal.
if (parsed.data.NODE_ENV === "production" && !parsed.data.RESEND_API_KEY) {
  console.error("Invalid environment variables: RESEND_API_KEY is required in production");
  process.exit(1);
}

export const env = parsed.data;
