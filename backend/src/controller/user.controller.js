import User from "../models/user.model.js";
import { storeNotification } from "../utils/utils.js";
import { sendNotification } from "../utils/notification.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};



// customer controller - pagination ও search যোগ করুন
export const allCustomer = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Search condition
    const searchCondition = {
      role: 'customer',
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const customers = await User.find(searchCondition)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(searchCondition);

    res.status(200).json({
      message: "Success",
      data: customers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

export const allButler = async (req, res) => {
  
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    // Search condition
    const searchCondition = {
      role: 'butler',
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      })
    };

    // Fetch butlers with pagination and sorting
    const butlers = await User.find(searchCondition)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Total count for pagination
    const total = await User.countDocuments(searchCondition);

    // Response
    res.status(200).json({
      message: "Success",
      data: butlers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};




export const myProfile = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user && req.user.role !== "admin") {
      if (
        req.user.id !== id &&
        req.user._id?.toString() !== id &&
        req.user.email !== id
      ) {
        return res.status(403).json({
          message: "Forbidden: You can only view your own profile.",
        });
      }
    }
    const user = await User.findOne({
      $or: [
        ...(id && id.length === 24 ? [{ _id: id }] : []),
        { email: id },
      ],
    }).select("-password");
    res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, dob, email, firstName, lastName, gender, location, phone, postcode, profileImage, image, isButler } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (req.user && req.user.role !== "admin") {
      if (req.user.email !== email) {
        return res.status(403).json({
          message: "Forbidden: You can only update your own profile.",
        });
      }
    }

    const user = await User.findOne({ email: email });
if (!user) return res.status(404).json({ message: "User not found" });



const updated = await User.updateOne(
  { email },
  {
    $set: {
      bio,
      dob,
      firstName,
      lastName,
      gender,
      phone,
      location,
      postcode,
      image,
      profileImage: image,
      isButler: isButler !== undefined ? isButler : user.isButler,
    },
  }
);

    if(isButler === 'pending' && user.isButler !== 'pending'){
     const userEmailHtml = `
     <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
  <h1 style="color: #ff1673; font-size:28px; margin-bottom:20px;">Application Received!</h1>
  <p style="font-size:16px; margin: 15px 0;">
    Thank you for submitting your application to <strong>Hunkey Butler Service</strong>! 🙌
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    Your application has been received and is currently <strong>under review</strong>.
  </p>
</div>
     `;

     const smsMsg = "Hunky Butler: Your application has been received and is currently under review. We'll notify you soon!";

     await sendNotification({
       email,
       phone: phone || user.phone,
       subject: "Butler Application Received",
       message: smsMsg,
       html: userEmailHtml,
       smsMessage: smsMsg
     });
    }

 res.status(200).json({
      message:'Success',
      data: updated
    });
    
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      message:"Something went wrong!",
      error: error.message
    })
  }
}


export const rejectButler = async(req, res)=>{
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const updated = await User.updateOne({email: email}, {$set:{
      isButler:'reject'
    }});

    await storeNotification(email, 'Reject you application. Please submit valid information', '', '')
    
        const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
  <h1 style="color: #ff1673; font-size:28px; margin-bottom:20px;">Application Update</h1>
  <p style="font-size:16px; margin: 15px 0;">
    We regret to inform you that your application has been <strong>reviewed</strong> and cannot be accepted at this time. 😔
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    If you have any questions, please feel free to <strong>contact our team</strong>.
  </p>
</div>
        `;

        const smsMsg = "Hunky Butler: We regret to inform you that your butler application was not accepted at this time.";
    
        await sendNotification({
          email,
          phone: user.phone,
          subject: "Application Update",
          message: smsMsg,
          html: userEmailHtml,
          smsMessage: smsMsg
        });

        res.status(200).json({
          message:'Success',
          data:updated
        })
    
  } catch (error) {
    res.status(500).json({
      message:'Something went wrong!',
      error: error.message
    })
  }
}
export const suspendButler = async(req, res)=>{
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const updated = await User.updateOne({email: email}, {$set:{
      isButler:'suspend'
    }});

    await storeNotification(email, `Your Butler Account is suspended. Please contact support`, '', '')
        
        const userEmailHtml = `
         <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
  <h1 style="color: #ff1673; font-size:28px; margin-bottom:20px;">Account Suspended</h1>
  <p style="font-size:16px; margin: 15px 0;">
    Your Butler account has been <strong>suspended</strong>. ⚠️
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    Please contact our support team for more information regarding this action.
  </p>
</div>
        `;

        const smsMsg = "Hunky Butler: Your butler account has been suspended. Please contact support for assistance.";
    
        await sendNotification({
          email,
          phone: user.phone,
          subject: "Account Suspended",
          message: smsMsg,
          html: userEmailHtml,
          smsMessage: smsMsg
        });

        res.status(200).json({
          message:'Success',
          data:updated
        })
 
  } catch (error) {
    res.status(500).json({
      message:'Something went wrong!',
      error: error.message
    })
  }
}
export const activeButler = async(req, res)=>{
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const updated = await User.updateOne({email: email}, {$set:{
      isButler:'active'
    }});

    await storeNotification(email, 'Your Butler Application accepted', '', '')

        const userEmailHtml = `
         <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
  <h1 style="color: #ff1673; font-size:28px; margin-bottom:20px;">Congratulations!</h1>
  <p style="font-size:16px; margin: 15px 0;">
    Your application has been <strong>accepted</strong>! 🎉
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    Welcome to the <strong>Hunkey Butler Service</strong> family. We’re excited to have you on board!
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    You can now access your Butler dashboard and start managing your bookings.
  </p>
</div>
        `;

        const smsMsg = "Hunky Butler: Congratulations! Your application has been accepted. You can now access your Butler dashboard.";
    
        await sendNotification({
          email,
          phone: user.phone,
          subject: "Application Accepted",
          message: smsMsg,
          html: userEmailHtml,
          smsMessage: smsMsg
        });

        res.status(200).json({
          message:'Success',
          data:updated
        })
 
  } catch (error) {
    res.status(500).json({
      message:'Something went wrong!',
      error: error.message
    })
  }
}

export const getPendingButler = async(req, res)=>{
  try {
    const pendingButler = await User.find({isButler: 'pending'});
    res.status(200).json({
      message:"Success",
      data: pendingButler
    })
  } catch (error) {
    res.status(500).json({
      message:"Something went wrong!",
      error: error.message
    })
  }
}
