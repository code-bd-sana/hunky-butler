import User from "../models/user.model.js"

export const getAllUsers = async(req, res)=>{
    try {

        const users = await User.find();

        res.status(200).json({
            message:"Success",
            data:users
        })

        
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong!"
        })
    }
}