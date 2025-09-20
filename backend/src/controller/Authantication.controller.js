import User from "../models/user.model.js";
import bcrypt from 'bcrypt'

export const userRegister = async(req, res)=>{
    try {

        const {email , password, role} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        
        

        const isExist = await User.findOne({email: email});

        if(isExist){
            return res.status(401).json({
                message:"User Already Exist"
            })
        };
        

        const newUser = new User({
            email,
            password: hashPassword,
            role
        });

        const saved =await newUser.save();

        res.status(200).json({
            message:"Success",
            data:saved
        })


        
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong!"
        })
    }
}




export const login = async(req, res)=>{
    try {
        

        const {email, password , role} = req.body;
        const isExist = await User.findOne({email:email});
        if(!isExist){
            return res.status(401).json({
                message:"User Not Found!"
            })
        }

        if(role !== isExist.role){
            return res.status(401).json({
                message:`Role Dose Not matched!`
            })
        };

        const matchedPassword = await bcrypt.compare(password, isExist.password);

        if(!matchedPassword){
            return res.status(401).json({
                message:"Wrong Password!"
            })
        }

res.status(201).json({
    message:"Login Success",
    data:isExist
})


    } catch (error) {
        res.status(500).json({
            message:"Something went wrong"
        })
    }
}