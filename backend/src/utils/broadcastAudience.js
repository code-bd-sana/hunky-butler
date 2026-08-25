/**
 * Pure helpers for the admin notification broadcast.
 *
 * Kept out of the controller so the audience rules can be tested without a
 * database, the same way sanitizeBooking is.
 */

/**
 * Validates a broadcast payload from the admin form.
 *
 * Previously the controller accepted anything: an empty title and message
 * produced a notification whose body was a single space, and a payload with no
 * audience selected returned "Success" while sending to nobody.
 */
export const validateBroadcast = (payload = {}) => {
  const title = String(payload.title ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const recipients = payload.recipients ?? {};

  if (!title && !message) {
    return { ok: false, error: "A title or a message is required." };
  }

  const allUsers = Boolean(recipients.allUsers);
  const butler = Boolean(recipients.butler);
  const customer = Boolean(recipients.customer);

  if (!allUsers && !butler && !customer) {
    return { ok: false, error: "Select at least one audience." };
  }

  return {
    ok: true,
    title,
    message,
    body: [title, message].filter(Boolean).join(" "),
    audience: { allUsers, butler, customer },
  };
};

/**
 * Turns the three audience toggles into a single Mongo query.
 *
 * "All users" wins outright. Selecting butler and customer together used to run
 * two separate queries and store one notification per matching query, so anyone
 * holding both selections (or "all users" plus a role) received duplicates.
 * Collapsing to one query removes that whole class of double-send.
 */
export const buildAudienceQuery = ({ allUsers, butler, customer } = {}) => {
  if (allUsers) return {};

  const roles = [];
  if (butler) roles.push("butler");
  if (customer) roles.push("customer");

  if (roles.length === 0) return null;
  return { role: { $in: roles } };
};

/**
 * De-duplicates the recipient list. A user with no email cannot receive an
 * in-app notification (receiver is required on the model), so those are dropped
 * rather than throwing mid-broadcast and leaving a partial send.
 */
export const toRecipientEmails = (users = []) => [
  ...new Set(
    users
      .map((u) => (typeof u?.email === "string" ? u.email.trim() : ""))
      .filter(Boolean)
  ),
];
