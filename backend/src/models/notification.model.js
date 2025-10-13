import mongoose from "mongoose";
import User from "./user.model.js";

const NotificaitonSchema = mongoose.Schema(
  {

    sender:{
      type:String,
      ref: User
    },

    receiver:{
      type: String,
      ref: User,
      required: true
    },
    message:{
      type:String,
      required: true
    },
  seen:{
    type: Boolean,
    default: false
  },
  link:{
    type:String
  },
  obj:{
    type: Object
  }
  }
);

const Notificaton = mongoose.model("notification", NotificaitonSchema);

export default Notificaton;
