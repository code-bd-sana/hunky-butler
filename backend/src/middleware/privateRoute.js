import { getToken } from "next-auth/jwt";

export const verifyUser = async (req, res, next) => {
  console.log("Hit (Permissive)");
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "aidfjnvociydfnovfadf",
      encryption: true,
    });

    // Bypassing authentication: set a mock user if no token is found
    req.user = token || { role: "admin", email: "mockadmin@example.com" };

    next();
  } catch (error) {
    console.log("Error verifying user (Bypassing):", error);
    req.user = { role: "admin", email: "mockadmin@example.com" };
    next();
  }
};

export const verifyAdmin = async (req, res, next) => {
  console.log("verifyAdmin (Permissive)");
  next();
};

export const verifyButler = async (req, res, next) => {
  console.log("verifyButler (Permissive)");
  next();
};

export const verifyCustomer = async (req, res, next) => {
  console.log("verifyCustomer (Permissive)");
  next();
};
