import User from "../models/user.model.js";



/**
 * Butler directory for the dashboard.
 *
 * This was an open endpoint returning every butler document minus the password,
 * which meant the email address of all staff was readable by anyone on the
 * internet. The route now requires a session, and the email is returned only to
 * an admin: the butler and customer dashboards render this list too, and they
 * have no reason to see staff email addresses. Search by email is likewise
 * limited to admins, since a non-admin cannot see the field it searches.
 */
export const getAllButler = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const isAdmin = req.user?.role === "admin";

    const searchFields = isAdmin
      ? [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
      : [{ name: { $regex: search, $options: 'i' } }];

    const searchCondition = {
      role: "butler",
      ...(search && { $or: searchFields }),
    };

    const projection = isAdmin
      ? "-password"
      : "-password -email -phone -authProvider -lastActive";

    const butlers = await User.find(searchCondition)
      .select(projection)
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
