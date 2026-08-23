/**
 * Booking response sanitisation.
 *
 * Booking documents carry internal commercial fields (`profit`, `butlerFee`) that
 * must never reach a customer's browser. Previously the create-booking endpoint,
 * which is public and unauthenticated, returned the saved Mongoose document
 * wholesale, so every quote exposed the staff cost and the retained margin to
 * anyone with developer tools open.
 *
 * These fields are still stored and are still available to the roles that need
 * them. Only the outbound JSON is filtered.
 *
 *   admin    sees everything, including profit
 *   butler   sees butlerFee (it is their own pay) but not profit
 *   customer sees neither
 */

// Never leaves the server unless the viewer is an admin.
const ADMIN_ONLY_FIELDS = ["profit"];

// Additionally withheld from customers and unauthenticated callers.
const STAFF_ONLY_FIELDS = ["butlerFee"];

/**
 * Resolve an audience string from the Express request.
 * Falls back to "customer", the most restrictive option, when there is no user.
 */
export const audienceFromRequest = (req) => {
  const user = req?.user;
  if (!user) return "customer";
  if (user.role === "admin" || user.email === "admin@gmail.com") return "admin";
  if (user.role === "butler") return "butler";
  return "customer";
};

/**
 * Strip internal financial fields from a single booking.
 * Accepts a Mongoose document or a plain object and always returns a plain object.
 */
export const sanitizeBooking = (booking, audience = "customer") => {
  if (!booking) return booking;

  const plain =
    typeof booking.toObject === "function" ? booking.toObject() : { ...booking };

  if (audience === "admin") return plain;

  for (const field of ADMIN_ONLY_FIELDS) delete plain[field];
  if (audience !== "butler") {
    for (const field of STAFF_ONLY_FIELDS) delete plain[field];
  }

  return plain;
};

/** Array convenience wrapper. */
export const sanitizeBookings = (bookings, audience = "customer") =>
  Array.isArray(bookings)
    ? bookings.map((b) => sanitizeBooking(b, audience))
    : bookings;
