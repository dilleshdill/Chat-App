import jwt from "jsonwebtoken";
import User from "../models/User.js";

// middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // attach user
    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};
