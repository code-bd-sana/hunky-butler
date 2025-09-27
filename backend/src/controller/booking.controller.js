import Booking from "../models/booking.model.js";

export const createBooking = async (req, res)=>{
    try {

        const data = req.body;
        const  newData = new Booking(data);
        const savedData = await newData.save();
        res.status(200).json({
            message:"Success"
        })
        
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong!"
        })
    }
}