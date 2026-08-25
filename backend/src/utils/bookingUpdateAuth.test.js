import test from "node:test";
import assert from "node:assert/strict";
import {
  authorizeBookingUpdate,
  canAcceptAsButler,
  isPaidState,
} from "./bookingUpdateAuth.js";

const booking = {
  _id: "b1",
  email: "Sam@Example.com",
  price: 250,
  butler: [{ id: "butler1", accepted: false }],
};
const owner = { id: "u1", email: "sam@example.com", role: "customer" };
const stranger = { id: "u2", email: "mallory@example.com", role: "customer" };
const assigned = { id: "butler1", email: "b@example.com", role: "butler" };
const admin = { id: "a1", email: "admin@gmail.com", role: "admin" };

test("a stranger cannot touch someone else's booking at all", () => {
  const r = authorizeBookingUpdate({ booking, user: stranger, body: { paid: "unpaid" } });
  assert.equal(r.ok, false);
  assert.equal(r.status, 403);
});

test("the headline case: a registered user cannot mark a booking paid", () => {
  const r = authorizeBookingUpdate({ booking, user: stranger, body: { paid: "paid" } });
  assert.equal(r.ok, false);
});

test("even the owner cannot claim their own booking is paid", () => {
  const r = authorizeBookingUpdate({ booking, user: owner, body: { paid: "paid" } });
  assert.equal(r.ok, false);
  assert.equal(r.status, 403);
});

test("nor by way of paymentStatus", () => {
  for (const v of ["FULLY_PAID", "DEPOSIT_PAID", "PARTIALLY_PAID"]) {
    assert.equal(
      authorizeBookingUpdate({ booking, user: owner, body: { paymentStatus: v } }).ok,
      false,
      v
    );
  }
});

test("the real pay-later flow still works, and matches by email case-insensitively", () => {
  const r = authorizeBookingUpdate({
    booking,
    user: owner,
    body: { paymentMethod: "pay_later", paid: "unpaid", paymentType: "deposit", amountDue: 250 },
  });
  assert.equal(r.ok, true);
  assert.equal(r.fields.paymentMethod, "pay_later");
  assert.equal(r.fields.depositAmount, 20);
});

test("amounts come from the stored price, not from the request", () => {
  const r = authorizeBookingUpdate({
    booking,
    user: owner,
    body: { paymentType: "full", amountDue: 0, remainingBalance: 0, totalAmount: 0 },
  });
  assert.equal(r.fields.amountDue, 250);
  assert.equal(r.fields.remainingBalance, 250);
  assert.equal(r.fields.depositAmount, 0);
});

test("a customer cannot move the booking status", () => {
  const r = authorizeBookingUpdate({ booking, user: owner, body: { status: "completed" } });
  assert.equal(r.ok, false);
});

test("an assigned butler can move the status", () => {
  const r = authorizeBookingUpdate({ booking, user: assigned, body: { status: "completed" } });
  assert.equal(r.ok, true);
  assert.equal(r.fields.status, "completed");
});

test("an admin keeps full control, including correcting payment by hand", () => {
  const r = authorizeBookingUpdate({
    booking,
    user: admin,
    body: { paid: "paid", status: "completed", amountDue: 0 },
  });
  assert.equal(r.ok, true);
  assert.equal(r.fields.paid, "paid");
  assert.equal(r.fields.amountDue, 0);
});

test("a butler can only accept an assignment that is theirs", () => {
  assert.equal(canAcceptAsButler({ booking, user: assigned, butlerid: "butler1" }), true);
  assert.equal(canAcceptAsButler({ booking, user: assigned, butlerid: "butler9" }), false);
  assert.equal(canAcceptAsButler({ booking, user: admin, butlerid: "butler9" }), true);
});

test("paid state detection covers the values the codebase actually uses", () => {
  assert.equal(isPaidState("paid"), true);
  assert.equal(isPaidState("FULLY_PAID"), true);
  assert.equal(isPaidState("unpaid"), false);
  assert.equal(isPaidState("pending"), false);
  assert.equal(isPaidState(undefined), false);
});
