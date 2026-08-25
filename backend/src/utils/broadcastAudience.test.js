import test from "node:test";
import assert from "node:assert/strict";
import {
  validateBroadcast,
  buildAudienceQuery,
  toRecipientEmails,
} from "./broadcastAudience.js";

test("rejects a broadcast with no title and no message", () => {
  const r = validateBroadcast({ title: "  ", message: "", recipients: { allUsers: true } });
  assert.equal(r.ok, false);
  assert.match(r.error, /title or a message/i);
});

test("rejects a broadcast with no audience selected", () => {
  const r = validateBroadcast({ title: "Hi", recipients: {} });
  assert.equal(r.ok, false);
  assert.match(r.error, /at least one audience/i);
});

test("accepts a title-only broadcast and trims it", () => {
  const r = validateBroadcast({ title: "  Closing early  ", recipients: { butler: true } });
  assert.equal(r.ok, true);
  assert.equal(r.body, "Closing early");
});

test("joins title and message into one body", () => {
  const r = validateBroadcast({ title: "Notice", message: "We close at 6", recipients: { customer: true } });
  assert.equal(r.body, "Notice We close at 6");
});

test("all users beats the role toggles and matches everyone", () => {
  assert.deepEqual(buildAudienceQuery({ allUsers: true, butler: true }), {});
});

test("butler and customer collapse into a single query, not two sends", () => {
  assert.deepEqual(buildAudienceQuery({ butler: true, customer: true }), {
    role: { $in: ["butler", "customer"] },
  });
});

test("a single role selects only that role", () => {
  assert.deepEqual(buildAudienceQuery({ butler: true }), { role: { $in: ["butler"] } });
});

test("no selection produces no query rather than matching everyone", () => {
  assert.equal(buildAudienceQuery({}), null);
});

test("recipients are de-duplicated", () => {
  const emails = toRecipientEmails([
    { email: "a@x.com" },
    { email: "a@x.com" },
    { email: "b@x.com" },
  ]);
  assert.deepEqual(emails, ["a@x.com", "b@x.com"]);
});

test("users without a usable email are dropped, not sent as blanks", () => {
  const emails = toRecipientEmails([
    { email: "a@x.com" },
    { email: "   " },
    { email: null },
    {},
  ]);
  assert.deepEqual(emails, ["a@x.com"]);
});
