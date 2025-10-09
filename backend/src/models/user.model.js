import mongoose from "mongoose";

// models/User.js
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email Is Required"],
    unique: true,
  },
  password: {
    type: String,

    required: function () {
      return this.authProvider === "credentials";
    },
  },
  role: {
    type: String,
    required: [true, "Role Is required"],
    enum: ["customer", "butler", "admin"],
    default: "customer",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  authProvider: {
    type: String,
    enum: ["credentials", "google", "apple"],
    default: "credentials",
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
   averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  firstName:{
    type:String,

  },
  lastName:{
    type:String,

  },
  location:{
    type:String
  },
  postcode:{
    type:Number
  },
  bio:{
    type:String
  },
  isButler:{
    type: String,
    default: 'none',
    enum:['active', 'none', 'pending', 'reject', 'suspend']
  },
  gender:{
    type:String,
    
  },
  dob:{
    type: Date
  },
  phone:{
    type: String
  },
  profileImage:String,



  serviceTaken:{
    type:Number,
    default:0
  },
  isOnline : {
    type: Boolean,
    
  },
 
lastActive : {
  type: String,
  default: '3 Hours Ago'
}


 
},  { timestamps: true } );

const User = mongoose.model("User", userSchema);
export default User;
