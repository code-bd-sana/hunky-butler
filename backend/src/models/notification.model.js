import mongoose from "mongoose"


const NotificaitonSchema = mongoose.Schema({
    title:{

        type: String,
        required:[true, "Title is Required"],

    },
    message:{
        type:String,
        required:[true, "Message Is Required"]
    },
    sendToAllUser: Boolean,
    sendToButler: Boolean,
    sendToCustomer: Boolean
}, { timestamps: true });





const Notificaton = mongoose.model('notification', NotificaitonSchema);

export default Notificaton;

