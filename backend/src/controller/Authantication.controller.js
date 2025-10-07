import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const isExist = await User.findOne({ email: email });

    if (isExist) {
      return res.status(401).json({
        message: "User Already Exist",
      });
    }

    const newUser = new User({
      email,
      password: hashPassword,
      role,
    });

    const saved = await newUser.save();

    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong!",
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      return res.status(401).json({
        message: "User Not Found!",
      });
    }

    if (isExist.email !== "admin@gmail.com") {
      if (role !== isExist.role) {
        return res.status(401).json({
          message: `Role Dose Not matched!`,
        });
      }
    } else {
      role === "admin";
      next;
    }

    if (!isExist.isVerified) {
      res.status(405).json({
        message: "Please Verify your account then try to login...",
      });
    }

    const matchedPassword = await bcrypt.compare(password, isExist.password);

    if (!matchedPassword) {
      return res.status(401).json({
        message: "Wrong Password!",
      });
    }

    res.status(201).json({
      message: "Login Success",
      data: isExist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const fortgetPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;
    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    const isExistOtp = await OTP.findOne({ email: email });

    if (!isExistOtp) {
      return res.status(401).json({
        message: "Otp expire!",
      });
    }

    if (otp !== isExistOtp.otp) {
      res.status(401).json({
        message: "Wrong OTP!",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    const updatePassword = await User.updateOne(
      { email: email },
      {
        $set: {
          password: hashPassword,
        },
      }
    );
    res.status(200).json({
      message: "Success",
      data: updatePassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const changePassword = async(req, res)=>{
  try {
    const {oldPassword, newPassword, email} = req.body;
    const findUser = await User.findOne({email:email});
    if(!findUser){
      return res.status(500).json({
        messageL:"User Not Found!"
      })
    };

    const matched = await bcrypt.compare(oldPassword, findUser.password);
    if(!matched){
      return res.status(500).json({
        message:"Incorrect password"
      })
    }


    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const updated = await User.updateOne({email:email}, {$set:{
      password: newPasswordHash
    }});

    res.status(200).json({
      message:"Success",
      data:updated
    })


    
  } catch (error) {

    console.log(error)
    res.status(500).json({
      message:"Something went wrong!",
      error : error
    })
  }
}