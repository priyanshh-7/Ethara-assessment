import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!req.user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      return next(error);
    }
    next();
  } catch {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    next(error);
  }
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error("You do not have permission to access this resource");
    error.statusCode = 403;
    return next(error);
  }
  next();
};
