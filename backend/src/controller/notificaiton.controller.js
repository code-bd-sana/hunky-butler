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

