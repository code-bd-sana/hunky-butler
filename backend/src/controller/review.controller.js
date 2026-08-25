import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import { storeNotification } from "../utils/utils.js";
import { sendNotification } from "../utils/notification.js";
import Booking from "../models/booking.model.js";
import {
  validateReviewInput,
  emailExactCaseInsensitive,
  summariseRatings,
} from "../utils/reviewSubmission.js";

/**
 * Customer submits a review from the link emailed when their booking completes.
 *
 * This route is deliberately unauthenticated: the customer follows a link from
 * their inbox and is usually not logged in. That made it, before this change,
 * an open endpoint that anyone could call in a loop to
 *
 *   1. push any butler's public averageRating up or down without limit, and
 *   2. fire an email AND a Twilio SMS to that butler on every single call.
 *
 * So the abuse control is not a session, it is proof that the review belongs to
 * real work: there must be a completed booking between this customer and this
 * butler. That is exactly when the review link is issued, so the legitimate
 * flow is unaffected, and one customer can leave one review per butler.
 */
export const addReview = async (req, res) => {
  try {
    const parsed = validateReviewInput(req.body);
    if (!parsed.ok) {
      return res.status(parsed.status).json({ message: parsed.error });
    }

    const booking = await Booking.findOne({
      email: emailExactCaseInsensitive(parsed.reviewerEmail),
      "butler.id": parsed.butler,
      status: "completed",
    }).select("_id");

    if (!booking) {
      return res.status(403).json({
        message:
          "We could not find a completed booking for this butler and email address, so this review cannot be accepted.",
      });
    }

    const already = await Review.findOne({
      reviewerEmail: emailExactCaseInsensitive(parsed.reviewerEmail),
      butler: parsed.butler,
    }).select("_id");

    if (already) {
      return res
        .status(409)
        .json({ message: "You have already left a review for this butler." });
    }

    const user = await User.findById(parsed.butler);
    if (!user) {
      return res.status(404).json({ message: "Butler not found" });
    }

    const saved = await Review.create({
      butler: parsed.butler,
      reviewerEmail: parsed.reviewerEmail,
      rating: parsed.rating,
      comment: parsed.comment,
    });

    // Recomputed from the reviews themselves rather than folded into the stored
    // average, so a bad historical value corrects itself instead of persisting.
    const all = await Review.find({ butler: parsed.butler }).select("rating").lean();
    const { averageRating, totalReviews } = summariseRatings(all.map((r) => r.rating));
    user.averageRating = averageRating;
    user.totalReviews = totalReviews;
    await user.save();

    const smsMsg = `Hunky Butler: You just received a ${parsed.rating} star review! Keep up the good work.`;
    const positive = parsed.rating >= 4;
    const htmlMessage = positive
      ? `
        <div style="font-family: Arial, sans-serif; background:#f0fff4; padding:20px; border-radius:8px; border: 1px solid #2f855a;">
          <h2 style="color:#2f855a;">Congratulations</h2>
          <p>You just received <b>${parsed.rating} stars</b> from a customer.</p>
          <p>Keep up the great work and continue providing amazing service.</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; background:#fffaf0; padding:20px; border-radius:8px; border: 1px solid #c05621;">
          <h2 style="color:#c05621;">You got ${parsed.rating} stars</h2>
          <p>Do not be discouraged. Every piece of feedback is a chance to improve.</p>
        </div>
      `;

    await storeNotification(user.email, `You got ${parsed.rating} stars`, "/dashboard", "");

    // Only reached once the booking check has passed, so this can no longer be
    // used to bill the company for SMS or to harass staff.
    await sendNotification({
      email: user.email,
      phone: user.phone,
      subject: "You received a new review!",
      message: smsMsg,
      html: htmlMessage,
      smsMessage: smsMsg,
    });

    res.status(200).json({ message: "Success", data: saved });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteReview = await Review.deleteOne({ _id: id });
    res.status(200).json({
      message: "Success",
      data: deleteReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getButlerReview = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const id = req.params.id;
    const allReview = await Review.find({ butler: id })
      .populate({ path: "reviewer", select: "-password -__v" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    res.status(200).json({
      message: "Success",
      data: allReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getSingleReview = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Review.findOne({ _id: id })
      .populate({ path: "reviewer", select: "-password -__v" })
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const getAllReview = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const allReview = await Review.find()
      .populate({ path: "reviewer", select: "-password -__v" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    res.status(200).json({
      message: "Success",
      data: allReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};
