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

  serviceTaken:{
    type:Number,
    default:0
  }
},  { timestamps: true } );

const User = mongoose.model("User", userSchema);
export default User;
