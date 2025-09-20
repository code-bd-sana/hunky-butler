import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    email:{
        type:String,
        required: [true, "Email Is Required"]
    },
    password:{
        type:String,
        required:[true, "Password Is Required"]
   
    },
    role:{
        type:String,
        required:[true, "Role Is required"],
        enum:["customer", "butler"]
    }
});

const User = mongoose.model('user', userSchema);

export default User;