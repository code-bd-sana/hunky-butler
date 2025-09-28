import mongoose from "mongoose";
import User from "./user.model.js";


const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email Is Required"],
        ref: User
    },
    otp: {
        type: String,
        required: [true, "Otp Is Required"]
    }
});


otpSchema.pre('save', function(next) {
    if (this.isNew) {

        this.expiresAt = new Date(Date.now() + 8 * 60 * 1000);
    }
    next();
}, { timestamps: true });


otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });



const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
