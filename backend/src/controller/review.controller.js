import Review from "../models/review.model.js";
import User from "../models/user.model.js";

export const addReview = async(req, res)=>{
    try {

        const data = req.body;
        const newReview = Review(data);
        const saved = await  newReview.save();
     

        const user = await User.findById(data.butler);

    const newAverage = 
      (user.averageRating * user.totalReviews + data.rating) / (user.totalReviews + 1);

    user.averageRating = newAverage;
    user.totalReviews += 1;
    await user.save();

       res.status(200).json({
            message:"Success",
            data:saved
        })
        
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong",
            error:error.message
        })
    }
};





export const deleteReview = async(req, res)=>{
    try {

const id = req.params.id;
        const deleteReview = await Review.deleteOne({_id:id});
        res.status(200).json({
            message:"Success",
            data: deleteReview
        })

        
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong",
            error:error.message
        })
    }
}




export const getButlerReview = async(req, res)=>{
    try {

        const limit = req.query.limit;
        const skip = req.query.skip;

        const id = req.params.id;
        const allReview = await Review.findOne({butler:id}).populate({ path: 'reviewer', select: '-password -__v' }).sort({ createdAt: -1 }).limit(limit).skip(skip);
        res.status(200).json({
            message:"Success",
            data:allReview
        })
        
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong"
        })
    }
}



export const getSingleReview = async(req, res)=>{
    try {
        const id = req.params.id;
        const data =  await Review.findOne({_id:id}).populate({ path: 'reviewer', select: '-password -__v' }).sort({ createdAt: -1 }).limit(limit).skip(skip);
        res.status(200).json({
            message:"Success",
            data
        })
        
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong!",
            error:error.message
        })
    }
}






export const getAllReview = async(req, res)=>{
    try {

        
        const skip = req.query.skip;
        const limit = req.query.limit;
        const allReview = await Review.find().populate({ path: 'reviewer', select: '-password -__v' }).sort({ createdAt: -1 }).limit(limit).skip(skip).skip(skip).limit(limit);
        res.status(200).json({
            message:"Success",
            data: allReview
        })
        
    } catch (error) {
     
        res.status(500).json({
            message:"Something went wrong!",
            error: error.message
        })
    }
}