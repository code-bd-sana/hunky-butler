import User from "../models/user.model.js";



export const getAllButler = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Search condition for butlers
    const searchCondition = {
      role: "butler",
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const butlers = await User.find(searchCondition)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(searchCondition);

    res.status(200).json({
      message: "Success",
      data: butlers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};


