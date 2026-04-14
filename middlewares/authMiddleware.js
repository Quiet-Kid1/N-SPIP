import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import asyncHandler from "./asyncHandler.js";

export const protectedMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Cek cookie dulu
  token = req.cookies.jwt;

  // Fallback: cek Authorization header (Bearer token)
  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized token fail");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

export const adminMiddleware = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized");
  }
};
