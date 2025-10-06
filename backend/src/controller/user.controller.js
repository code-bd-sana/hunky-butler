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
    const {bio, dob, email, firstName, lastName, gender, location, phone, postcode, profileImage, image}  = req.body;
    console.log(email, 'amo to emol amdarho')





    const updated = await User.updateOne({email:email}, {$set:{
      bio,
      dob,
      firstName,
      lastName,
      gender,
      phone,
      location,
      postcode,
      image,
      profileImage:image



    }}) ;

    console.log(updated)
    
    
    res.status(200).json({
      message:'Success',
      data: updated
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:"Something went wrong!",
      error
    
    })
  }
}
