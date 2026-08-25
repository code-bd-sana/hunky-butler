/**
 * Who may change a booking, and which fields they may change.
 *
 * `PUT /api/booking/update` required only a session and then trusted the id in
 * the body. It wrote status, paid, paymentStatus, amountDue, remainingBalance
 * and depositAmount with no check that the booking had anything to do with the
 * caller. Registration is open, so anyone could create an account and mark any
 * booking as paid, which is a 250 pound service taken for nothing. The same call
 * could move a booking to completed, which fires the review request email and
 * SMS, or zero out what was owed.
 *
 * Two rules come out of that:
 *
 *   1. You must have something to do with the booking: own it, be a butler
 *      assigned to it, or be an admin.
 *   2. Claiming payment is not something a customer can do. Real payments are
 *      written directly by the payment controller after the gateway confirms,
 *      never through this route, so refusing paid and paymentStatus here costs
 *      the legitimate flow nothing.
 *
 * Amounts are derived from the booking's own stored price rather than taken
 * from the request. The quote wizard sends exactly those figures anyway, so the
 * behaviour is unchanged, but a customer can no longer post amountDue: 0.
 */

/** Payment state a customer must never be able to assert. */
const PAID_STATES = ["paid", "PAID", "FULLY_PAID", "DEPOSIT_PAID", "PARTIALLY_PAID", "completed"];

export const isPaidState = (value) =>
  typeof value === "string" && PAID_STATES.includes(value);

export const describeCaller = (booking = {}, user = {}) => {
  const isAdmin = user.role === "admin";
  const email = typeof user.email === "string" ? user.email.toLowerCase() : "";
  const bookingEmail =
    typeof booking.email === "string" ? booking.email.toLowerCase() : "";
  const isOwner = Boolean(email) && email === bookingEmail;
  const isAssignedButler = (booking.butler || []).some(
    (b) => b && b.id && String(b.id) === String(user.id || user._id)
  );
  return { isAdmin, isOwner, isAssignedButler };
};

/**
 * Decides whether the update may proceed and returns the fields that will
 * actually be written.
 */
export const authorizeBookingUpdate = ({ booking, user, body = {} }) => {
  const { isAdmin, isOwner, isAssignedButler } = describeCaller(booking, user);

  if (!isAdmin && !isOwner && !isAssignedButler) {
    return { ok: false, status: 403, error: "You do not have access to this booking." };
  }

  const fields = {};
  const {
    status,
    paymentType,
    paymentMethod,
    paid,
    paymentStatus,
  } = body;

  // Admins keep the behaviour they had, including correcting payment state by
  // hand, which the dashboard relies on.
  if (isAdmin) {
    for (const [k, v] of Object.entries(body)) {
      if (["id", "butlerid"].includes(k)) continue;
      if (v !== undefined) fields[k] = v;
    }
    return { ok: true, fields, role: "admin" };
  }

  // Moving a booking through its lifecycle belongs to the people delivering it.
  if (status !== undefined) {
    if (!isAssignedButler) {
      return { ok: false, status: 403, error: "Only an assigned butler or an admin can change the booking status." };
    }
    fields.status = status;
  }

  if (isPaidState(paid) || isPaidState(paymentStatus)) {
    return {
      ok: false,
      status: 403,
      error: "Payment status is set when the payment provider confirms it, not by this request.",
    };
  }

  if (paymentMethod !== undefined) fields.paymentMethod = paymentMethod;
  if (paymentType !== undefined) fields.paymentType = paymentType;

  // Amounts follow from the stored price, never from the request body.
  if (paymentMethod !== undefined || paymentType !== undefined) {
    const price = Number(booking.price);
    if (Number.isFinite(price) && price > 0) {
      const wantsDeposit = paymentType === "deposit" || paymentType === "DEPOSIT";
      fields.amountDue = price;
      fields.remainingBalance = price;
      fields.totalAmount = price;
      fields.depositAmount = wantsDeposit ? 20 : 0;
    }
  }

  return { ok: true, fields, role: isAssignedButler ? "butler" : "customer" };
};

/** A butler may only accept an assignment that is theirs. */
export const canAcceptAsButler = ({ booking, user, butlerid }) => {
  const { isAdmin } = describeCaller(booking, user);
  if (isAdmin) return true;
  if (!butlerid) return false;
  return String(butlerid) === String(user.id || user._id);
};
