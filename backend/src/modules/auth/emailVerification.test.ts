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
import { EmailVerification } from "./emailVerification.model";
import { google, type GoogleProfile } from "./google.client";
import { hashOneTimeToken } from "./oneTimeToken";

const api = request(app);
const maya = { penName: "Maya", email: "maya@example.com", password: "a-long-calm-password" };

let sent: EmailMessage[] = [];
const confirmations = () => sent.filter((m) => m.subject === "Confirm your email for Sanad");

async function waitFor(check: () => boolean, ms = 2000) {
  const end = Date.now() + ms;
  while (!check() && Date.now() < end) await new Promise((r) => setTimeout(r, 10));
}
const settle = () => new Promise((r) => setTimeout(r, 150));

const tokenOf = (message: EmailMessage | undefined) => {
  const link = message?.text.match(/https?:\/\/\S+/)?.[0];
  assert.ok(link, "expected a link in the email");
  return new URL(link).searchParams.get("token") ?? "";
};

// Signs Maya up and returns her session cookie and the token from the email she was sent.
async function signUp() {
  const res = await api.post("/api/v1/auth/sign-up").send(maya).expect(201);
  await waitFor(() => confirmations().length > 0);
  return { cookie: cookieFrom(res, SESSION_COOKIE), token: tokenOf(confirmations().at(-1)) };
}

const verify = (token: string) => api.post("/api/v1/auth/email/verify").send({ token });
const resend = (cookie?: string) => {
  const req = api.post("/api/v1/auth/email/resend");
  return cookie ? req.set("Cookie", cookie) : req;
};
const me = async (cookie: string) => (await api.get("/api/v1/auth/me").set("Cookie", cookie)).body.user;
// Raw collection: Mongoose treats createdAt as unchangeable.
const aMinuteLater = () =>
  EmailVerification.collection.updateMany({}, { $set: { createdAt: new Date(Date.now() - 61_000) } });

before(connectTestDB);
beforeEach(async () => {
  await resetTestDB();
  sent = [];
  mock.method(mailer, "send", async (message: EmailMessage) => {
    sent.push(message);
  });
});
afterEach(() => mock.restoreAll());
after(disconnectTestDB);

describe("sign-up", () => {
  test("emails a confirmation link, stores only its hash, and the account starts unverified", async () => {
    const { cookie, token } = await signUp();

    assert.equal(confirmations()[0].to, maya.email);
    assert.ok(confirmations()[0].text.includes(`${env.CLIENT_ORIGIN}/verify-email?token=`));
    const stored = await EmailVerification.find().lean();
    assert.equal(stored.length, 1);
    assert.equal(stored[0].tokenHash, hashOneTimeToken(token));
    assert.equal((await me(cookie)).emailVerified, false);
  });
});

describe("POST /auth/email/verify", () => {
  test("confirms the email once; the same link then stops working", async () => {
    const { cookie, token } = await signUp();

    const res = await verify(token);
    assert.equal(res.status, 200);
    assert.equal(res.body.user.emailVerified, true);
    assert.equal((await me(cookie)).emailVerified, true);

    const again = await verify(token);
    assert.equal(again.status, 400);
    assert.equal(again.body.code, "VERIFY_TOKEN_INVALID");
  });

  test("doesn't sign anyone in: the link alone is never a way into the account", async () => {
    const { token } = await signUp();
    const res = await verify(token);
    assert.equal(res.get("Set-Cookie"), undefined);
  });

  test("refuses an expired or unknown link", async () => {
    const { cookie, token } = await signUp();
    await EmailVerification.updateMany({}, { expiresAt: new Date(Date.now() - 1000) });

    assert.equal((await verify(token)).body.code, "VERIFY_TOKEN_INVALID");
    assert.equal((await verify("x".repeat(43))).body.code, "VERIFY_TOKEN_INVALID");
    assert.equal((await me(cookie)).emailVerified, false);
  });

  test("two clicks racing with the same link: exactly one wins", async () => {
    const { token } = await signUp();
    const results = await Promise.all([verify(token), verify(token)]);
    assert.deepEqual(results.map((r) => r.status).sort(), [200, 400]);
  });
});

describe("POST /auth/email/resend", () => {
  test("needs a signed-in person", async () => {
    assert.equal((await resend()).status, 401);
  });

  test("sends at most one email a minute, and a newer link replaces the older one", async () => {
    const { cookie, token: first } = await signUp();

    await resend(cookie).expect(204);
    await settle();
    assert.equal(confirmations().length, 1, "the sign-up email counts toward the minute");

    await aMinuteLater();
    await resend(cookie).expect(204);
    await waitFor(() => confirmations().length > 1);
    const second = tokenOf(confirmations().at(-1));

    assert.notEqual(second, first);
    assert.equal((await verify(first)).status, 400);
    assert.equal((await verify(second)).status, 200);
  });

  test("sends nothing once the email is verified, or for a demo account", async () => {
    const { cookie, token } = await signUp();
    await verify(token).expect(200);
    await aMinuteLater();
    await resend(cookie).expect(204);

    const demo = cookieFrom(await api.post("/api/v1/auth/demo"), SESSION_COOKIE);
    await resend(demo).expect(204);
    await settle();

    assert.equal(confirmations().length, 1);
  });
});

describe("with Google", () => {
  test("after confirming the email, linking Google keeps the password", async () => {
    const { token } = await signUp();
    await verify(token).expect(200);

    const fern: GoogleProfile = { googleId: "google-sub-9", email: maya.email, emailVerified: true };
    mock.method(google, "fetchProfile", async () => fern);
    const start = await api.get("/api/v1/auth/google");
    const state = new URL(start.headers.location).searchParams.get("state") ?? "";
    await api
      .get(`/api/v1/auth/google/callback?code=fake&state=${encodeURIComponent(state)}`)
      .set("Cookie", cookieFrom(start, "sanad_google_state"));

    assert.equal((await User.findOne({ email: maya.email }).lean())?.googleId, fern.googleId);
    const signIn = await api.post("/api/v1/auth/sign-in").send({ email: maya.email, password: maya.password });
    assert.equal(signIn.status, 200);
  });
});
