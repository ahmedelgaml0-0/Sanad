import { after, afterEach, before, beforeEach, describe, mock, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../../app";
import { env } from "../../config/env";
import { cookieFrom } from "../../test/cookies";
import { connectTestDB, disconnectTestDB, resetTestDB } from "../../test/db";
import { mailer, type EmailMessage } from "../../utils/email";
import { User } from "../users/user.model";
import { SESSION_COOKIE } from "./auth.tokens";
import { hashOneTimeToken } from "./oneTimeToken";
import { PasswordReset } from "./passwordReset.model";

const api = request(app);
const maya = { penName: "Maya", email: "maya@example.com", password: "a-long-calm-password" };
const newPassword = "a-brand-new-calm-password";

let sent: EmailMessage[] = [];
// Sign-up also sends a verification email now; these tests only look at reset emails.
const resets = () => sent.filter((m) => m.subject === "Reset your Sanad password");

// The forgot endpoint answers before it works, so tests wait for the email (or for nothing to happen).
async function waitFor(check: () => boolean, ms = 2000) {
  const end = Date.now() + ms;
  while (!check() && Date.now() < end) await new Promise((r) => setTimeout(r, 10));
}
const settle = () => new Promise((r) => setTimeout(r, 150));

async function requestLink(email = maya.email): Promise<string> {
  const before = resets().length;
  await api.post("/api/v1/auth/password/forgot").send({ email }).expect(204);
  await waitFor(() => resets().length > before);
  const link = resets().at(-1)?.text.match(/https?:\/\/\S+/)?.[0];
  assert.ok(link, "expected a reset link in the email");
  return new URL(link).searchParams.get("token") ?? "";
}

const reset = (token: string, password = newPassword) => api.post("/api/v1/auth/password/reset").send({ token, password });
const verify = (token: string) => api.post("/api/v1/auth/password/reset/verify").send({ token });
const signIn = (password: string) => api.post("/api/v1/auth/sign-in").send({ email: maya.email, password });

before(connectTestDB);
beforeEach(async () => {
  await resetTestDB();
  sent = [];
  // Emails are captured instead of printed or sent.
  mock.method(mailer, "send", async (message: EmailMessage) => {
    sent.push(message);
  });
});
afterEach(() => mock.restoreAll());
after(disconnectTestDB);

describe("POST /auth/password/forgot", () => {
  test("emails a link to the reset page and stores only the token's hash", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const token = await requestLink();

    assert.equal(resets()[0].to, maya.email);
    assert.ok(resets()[0].text.includes(`${env.CLIENT_ORIGIN}/reset-password?token=`));
    const stored = await PasswordReset.find().lean();
    assert.equal(stored.length, 1);
    assert.equal(stored[0].tokenHash, hashOneTimeToken(token));
    assert.notEqual(stored[0].tokenHash, token);
  });

  test("answers an unknown email exactly the same, and sends nothing", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const known = await api.post("/api/v1/auth/password/forgot").send({ email: maya.email });
    await waitFor(() => resets().length > 0);
    sent = [];
    const unknown = await api.post("/api/v1/auth/password/forgot").send({ email: "nobody@example.com" });
    await settle();

    assert.equal(unknown.status, known.status);
    assert.deepEqual(unknown.body, known.body);
    assert.equal(resets().length, 0);
  });

  test("sends at most one email a minute, and a newer link replaces the older one", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const first = await requestLink();

    await api.post("/api/v1/auth/password/forgot").send({ email: maya.email }).expect(204);
    await settle();
    assert.equal(resets().length, 1, "a second request within a minute sends nothing");

    // A minute later, a new request gets a new link and the old one stops working.
    // Raw collection: Mongoose treats createdAt as unchangeable and would silently skip this.
    await PasswordReset.collection.updateMany({}, { $set: { createdAt: new Date(Date.now() - 61_000) } });
    const second = await requestLink();
    assert.notEqual(second, first);
    assert.equal((await verify(first)).body.valid, false);
    assert.equal((await verify(second)).body.valid, true);
  });
});

describe("POST /auth/password/reset/verify", () => {
  test("says whether a link still works: valid, unknown, expired", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const token = await requestLink();

    assert.deepEqual((await verify(token)).body, { valid: true });
    assert.deepEqual((await verify("x".repeat(43))).body, { valid: false });
    await PasswordReset.updateMany({}, { expiresAt: new Date(Date.now() - 1000) });
    assert.deepEqual((await verify(token)).body, { valid: false });
  });
});

describe("POST /auth/password/reset", () => {
  test("changes the password, signs out every session, and tells the owner", async () => {
    const signUp = await api.post("/api/v1/auth/sign-up").send(maya);
    const oldSession = cookieFrom(signUp, SESSION_COOKIE);
    const token = await requestLink();

    const res = await reset(token);
    assert.equal(res.status, 204);

    assert.equal((await signIn(newPassword)).status, 200);
    assert.equal((await signIn(maya.password)).status, 401);
    assert.equal((await api.get("/api/v1/auth/me").set("Cookie", oldSession)).status, 401);
    assert.equal(sent.at(-1)?.subject, "Your Sanad password was changed");
  });

  test("a link works once", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const token = await requestLink();

    assert.equal((await reset(token)).status, 204);
    const again = await reset(token, "yet-another-calm-password");
    assert.equal(again.status, 400);
    assert.equal(again.body.code, "RESET_TOKEN_INVALID");
  });

  test("two requests racing with the same link: exactly one wins", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const token = await requestLink();

    const results = await Promise.all([reset(token, "first-racing-password"), reset(token, "second-racing-password")]);
    assert.deepEqual(results.map((r) => r.status).sort(), [204, 400]);
  });

  test("an expired link is refused", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const token = await requestLink();
    await PasswordReset.updateMany({}, { expiresAt: new Date(Date.now() - 1000) });

    const res = await reset(token);
    assert.equal(res.status, 400);
    assert.equal(res.body.code, "RESET_TOKEN_INVALID");
    assert.equal((await signIn(maya.password)).status, 200);
  });

  test("a too-short password is refused without using up the link", async () => {
    await api.post("/api/v1/auth/sign-up").send(maya);
    const token = await requestLink();

    const res = await reset(token, "short");
    assert.equal(res.status, 400);
    assert.equal(res.body.code, "VALIDATION_ERROR");
    assert.equal((await verify(token)).body.valid, true);
  });

  test("using the link proves the email, and gives a Google-only account a password", async () => {
    await User.create({ penName: "Fern", email: "fern@gmail.com", googleId: "google-sub-1" });
    const token = await requestLink("fern@gmail.com");
    await reset(token).expect(204);

    const fern = await User.findOne({ email: "fern@gmail.com" }).select("+passwordHash").lean();
    assert.ok(fern?.emailVerifiedAt);
    assert.ok(fern?.passwordHash?.startsWith("$argon2id$"));
  });
});
