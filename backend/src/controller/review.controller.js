import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";

export const addReview = async (req, res) => {
  try {
    const data = req.body;
    const newReview = new Review(data);
    const saved = await newReview.save();

    // Butler খুঁজে বের করা
    const user = await User.findById(data.butler);

    // নতুন average rating হিসাব করা
    const newAverage =
      (user.averageRating * user.totalReviews + data.rating) /
      (user.totalReviews + 1);

    user.averageRating = newAverage;
    user.totalReviews += 1;
    await user.save();

    // এখন email পাঠানো হবে
    let subject = "You received a new review!";
    let message = "";

    if (data.rating >= 4) {
      message = `
        <div style="font-family: Arial, sans-serif; background:#f0fff4; padding:20px; border-radius:8px;">
          <h2 style="color:#2f855a;">🎉 Congratulations!</h2>
          <p>You just received <b>${data.rating} star</b> from a customer.</p>
          <p>Keep up the great work and continue providing amazing service!</p>
        </div>
      `;
    } else {
      message = `
        <div style="font-family: Arial, sans-serif; background:#fffaf0; padding:20px; border-radius:8px;">
          <h2 style="color:#c05621;">⭐ You got ${data.rating} star</h2>
          <p>Don't be discouraged. Every feedback is a chance to improve!</p>
          <p>Keep trying your best, we believe in you. 💪</p>
        </div>
      `;
    }


      const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "bannah76769@gmail.com",
            pass: "noqq kzxv olzf clzz",
          },
        });
    

    await transporter.sendMail({
      from: `"Butler Service" <${process.env.SMTP_USER}>`,
      to: user.email, 
      subject: subject,
      html: message,
    });

    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
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
    const limit = req.query.limit;
    const skip = req.query.skip;

    const id = req.params.id;
    const allReview = await Review.findOne({ butler: id })
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
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
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
    const skip = req.query.skip;
    const limit = req.query.limit;
    const allReview = await Review.find()
      .populate({ path: "reviewer", select: "-password -__v" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .skip(skip)
      .limit(limit);
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
