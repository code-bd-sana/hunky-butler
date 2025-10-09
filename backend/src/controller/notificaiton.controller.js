import Notificaton from "../models/notification.model.js";

export const createNotificaiton = async (req, res) => {
  try {
    const data = req.body;
    const { sendToAllUser, sendToButler, sendToCustomer, title, message } =
      req.body;
  } catch (error) {
    res.status(500).json({
      message: "Something Went wrong!",
      error: error.message,
    });
  }
};



export const getNotification = async (req, res)=>{
  try {
    const email = req.params.email;
    const data =  await Notificaton.find({receiver:email}).sort({createdAt: -1}).limit(20);
    res.status(200).json({
      message:'Success',
      data
    })
    
  } catch (error) {
    res.status(500).json({
      message:"Something went wrong!",
      error
    })
  }
}




export const markSeen = async(req, res)=>{

  console.log('first')
  try {
    const id = req.params.id;

    const makeSeen = await Notificaton.updateOne({
      _id:id
    }, {$set:{
      seen: true
    }})

    res.status(200).json({
      message:"Success",
      data: makeSeen
    })
    
  } catch (error) {
    console.log(error, 'personal error')
    res.status(500).json({
      message:"Something went wrong",
      error
    })
  }
}

export const markSeenAllNotification = async(req, res)=>{
 try {
   const email = req.params.email;
  
  const updated = await Notificaton.updateMany({receiver:email}, {$set:{
    seen: true
  }})
  res.status(200).json({
    message:'Success',
    data:updated
  })
 } catch (error) {
  console.log(req.params.email)
  console.log(error)
  res.status(500).json({
    message:"Something went wrong!",
    error
  })
 }
}