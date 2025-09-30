// import User from "../models/user.model.js"

import User from "../models/user.model.js";

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



export const allCustomer = async(req, res)=>{
  try {

    const customer = await User.find({role:'customer'});
    res.status(200).json({
      message:"Success",
      data:customer
    })
    
  } catch (error) {
    res.status(500).json({
      message:"Something went wrong"
    })
  }
}

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
