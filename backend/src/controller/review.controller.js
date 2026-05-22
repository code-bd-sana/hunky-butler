import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import { storeNotification } from "../utils/utils.js";
import { sendNotification } from "../utils/notification.js";

export const addReview = async (req, res) => {
  try {
    const data = req.body;
    const newReview = new Review(data);
    const saved = await newReview.save();

    // Butler খুঁজে বের করা
    const user = await User.findById(data.butler);

    if (!user) {
       return res.status(404).json({ message: "Butler not found" });
    }

    // নতুন average rating হিসাব করা
    const newAverage =
      (user.averageRating * user.totalReviews + data.rating) /
      (user.totalReviews + 1);

    user.averageRating = newAverage;
    user.totalReviews += 1;
    await user.save();

    // এখন notification পাঠানো হবে
    let subject = "You received a new review!";
    let htmlMessage = "";
    let smsMsg = `Hunky Butler: You just received a ${data.rating} star review! Keep up the good work.`;

    await storeNotification(user?.email, `⭐ You got ${data.rating} star`, '', '')

    if (data.rating >= 4) {
      htmlMessage = `
        <div style="font-family: Arial, sans-serif; background:#f0fff4; padding:20px; border-radius:8px; border: 1px solid #2f855a;">
          <h2 style="color:#2f855a;">🎉 Congratulations!</h2>
          <p>You just received <b>${data.rating} star</b> from a customer.</p>
          <p>Keep up the great work and continue providing amazing service!</p>
        </div>
      `;
    } else {
      htmlMessage = `
        <div style="font-family: Arial, sans-serif; background:#fffaf0; padding:20px; border-radius:8px; border: 1px solid #c05621;">
          <h2 style="color:#c05621;">⭐ You got ${data.rating} star</h2>
          <p>Don't be discouraged. Every feedback is a chance to improve!</p>
          <p>Keep trying your best, we believe in you. 💪</p>
        </div>
      `;
    }

    // Send Email + SMS to butler
    await sendNotification({
      email: user.email,
      phone: user.phone,
      subject: subject,
      message: smsMsg,
      html: htmlMessage,
      smsMessage: smsMsg
    });

    res.status(200).json({
      message: "Success",
      data: saved,
    });

  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
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
