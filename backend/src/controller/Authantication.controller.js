import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  try {
    const { email, password, role, phone } = req.body;
    const allowedRole = role === "butler" ? "butler" : "customer";
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
      role: allowedRole,
      phone, // Added phone
    });

  // faka maka tak alaka saka laka boom boom !!!

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

    // The Customer/Butler tab on the login form must match the account's role,
    // so a customer cannot log in through the butler tab and vice versa. Admins
    // are exempt because there is no admin tab: they sign in through whichever
    // tab is showing, so their submitted role will not equal "admin".
    //
    // Admins are now identified by their stored role, not by the hard-coded
    // string "admin@gmail.com". The previous version special-cased that email
    // and, in its else branch, ran two statements that did nothing:
    // `role === "admin"` (a comparison whose result is thrown away) and `next`
    // (a bare reference to the function, never called). They were plainly meant
    // to skip the checks for the admin and only failed to because of the bugs.
    // Removing them closes that latent bypass. The password is still verified
    // for every account, including the admin, by the bcrypt compare below.
    const isAdmin = isExist.role === "admin";
    if (!isAdmin && role && role !== isExist.role) {
      return res.status(401).json({
        message: "Selected role does not match this account.",
      });
    }

    if (!isExist.isVerified) {
      return res.status(405).json({
        message: "Please Verify your account then try to login...",
      });
    }

    const matchedPassword = await bcrypt.compare(password, isExist.password);

    if (!matchedPassword) {
      return res.status(401).json({
        message: "Wrong Password!",
      });
    }

    const userData = isExist.toObject();
    delete userData.password;
    
    res.status(201).json({
      message: "Login Success",
      data: userData,
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
      return res.status(401).json({
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
