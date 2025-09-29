import User from "../models/user.model.js"

export const getAllButler = async(req, res)=>{
    try {

        const butler = await User.find({role:"butler"}).select("-password");

        res.status(200).json({
            message:"Success",
            data:butler

        })
        
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong!"
        })
    }
}