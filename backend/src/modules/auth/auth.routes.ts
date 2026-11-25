import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createRateLimit } from "../../middleware/rateLimit";
import * as controller from "./auth.controller";

// Separate limits: failed sign-ins shouldn't block the demo, and each demo creates a database user.
const credentialsLimit = createRateLimit({ windowMinutes: 15, limit: 10 });
const demoLimit = createRateLimit({ windowMinutes: 60, limit: 5 });
// Asking for a reset email (each one costs an email), and checking or using a link.
const forgotLimit = createRateLimit({ windowMinutes: 15, limit: 5 });
const resetLimit = createRateLimit({ windowMinutes: 15, limit: 20 });

export const authRoutes = Router();

authRoutes.post("/sign-up", credentialsLimit, controller.signUp);
authRoutes.post("/sign-in", credentialsLimit, controller.signIn);
authRoutes.post("/demo", demoLimit, controller.startDemo);
authRoutes.get("/me", requireAuth, controller.me);
authRoutes.post("/sign-out", controller.signOut);
authRoutes.get("/google", controller.googleStart);
authRoutes.get("/google/callback", controller.googleCallback);
authRoutes.post("/google/complete", credentialsLimit, controller.googleComplete);
// POST, not GET with the token in the URL: URLs end up in server logs and browser history.
authRoutes.post("/password/forgot", forgotLimit, controller.forgotPassword);
authRoutes.post("/password/reset/verify", resetLimit, controller.verifyResetToken);
authRoutes.post("/password/reset", resetLimit, controller.resetPassword);
