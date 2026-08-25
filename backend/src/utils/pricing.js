/**
 * Authoritative pricing, server side.
 *
 * The quote wizard works out a price in the browser and posts it with the
 * booking. Both booking endpoints then believed it: createCheckoutSession did
 * `Number(bookingData.price)` and charged exactly that, and createBooking wrote
 * `req.body` straight into the document. Since neither route requires a session,
 * anyone could book a 250 pound service and pay 1 pound, or zero.
 *
 * The rate table below mirrors calculateBasePrice in
 * frontend/components/quote/SecondStep.jsx. Keep the two in step: if the rates
 * change in the wizard they must change here, or legitimate quotes start being
 * rejected.
 *
 * The travel multiplier is deliberately NOT recomputed here. It needs geocoding
 * and routing, which the API does not do, and it can only ever raise a price:
 * calculateDistanceMultiplier returns 1.0 inside the local radius and otherwise
 * 1.0 + km / 250, capped at 2.0. So the base price is a hard floor and twice the
 * base is a hard ceiling, and a quote can be bounds checked without any of the
 * geography. That catches the fraud case without the risk of reimplementing
 * distance maths and rejecting real bookings.
 */

export const MAX_DISTANCE_MULTIPLIER = 2.0;

/**
 * How far below the rate table a price may legitimately sit.
 *
 * The table below is not authoritative for every service. Checking it against
 * all 241 real bookings in production showed strippers selling at 100 to 114
 * against a table base of 150, because that service has never used the matrix.
 * A strict floor at the base price would have rejected those.
 *
 * A floor of 60 percent of base, with an absolute minimum of 50, rejects
 * <strong>none</strong> of the 197 priced real bookings while still refusing the
 * case this exists for: a 250 pound booking floored at 150 cannot be paid with
 * 1 pound. Tighten it only against fresh data, not by intuition: 70 percent
 * already rejects 7 real bookings.
 */
const MIN_PRICE_FRACTION = 0.6;
const ABSOLUTE_MIN_PRICE = 50;

/** Rounding tolerance, because the wizard rounds the final figure. */
const TOLERANCE = 1;

export const calculateBasePrice = (serviceSlug, durationHours, numberOfStaff) => {
  if (serviceSlug === "life-drawing") return 230;
  if (serviceSlug === "cocktail-masterclasses") return 140;

  if (serviceSlug === "buff-butlers") {
    const pricingMatrix = {
      1: { 1: 110, 2: 150, 3: 170 },
      2: { 1: 190, 2: 250, 3: 300 },
      3: { 1: 250, 2: 350, 3: 420 },
      4: { 1: 440, 2: 600, 3: 680 },
      5: { 1: 550, 2: 750, 3: 850 },
    };
    const duration = Math.ceil(Number(durationHours) || 0);
    const staff = Math.min(Math.max(Number(numberOfStaff) || 1, 1), 5);
    const selected = [1, 2, 3].includes(duration) ? duration : 3;
    return pricingMatrix[staff]?.[selected] || pricingMatrix[staff]?.[3] || 420;
  }

  return 150;
};

/**
 * Checks a client supplied price against what the rate table allows.
 *
 * `required` is used on the checkout path, where a missing price means charging
 * nothing. On plain booking creation a missing price is left alone, because
 * some existing records legitimately carry none and rejecting them would change
 * behaviour well beyond this fix.
 */
export const validateQuotedPrice = ({
  serviceName,
  durationHours,
  numberOfStaff,
  price,
  required = false,
} = {}) => {
  const base = calculateBasePrice(serviceName, durationHours, numberOfStaff);
  const supplied = Number(price);
  const missing =
    price === undefined || price === null || price === "" || Number.isNaN(supplied);

  // A price of zero is not fraud, it is an unpriced lead. The wizard falls back
  // to 0 when the distance lookup fails, and 44 of the 241 real bookings were
  // saved that way, so rejecting them would throw away nearly a fifth of
  // enquiries. They are allowed through on booking creation, where no money
  // moves, and refused on the checkout path, where charging 0 is the bug.
  if (missing || supplied <= 0) {
    if (required) {
      return { ok: false, error: "A valid price is required.", base };
    }
    return { ok: true, base, checked: false };
  }

  const floor = Math.max(
    ABSOLUTE_MIN_PRICE,
    Math.round(base * MIN_PRICE_FRACTION) - TOLERANCE
  );
  const cap = Math.round(base * MAX_DISTANCE_MULTIPLIER) + TOLERANCE;

  if (supplied < floor) {
    return { ok: false, base, error: "The submitted price is below the minimum for this booking." };
  }
  if (supplied > cap) {
    return { ok: false, base, error: "The submitted price is above the maximum for this booking." };
  }

  return { ok: true, base, checked: true, price: supplied };
};

/**
 * Butler fee, mirroring calculateButlerFee in the quote wizard.
 */
export const calculateButlerFee = (serviceSlug, durationHours, numberOfStaff) => {
  if (serviceSlug === "cocktail-masterclasses") return 140;
  if (serviceSlug === "strippers") return 150;
  const hourlyRates = { 1: 60, 2: 90, 3: 110 };
  const duration = Math.ceil(Number(durationHours) || 0);
  const rate = hourlyRates[duration] || hourlyRates[3];
  return rate * (Number(numberOfStaff) || 1);
};

/**
 * The money fields, derived rather than believed.
 *
 * The wizard sends butlerFee, travelFee and profit alongside the price, and the
 * admin dashboard reports on them. They were taken from the request, so a caller
 * could state their own profit. Recomputing keeps the dashboard working while
 * removing the caller from the equation entirely.
 */
export const deriveBookingFinancials = ({
  serviceName,
  durationHours,
  numberOfStaff,
  price,
} = {}) => {
  const base = calculateBasePrice(serviceName, durationHours, numberOfStaff);
  const total = Number(price);
  if (!Number.isFinite(total)) return null;
  const butlerFee = calculateButlerFee(serviceName, durationHours, numberOfStaff);
  const travelFee = Math.max(0, Math.round((total - base) * 100) / 100);
  return {
    basePrice: base,
    butlerFee,
    travelFee,
    profit: Math.round((total - (butlerFee + travelFee)) * 100) / 100,
  };
};

export const FORBIDDEN_BOOKING_FIELDS = [
  "paid",
  "paymentStatus",
  "amountPaid",
  "status",
  "butlerFee",
  "profit",
  "squarePaymentId",
  "squareOrderId",
  "stripePaymentIntentId",
  "receiptUrl",
  "butler",
  "_id",
];

export const stripForbiddenBookingFields = (data = {}) => {
  const clean = { ...data };
  for (const f of FORBIDDEN_BOOKING_FIELDS) delete clean[f];
  return clean;
};
