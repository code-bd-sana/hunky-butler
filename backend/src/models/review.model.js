import mongoose from "mongoose";
import User from "./user.model.js";


const reviewSchema = mongoose.Schema({

    butler:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:[true, "Butler Id is Required"]
    },

    reviewer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:[true, "Reviewr id is Required"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true, "Rating is Required"]
    },

    comment:{
        type:String,
       
    },

     createdAt: {
    type: Date,
    default: Date.now
  }

},   { timestamps: true } )

const Review = mongoose.model('review', reviewSchema);

export default Review;