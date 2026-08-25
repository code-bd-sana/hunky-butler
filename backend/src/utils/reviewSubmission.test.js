import test from "node:test";
import assert from "node:assert/strict";
import {
  validateReviewInput,
  emailExactCaseInsensitive,
  summariseRatings,
} from "./reviewSubmission.js";

const ID = "507f1f77bcf86cd799439011";
const ok = (over = {}) => ({ butler: ID, reviewerEmail: "sam@example.com", rating: 5, ...over });

test("accepts a well formed review", () => {
  const r = validateReviewInput(ok({ comment: "  great  " }));
  assert.equal(r.ok, true);
  assert.equal(r.rating, 5);
  assert.equal(r.comment, "great");
});

test("rejects a butler id that is not an ObjectId, rather than 500ing on a CastError", () => {
  const r = validateReviewInput(ok({ butler: "not-an-id" }));
  assert.equal(r.ok, false);
  assert.equal(r.status, 400);
});

test("rejects a missing or malformed reviewer email", () => {
  assert.equal(validateReviewInput(ok({ reviewerEmail: "" })).ok, false);
  assert.equal(validateReviewInput(ok({ reviewerEmail: "nope" })).ok, false);
});

test("rejects ratings outside 1 to 5", () => {
  for (const rating of [0, 6, -3, 1000]) {
    assert.equal(validateReviewInput(ok({ rating })).ok, false, `rating ${rating}`);
  }
});

test("rejects a fractional rating the schema would have accepted", () => {
  assert.equal(validateReviewInput(ok({ rating: 4.5 })).ok, false);
});

test("does not let the caller attribute the review to another user", () => {
  const r = validateReviewInput(ok({ reviewer: "507f1f77bcf86cd799439099" }));
  assert.equal(r.ok, true);
  assert.equal(r.reviewer, undefined);
});

test("normalises the reviewer email to lower case", () => {
  assert.equal(validateReviewInput(ok({ reviewerEmail: "Sam@Example.COM" })).reviewerEmail,
    "sam@example.com");
});

test("caps an overlong comment", () => {
  assert.equal(validateReviewInput(ok({ comment: "x".repeat(5000) })).comment.length, 2000);
});

test("email match is case insensitive and anchored", () => {
  const re = emailExactCaseInsensitive("sam@example.com");
  assert.equal(re.test("Sam@Example.com"), true);
  assert.equal(re.test("notsam@example.com"), false);
});

test("email match escapes regex characters instead of interpreting them", () => {
  assert.equal(emailExactCaseInsensitive("a.b+c@x.com").test("aXb+c@x.com"), false);
});

test("average is recomputed from the ratings themselves", () => {
  assert.deepEqual(summariseRatings([5, 4, 3]), { averageRating: 4, totalReviews: 3 });
});

test("no reviews means a zeroed summary, not NaN", () => {
  assert.deepEqual(summariseRatings([]), { averageRating: 0, totalReviews: 0 });
});
