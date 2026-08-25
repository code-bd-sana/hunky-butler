import Notificaton from "../models/notification.model.js";
import User from "../models/user.model.js";
import { adminGmail, storeNotification } from "../utils/utils.js";
import {
  validateBroadcast,
  buildAudienceQuery,
  toRecipientEmails,
} from "../utils/broadcastAudience.js";

export const createNotificaiton = async (req, res) => {
  try {
    const data = req.body;
    const { sendToAllUser, sendToButler, sendToCustomer, title, message } =
      req.body;
  } catch (error) {
    res.status(500).json({
      message: "Something Went wrong!",
      error: error.message,
    });
  }
};



export const getNotification = async (req, res) => {
  try {
    const email = req.params.email;

    if (req.user && req.user.role !== "admin") {
      if (req.user.email !== email) {
        return res.status(403).json({
          message: "Forbidden: You can only view your own notifications.",
        });
      }
    }

    // User role fetch

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = user.role;

    // Filter conditions build
    let filter = {
      $or: [
        { receiver: email }, // always include user’s own notifications
      ],
    };

    if (role === "butler") {
      filter.$or.push({ receiver: "butler" });
    } else if (role === "customer") {
      filter.$or.push({ receiver: "customer" });
    }

    // “all” notifications should be visible to everyone
    filter.$or.push({ receiver: "all" });

    // Fetch data
    const data = await Notificaton.find(filter)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error,
    });
  }
};





export const markSeen = async(req, res)=>{

  console.log('first')
  try {
    const id = req.params.id;

    const makeSeen = await Notificaton.updateOne({
      _id:id
    }, {$set:{
      seen: true
    }})

    res.status(200).json({
      message:"Success",
      data: makeSeen
    })
    
  } catch (error) {
    console.log(error, 'personal error')
    res.status(500).json({
      message:"Something went wrong",
      error
    })
  }
}

export const markSeenAllNotification = async (req, res) => {
  try {
    const email = req.params.email;

    if (req.user && req.user.role !== "admin") {
      if (req.user.email !== email) {
        return res.status(403).json({
          message: "Forbidden: You can only modify your own notifications.",
        });
      }
    }

    const updated = await Notificaton.updateMany({ receiver: email }, { $set: { seen: true } });

  res.status(200).json({
    message:'Success',
    data:updated
  })
 } catch (error) {
  console.log(req.params.email)
  console.log(error)
  res.status(500).json({
    message:"Something went wrong!",
    error
  })
 }
}







/**
 * Admin broadcast: writes one in-app notification per recipient.
 *
 * This endpoint had no authentication of any kind. Every other route on this
 * router carries verifyUser, but the POST was mounted bare, and nothing else in
 * the app applies a global guard, so any unauthenticated caller could write an
 * arbitrary message to every user on file. verifyAdmin is now applied on the
 * route. The rest of the hardening here is about what a legitimate admin can do
 * by accident:
 *
 *   - Empty sends. An empty title and message stored a body of one space.
 *   - Silent no-op sends. No audience selected still returned "Success".
 *   - Duplicate sends. "All users" plus a role, or butler plus customer, ran a
 *     separate query per toggle and stored one row per match, so overlapping
 *     users received the same message two or three times.
 *   - A wrong link on every row. The call passed adminGmail into the `link`
 *     argument (the signature is receiver, message, link, type), so every
 *     broadcast notification linked to an email address, and `type` is not even
 *     a field on the model, so it was silently dropped.
 *   - A row-at-a-time write. Recipients were saved in a sequential await loop,
 *     so a failure part-way left a partial broadcast with no way to tell how far
 *     it got. One insertMany replaces it.
 *
 * The response now reports how many recipients were written so the admin UI can
 * confirm the real number instead of a bare "Success".
 */
export const createNotification = async (req, res) => {
  try {
    const parsed = validateBroadcast(req.body);
    if (!parsed.ok) {
      return res.status(400).json({ message: parsed.error });
    }

    const query = buildAudienceQuery(parsed.audience);
    if (!query) {
      return res.status(400).json({ message: "Select at least one audience." });
    }

    const users = await User.find(query, "email").lean();
    const emails = toRecipientEmails(users);

    if (emails.length === 0) {
      return res.status(200).json({
        message: "No recipients matched that audience.",
        recipientCount: 0,
      });
    }

    await Notificaton.insertMany(
      emails.map((email) => ({
        sender: req.user?.email || adminGmail,
        receiver: email,
        message: parsed.body,
        link: "/dashboard",
      }))
    );

    // Every broadcast is attributable. Without this there is no way to tell who
    // sent a message that went to the whole user base.
    console.log(
      `[broadcast] ${req.user?.email || "unknown"} sent to ${emails.length} recipient(s); audience=${JSON.stringify(parsed.audience)}`
    );

    res.status(200).json({ message: "Success", recipientCount: emails.length });
  } catch (error) {
    console.error("Broadcast failed:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * Recipient counts for the admin UI, so the confirmation step can state exactly
 * how many people a broadcast will reach before it is sent.
 */
export const getAudienceCount = async (req, res) => {
  try {
    const [allUsers, butler, customer] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "butler" }),
      User.countDocuments({ role: "customer" }),
    ]);
    res.status(200).json({ allUsers, butler, customer });
  } catch (error) {
    console.error("Audience count failed:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
