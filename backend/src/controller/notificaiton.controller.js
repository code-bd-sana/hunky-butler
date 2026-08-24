import Notificaton from "../models/notification.model.js";
import User from "../models/user.model.js";
import { adminGmail, storeNotification } from "../utils/utils.js";

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







export const createNotification = async (req, res) => {
  try {
    const data = req.body;
    const message = (data?.title || '') + ' ' + (data?.message || '');
    
    // Helper function to send notifications to multiple emails
    const sendToEmails = async (emails) => {
      for (const email of emails) {
        await storeNotification(email, message, adminGmail, '');
      }
    };

    // All users
    if (data?.recipients?.allUsers) {
      const allUsers = await User.find({}, 'email'); // শুধু email field
      const emails = allUsers.map(u => u.email);
      await sendToEmails(emails);
    }

    // Butler users
    if (data?.recipients?.butler) {
      const butlers = await User.find({ role: 'butler' }, 'email');
      const emails = butlers.map(u => u.email);
      await sendToEmails(emails);
    }

    // Customer users
    if (data?.recipients?.customer) {
      const customers = await User.find({ role: 'customer' }, 'email');
      const emails = customers.map(u => u.email);
      await sendToEmails(emails);
    }

    res.status(200).json({ message: "Success" });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
      error
    });
  }
};
