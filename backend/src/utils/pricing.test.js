import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateBasePrice,
  validateQuotedPrice,
  stripForbiddenBookingFields,
  deriveBookingFinancials,
} from "./pricing.js";

test("base price matches the wizard rate table", () => {
  assert.equal(calculateBasePrice("buff-butlers", 2, 2), 250);
  assert.equal(calculateBasePrice("buff-butlers", 3, 5), 850);
  assert.equal(calculateBasePrice("buff-butlers", 1, 1), 110);
  assert.equal(calculateBasePrice("life-drawing", 2, 2), 230);
  assert.equal(calculateBasePrice("cocktail-masterclasses", 2, 2), 140);
  assert.equal(calculateBasePrice("strippers", 0.25, 1), 150);
});

test("staff count is clamped to the table rather than falling through", () => {
  assert.equal(calculateBasePrice("buff-butlers", 2, 99), 750);
  assert.equal(calculateBasePrice("buff-butlers", 2, 0), 150);
});

test("a fractional duration rounds up, as the wizard does", () => {
  // ceil(1.5) is 2, so this is the 2 hour / 2 staff cell, 250.
  assert.equal(calculateBasePrice("buff-butlers", 1.5, 2), 250);
});

const quote = (over = {}) => ({
  serviceName: "buff-butlers",
  durationHours: 2,
  numberOfStaff: 2,
  ...over,
});

test("rejects the one pound booking for a 250 pound service", () => {
  const r = validateQuotedPrice(quote({ price: 1 }));
  assert.equal(r.ok, false);
  assert.equal(r.base, 250);
});

test("rejects a zero and a negative price", () => {
  assert.equal(validateQuotedPrice(quote({ price: 0 })).ok, false);
  assert.equal(validateQuotedPrice(quote({ price: -100 })).ok, false);
});

test("accepts the exact base price, which is a local booking", () => {
  assert.equal(validateQuotedPrice(quote({ price: 250 })).ok, true);
});

test("accepts a travel uplift up to the 2.0 cap", () => {
  assert.equal(validateQuotedPrice(quote({ price: 375 })).ok, true);
  assert.equal(validateQuotedPrice(quote({ price: 500 })).ok, true);
});

test("rejects a price above what the distance cap could ever produce", () => {
  assert.equal(validateQuotedPrice(quote({ price: 501 + 1 })).ok, false);
});

test("tolerates the wizard rounding by a pound", () => {
  assert.equal(validateQuotedPrice(quote({ price: 249 })).ok, true);
});

test("a missing price is allowed unless the caller requires one", () => {
  assert.equal(validateQuotedPrice(quote({ price: undefined })).ok, true);
  assert.equal(validateQuotedPrice(quote({ price: undefined, required: true })).ok, false);
});

test("a non numeric price is not silently treated as zero", () => {
  const r = validateQuotedPrice(quote({ price: "free", required: true }));
  assert.equal(r.ok, false);
});

test("caller cannot set payment or status fields", () => {
  const clean = stripForbiddenBookingFields({
    firstName: "Sam",
    price: 250,
    paid: "paid",
    status: "completed",
    amountPaid: 250,
    profit: 999,
    butlerFee: 0,
    _id: "deadbeefdeadbeefdeadbeef",
  });
  assert.deepEqual(Object.keys(clean).sort(), ["firstName", "price"]);
});

test("financials are derived from the rate table, not from the request", () => {
  // 2 butlers, 2 hours: base 250, butler fee 90 x 2 = 180.
  const f = deriveBookingFinancials({
    serviceName: "buff-butlers",
    durationHours: 2,
    numberOfStaff: 2,
    price: 300,
    profit: 99999,
    butlerFee: 0,
  });
  assert.equal(f.basePrice, 250);
  assert.equal(f.butlerFee, 180);
  assert.equal(f.travelFee, 50);
  assert.equal(f.profit, 70);
});

test("a local booking has no travel fee rather than a negative one", () => {
  const f = deriveBookingFinancials({
    serviceName: "buff-butlers", durationHours: 2, numberOfStaff: 2, price: 249,
  });
  assert.equal(f.travelFee, 0);
});

test("no price means nothing to derive", () => {
  assert.equal(deriveBookingFinancials({ serviceName: "buff-butlers", price: "x" }), null);
});
