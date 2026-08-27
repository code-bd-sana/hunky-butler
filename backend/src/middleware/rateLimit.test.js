import test from "node:test";
import assert from "node:assert/strict";
import { consumeAttempt, resetRateLimits, limitByEmail } from "./rateLimit.js";

const opts = { limit: 3, windowMs: 1000 };

test("allows attempts up to the limit, then refuses", () => {
  resetRateLimits();
  for (let i = 0; i < 3; i++) {
    assert.equal(consumeAttempt("login:a@b.com", opts).allowed, true, `attempt ${i + 1}`);
  }
  assert.equal(consumeAttempt("login:a@b.com", opts).allowed, false);
});

test("one address being throttled does not affect another", () => {
  resetRateLimits();
  for (let i = 0; i < 4; i++) consumeAttempt("login:victim@b.com", opts);
  assert.equal(consumeAttempt("login:victim@b.com", opts).allowed, false);
  assert.equal(consumeAttempt("login:someone-else@b.com", opts).allowed, true);
});

test("scopes are independent, so logging in does not consume OTP attempts", () => {
  resetRateLimits();
  for (let i = 0; i < 4; i++) consumeAttempt("login:a@b.com", opts);
  assert.equal(consumeAttempt("login:a@b.com", opts).allowed, false);
  assert.equal(consumeAttempt("otp:a@b.com", opts).allowed, true);
});

test("the window expires, so nobody is locked out permanently", () => {
  resetRateLimits();
  const t0 = 1_000_000;
  for (let i = 0; i < 4; i++) consumeAttempt("login:a@b.com", { ...opts, now: t0 });
  assert.equal(consumeAttempt("login:a@b.com", { ...opts, now: t0 }).allowed, false);
  assert.equal(consumeAttempt("login:a@b.com", { ...opts, now: t0 + 1001 }).allowed, true);
});

test("a refusal reports how long to wait", () => {
  resetRateLimits();
  const t0 = 2_000_000;
  for (let i = 0; i < 4; i++) consumeAttempt("login:a@b.com", { limit: 3, windowMs: 60_000, now: t0 });
  const r = consumeAttempt("login:a@b.com", { limit: 3, windowMs: 60_000, now: t0 });
  assert.equal(r.allowed, false);
  assert.ok(r.retryAfterSeconds > 0 && r.retryAfterSeconds <= 60);
});

const runMiddleware = (mw, req) =>
  new Promise((resolve) => {
    const res = {
      statusCode: null,
      headers: {},
      set(k, v) { this.headers[k] = v; return this; },
      status(c) { this.statusCode = c; return this; },
      json(b) { resolve({ blocked: true, status: this.statusCode, body: b, headers: this.headers }); },
    };
    mw(req, res, () => resolve({ blocked: false }));
  });

test("middleware blocks the email once over the limit and sets Retry-After", async () => {
  resetRateLimits();
  const mw = limitByEmail({ limit: 2, windowMs: 60_000, scope: "login" });
  const req = { body: { email: "Brute@Example.com" } };
  assert.equal((await runMiddleware(mw, req)).blocked, false);
  assert.equal((await runMiddleware(mw, req)).blocked, false);
  const third = await runMiddleware(mw, req);
  assert.equal(third.blocked, true);
  assert.equal(third.status, 429);
  assert.ok(third.headers["Retry-After"]);
});

test("email matching is case and whitespace insensitive, so casing does not reset the count", async () => {
  resetRateLimits();
  const mw = limitByEmail({ limit: 2, windowMs: 60_000, scope: "login" });
  await runMiddleware(mw, { body: { email: "a@b.com" } });
  await runMiddleware(mw, { body: { email: "  A@B.COM  " } });
  const third = await runMiddleware(mw, { body: { email: "A@b.CoM" } });
  assert.equal(third.blocked, true);
});

test("a request with no email passes through rather than sharing one bucket", async () => {
  resetRateLimits();
  const mw = limitByEmail({ limit: 1, windowMs: 60_000, scope: "login" });
  assert.equal((await runMiddleware(mw, { body: {} })).blocked, false);
  assert.equal((await runMiddleware(mw, { body: {} })).blocked, false);
});

test("the email can come from the route param as well as the body", async () => {
  resetRateLimits();
  const mw = limitByEmail({ limit: 1, windowMs: 60_000, scope: "otp" });
  assert.equal((await runMiddleware(mw, { params: { email: "x@y.com" } })).blocked, false);
  assert.equal((await runMiddleware(mw, { params: { email: "x@y.com" } })).blocked, true);
});
