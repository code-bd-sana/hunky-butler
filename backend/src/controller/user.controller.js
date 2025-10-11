// import User from "../models/user.model.js"

import User from "../models/user.model.js";
import nodemailer from 'nodemailer'
import { storeNotification } from "../utils/utils.js";

// import User from "../models/user.model";

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

export const allButler = async(req, res)=>{
  try {
    const butler = await User.find({role:"butler"});
    res.status(200).json({
      message:"Success",
      data:butler

    })
    
  } catch (error) {
    res.status(500).json({
      message:"Something went wrong",
    })
  }
}




export const myProfile = async(req, res)=>{
  try {
    const id = req.params.id;
    const user = await User.findOne({_id:id}).select('-password');
    res.status(200).json({
      message:'Success',
      data: user
    })
    
  } catch (error) {
    res.status(500).json({
      message:"Something went wrong!"
    })
  }
}




export const updateProfile = async(req, res)=>{
  try {
    const {bio, dob, email, firstName, lastName, gender, location, phone, postcode, profileImage, image, isButler}  = req.body;
    console.log(email, 'amo to emol amdarho')


    if(!email){
      return res.status(500).json({
        message:"Email Not Found!"
      })
    }

    const user = await User.findOne({email: email})

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

 res.status(200).json({
      message:'Success',
      data: updated
    })

    console.log(updated)

    if(isButler){
          const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "bannah76769@gmail.com",
            pass: "noqq kzxv olzf clzz",
          },
        });


     const userEmailHtml = `
     <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border-radius: 12px;">
  <h1 style="color: #ff1673; font-size:28px; margin-bottom:20px;">Application Received!</h1>
  <p style="font-size:16px; margin: 15px 0;">
    Thank you for submitting your application to <strong>Hunkey Butler Service</strong>! 🙌
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    Your application has been received and is currently <strong>under review</strong>.
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    Our team will review your details and get back to you as soon as possible.
  </p>

  <p style="font-size:14px; color:#888; margin-top:20px;">
    We appreciate your interest in joining our team and look forward to connecting with you soon.
  </p>
</div>

     `

  await transporter.sendMail({
          from: '"Hunky Butler Service"',
          to: email,
          subject: "Applicaiton accepted",
          html: userEmailHtml,
        });


    }
    
    
   
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:"Something went wrong!",
      error
    
    })
  }
}


export const rejectButler = async(req, res)=>{
  try {
    const email = req.params.email;
    const updated = await User.updateOne({email: email}, {$set:{
      isButler:'reject'
    }});

        res.status(200).json({
      message:'Success',
      data:updated
    })


    storeNotification(email, 'Reject you application. Please submit valid infromation', '', '')
       const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "bannah76769@gmail.com",
            pass: "noqq kzxv olzf clzz",
          },
        });
    
        // User email HTML template
        const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border-radius: 12px;">
  <h1 style="color: #ff1673; font-size:28px; margin-bottom:20px;">Application Update</h1>
  <p style="font-size:16px; margin: 15px 0;">
    We regret to inform you that your application has been <strong>reviewed</strong> and cannot be accepted at this time. 😔
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    Something else came up during the review process, and unfortunately we are unable to move forward with your application.
  </p>
  <p style="font-size:16px; margin: 15px 0;">
    If you have any questions or would like more information, please feel free to <strong>contact our team</strong>.
  </p>

  <div style="margin-top:25px;">
    <a href="mailto:support@hunkeybutler.com" style="display:inline-block; padding:12px 25px; background:#ff1673; color:#fff; text-decoration:none; border-radius:8px; font-weight:bold;">
      Contact Us
    </a>
  </div>

  <p style="font-size:14px; color:#888; margin-top:20px;">
    Thank you for your interest in the Hunkey Butler Service. We wish you the best in your future endeavors.
  </p>
</div>


        `;
    
        // Send email to user
        await transporter.sendMail({
          from: '"Hunky Butler Service"',
          to: email,
          subject: "Reject Applicaiton",
          html: userEmailHtml,
        });


    
  } catch (error) {


    res.status(500).json({
      message:'Something went wrong!',
      error
    })
    
  }
}
export const suspendButler = async(req, res)=>{
  try {
    const email = req.params.email;
    const updated = await User.updateOne({email: email}, {$set:{
      isButler:'suspend'
    }});

       const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "bannah76769@gmail.com",
            pass: "noqq kzxv olzf clzz",
          },
        });
    
           res.status(200).json({
      message:'Success',
      data:updated
    })
    storeNotification(email, `Your Butler Account is suspend. Please contact support`, '', '')
        // User email HTML template
        const userEmailHtml = `
         <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border-radius: 12px;">
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

  <p style="font-size:14px; color:#888; margin-top:20px;">
    Thank you for joining us and helping make every event unforgettable.
  </p>
</div>

        `;
    
        // Send email to user
        await transporter.sendMail({
          from: '"Hunky Butler Service"',
          to: email,
          subject: "Suspend!",
          html: userEmailHtml,
        });

 
  } catch (error) {


    res.status(500).json({
      message:'Something went wrong!',
      error
    })
    
  }
}
export const activeButler = async(req, res)=>{
  try {
    const email = req.params.email;
    const updated = await User.updateOne({email: email}, {$set:{
      isButler:'active'
    }});

       res.status(200).json({
      message:'Success',
      data:updated
    })
    storeNotification(email, 'Your Butler Application accepted', '', '')

       const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "bannah76769@gmail.com",
            pass: "noqq kzxv olzf clzz",
          },
        });
    
        // User email HTML template
        const userEmailHtml = `
         <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border-radius: 12px;">
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

  <p style="font-size:14px; color:#888; margin-top:20px;">
    Thank you for joining us and helping make every event unforgettable.
  </p>
</div>

        `;
    
        // Send email to user
        await transporter.sendMail({
          from: '"Hunky Butler Service"',
          to: email,
          subject: "Application Accepted",
          html: userEmailHtml,
        });

 
  } catch (error) {


    res.status(500).json({
      message:'Something went wrong!',
      error
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
    res.status({
      message:"Something went wrong!",
      error
    })
  }
}