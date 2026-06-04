import { getToken } from "next-auth/jwt";

export const verifyUser = async (req, res, next) => {
  console.log("Hit");
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "aidfjnvociydfnovfadf",
      encryption: true, // important if JWT is encrypted
    });

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    req.user = token;

    next();
  } catch (error) {
    console.log("Error verifying user:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "admin") {
      next();
      // return res.status(401).json({
      //     message:"Unathorized"
      // })
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};
export const verifyButler = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "butler") {
      next();
      // return res.status(401).json({
      //     message:"Unathorized"
      // })
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};
export const verifyCustomer = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "customer") {
      next();
      //   return res.status(401).json({
      //     message: "Unathorized",
      //   });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};
