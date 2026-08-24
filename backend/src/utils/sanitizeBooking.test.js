/**
 * Tests for the booking response sanitiser.
 *
 * Uses Node's built-in test runner (no dependencies). Run with:
 *
 *   npm test                 # discovers every *.test.js under the backend
 *   npm run test:sanitize    # just this file
 *
 * These were previously a hand-rolled check() harness that exited non-zero on
 * failure. They now run under node:test so `npm test` is a real command and a
 * CI step has something to call.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeBooking,
  sanitizeBookings,
  audienceFromRequest,
} from "./sanitizeBooking.js";

const booking = {
  _id: "6a8aed03aebb982159da06f7",
  email: "customer@example.com",
  price: 250,
  butlerFee: 180,
  travelFee: 0,
  profit: 70,
  totalAmount: 250,
};

test("customers never receive profit or butlerFee", () => {
  const out = sanitizeBooking(booking, "customer");
  assert.equal(out.profit, undefined);
  assert.equal(out.butlerFee, undefined);
  assert.equal(out.price, 250, "price must still be returned");
  assert.equal(out.travelFee, 0, "travel fee is shown to the customer");
});

test("butlers see their own fee but not the margin", () => {
  const out = sanitizeBooking(booking, "butler");
  assert.equal(out.butlerFee, 180);
  assert.equal(out.profit, undefined);
});

test("admins see everything", () => {
  const out = sanitizeBooking(booking, "admin");
  assert.equal(out.profit, 70);
  assert.equal(out.butlerFee, 180);
});

test("unknown audience falls back to the most restrictive", () => {
  const out = sanitizeBooking(booking, "something-else");
  assert.equal(out.profit, undefined);
  assert.equal(out.butlerFee, undefined);
});

test("the original document is never mutated", () => {
  sanitizeBooking(booking, "customer");
  assert.equal(booking.profit, 70);
  assert.equal(booking.butlerFee, 180);
});

test("mongoose documents are converted via toObject", () => {
  const doc = { toObject: () => ({ ...booking }) };
  const out = sanitizeBooking(doc, "customer");
  assert.equal(out.profit, undefined);
  assert.equal(out.price, 250);
});

test("null and undefined pass through untouched", () => {
  assert.equal(sanitizeBooking(null, "customer"), null);
  assert.equal(sanitizeBooking(undefined, "customer"), undefined);
});

test("array wrapper sanitises every element", () => {
  const out = sanitizeBookings([booking, booking], "customer");
  assert.equal(out.length, 2);
  out.forEach((b) => assert.equal(b.profit, undefined));
});

test("array wrapper tolerates a non-array", () => {
  assert.equal(sanitizeBookings(null, "customer"), null);
});

test("no user means customer", () => {
  assert.equal(audienceFromRequest({}), "customer");
  assert.equal(audienceFromRequest(undefined), "customer");
});

test("admin role maps to admin; the email alone no longer does", () => {
  assert.equal(audienceFromRequest({ user: { role: "admin" } }), "admin");
  // The admin@gmail.com hard-coded override was removed: identity is by role
  // only. An account with that email but a non-admin role is not admin.
  assert.equal(
    audienceFromRequest({ user: { email: "admin@gmail.com" } }),
    "customer"
  );
});

test("role butler maps to butler", () => {
  assert.equal(audienceFromRequest({ user: { role: "butler" } }), "butler");
});

test("any other role maps to customer", () => {
  assert.equal(audienceFromRequest({ user: { role: "user" } }), "customer");
});
