import { getToken } from "next-auth/jwt";
import User from "../models/user.model.js";

const getSecret = () => process.env.NEXTAUTH_SECRET;

/**
 * Extracts and verifies user payload from NextAuth token (cookie or Authorization header)
 */
export const getAuthUser = async (req) => {
  try {
    let token = await getToken({
      req,
      secret: getSecret(),
    });

    // Fallback: If getToken returns null, check if Authorization header exists
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        const bearerToken = authHeader.substring(7);
        token = await getToken({
          req: {
            ...req,
            headers: {
              ...req.headers,
              cookie: `next-auth.session-token=${bearerToken}; __Secure-next-auth.session-token=${bearerToken}`,
            },
          },
          secret: getSecret(),
        });
      }
    }

    if (token && (token.email || token.id || token.sub)) {
      const queryEmail = token.email;
      const queryId = token.id || token.sub;

      let dbUser = null;
      if (queryEmail || queryId) {
        dbUser = await User.findOne({
          $or: [
            ...(queryEmail ? [{ email: queryEmail }] : []),
            ...(queryId ? [{ _id: queryId }] : []),
          ],
        }).select("-password");
      }

      if (dbUser) {
        return {
          id: dbUser._id.toString(),
          _id: dbUser._id.toString(),
          email: dbUser.email,
          role: dbUser.role || token.role || "customer",
          name: dbUser.name || dbUser.firstName || token.name,
        };
      }

      return {
        id: (token.id || token.sub)?.toString(),
        _id: (token.id || token.sub)?.toString(),
        email: token.email,
        role: token.role || "customer",
        name: token.name,
      };
    }

    // The x-user-email header fallback has been removed. It trusted a plain,
    // attacker-controlled header: sending `x-user-email: admin@gmail.com` was
    // enough to be treated as the admin, with no password, token or session.
    //
    // Identity now comes only from the two cryptographically verified paths
    // above: the NextAuth session cookie (same-origin), and the signed JWT sent
    // as `Authorization: Bearer` by the site (cross-subdomain). Both are
    // verified against NEXTAUTH_SECRET, so a forged header authenticates
    // nothing. If neither is present the caller is unauthenticated.
  } catch (error) {
    console.error("Error verifying auth token:", error.message);
  }
  return null;
};


export const verifyUser = async (req, res, next) => {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized: Authentication required.",
    });
  }
  req.user = user;
  next();
};

export const verifyAdmin = async (req, res, next) => {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized: Authentication required.",
    });
  }
  if (user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden: Admin access required.",
    });
  }
  req.user = user;
  next();
};

export const verifyButler = async (req, res, next) => {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized: Authentication required.",
    });
  }
  if (user.role !== "butler" && user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden: Butler access required.",
    });
  }
  req.user = user;
  next();
};

export const verifyCustomer = async (req, res, next) => {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized: Authentication required.",
    });
  }
  if (user.role !== "customer" && user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden: Access denied.",
    });
  }
  req.user = user;
  next();
};

