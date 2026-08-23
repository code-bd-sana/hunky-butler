/**
 * Checks for the booking response sanitiser.
 *
 * Run with:  npm run test:sanitize
 *
 * There is no test runner configured in this project, so this file uses Node's
 * built-in assert and exits non-zero on failure. It can be dropped into a real
 * runner later without changes to the assertions.
 */

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

let failures = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log("  pass  " + name);
  } catch (err) {
    failures++;
    console.error("  FAIL  " + name + "\n        " + err.message);
  }
};

console.log("sanitizeBooking");

check("customers never receive profit or butlerFee", () => {
  const out = sanitizeBooking(booking, "customer");
  assert.equal(out.profit, undefined);
  assert.equal(out.butlerFee, undefined);
  assert.equal(out.price, 250, "price must still be returned");
  assert.equal(out.travelFee, 0, "travel fee is shown to the customer");
});

check("butlers see their own fee but not the margin", () => {
  const out = sanitizeBooking(booking, "butler");
  assert.equal(out.butlerFee, 180);
  assert.equal(out.profit, undefined);
});

check("admins see everything", () => {
  const out = sanitizeBooking(booking, "admin");
  assert.equal(out.profit, 70);
  assert.equal(out.butlerFee, 180);
});

check("unknown audience falls back to the most restrictive", () => {
  const out = sanitizeBooking(booking, "something-else");
  assert.equal(out.profit, undefined);
  assert.equal(out.butlerFee, undefined);
});

check("the original document is never mutated", () => {
  sanitizeBooking(booking, "customer");
  assert.equal(booking.profit, 70);
  assert.equal(booking.butlerFee, 180);
});

check("mongoose documents are converted via toObject", () => {
  const doc = { toObject: () => ({ ...booking }) };
  const out = sanitizeBooking(doc, "customer");
  assert.equal(out.profit, undefined);
  assert.equal(out.price, 250);
});

check("null and undefined pass through untouched", () => {
  assert.equal(sanitizeBooking(null, "customer"), null);
  assert.equal(sanitizeBooking(undefined, "customer"), undefined);
});

check("array wrapper sanitises every element", () => {
  const out = sanitizeBookings([booking, booking], "customer");
  assert.equal(out.length, 2);
  out.forEach((b) => assert.equal(b.profit, undefined));
});

check("array wrapper tolerates a non-array", () => {
  assert.equal(sanitizeBookings(null, "customer"), null);
});

console.log("audienceFromRequest");

check("no user means customer", () => {
  assert.equal(audienceFromRequest({}), "customer");
  assert.equal(audienceFromRequest(undefined), "customer");
});

check("role admin and the legacy admin email both map to admin", () => {
  assert.equal(audienceFromRequest({ user: { role: "admin" } }), "admin");
  assert.equal(
    audienceFromRequest({ user: { email: "admin@gmail.com" } }),
    "admin"
  );
});

check("role butler maps to butler", () => {
  assert.equal(audienceFromRequest({ user: { role: "butler" } }), "butler");
});

check("any other role maps to customer", () => {
  assert.equal(audienceFromRequest({ user: { role: "user" } }), "customer");
});

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
