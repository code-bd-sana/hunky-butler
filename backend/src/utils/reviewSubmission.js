/**
 * Pure helpers for review submission.
 *
 * Kept out of the controller so the rules can be tested without a database,
 * matching sanitizeBooking and broadcastAudience.
 */

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

/**
 * Validates and whitelists a review payload.
 *
 * The controller previously did `new Review(req.body)`, handing the client the
 * whole document. Schema strict mode dropped unknown keys, but `reviewer` is a
 * real field, so a caller could attribute a review to any user id they liked.
 * Only the four fields the review form actually sends are accepted here.
 */
export const validateReviewInput = (body = {}) => {
  const butler = typeof body.butler === "string" ? body.butler.trim() : "";
  const reviewerEmail =
    typeof body.reviewerEmail === "string" ? body.reviewerEmail.trim().toLowerCase() : "";
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!OBJECT_ID.test(butler)) {
    // Without this an arbitrary string reaches Mongo and throws a CastError,
    // which the controller reported as a generic 500.
    return { ok: false, status: 400, error: "A valid butler is required." };
  }

  if (!reviewerEmail || !reviewerEmail.includes("@")) {
    return { ok: false, status: 400, error: "A valid reviewer email is required." };
  }

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    // The schema already enforces min 1 / max 5, but it accepts 4.5 and rejects
    // bad input with a 500 rather than a useful message.
    return { ok: false, status: 400, error: "Rating must be a whole number from 1 to 5." };
  }

  return { ok: true, butler, reviewerEmail, rating, comment: comment.slice(0, 2000) };
};

/**
 * Case-insensitive exact match for an email, for looking a booking up by the
 * address in the emailed review link. Bookings store whatever the customer
 * typed, so a straight equality check would miss "Sam@Example.com".
 */
export const emailExactCaseInsensitive = (email) =>
  new RegExp(`^${String(email).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

/**
 * Average rating recomputed from the reviews themselves.
 *
 * The controller used to fold each new rating into the stored average:
 *   (avg * total + rating) / (total + 1)
 * That trusts whatever averageRating and totalReviews already hold, so any bad
 * write is baked in permanently and can never be corrected by later reviews.
 * Deriving both numbers from the review documents makes the collection the
 * source of truth, and a wrong value fixes itself on the next review.
 */
export const summariseRatings = (ratings = []) => {
  const valid = ratings.filter((r) => Number.isFinite(r));
  if (valid.length === 0) return { averageRating: 0, totalReviews: 0 };
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  return { averageRating: Math.round(mean * 100) / 100, totalReviews: valid.length };
};
