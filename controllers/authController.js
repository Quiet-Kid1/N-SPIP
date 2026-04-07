import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "6d" });
};

const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const isDev = process.env.NODE_ENV === "development" ? false : true;

  const cookieOption = {
    expire: new Date(Date.now() + 6 * 24 * 60 * 1000),
    httpOnly: true,
    security: isDev,
  };

  res.cookie("jwt", token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    data: user,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const isOwner = (await User.countDocuments()) === 0;

  const role = isOwner ? "owner" : "user";

  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: role,
  });

  createSendResToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  //tahap 1 validasi
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Inputan email/password tidak boleh kosong");
  }
  //tahap 2 check apakah email yang dimasukkan ada di db atau tidak
  const userData = await User.findOne({
    email: req.body.email,
  });
  //tahap 3 check password
  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendResToken(userData, 200, res);
  } else {
    res.status(400);
    throw new Error("Invalid User");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(-"password");

  if (user) {
    return res.status(200).json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

export const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    message: "logout berhasil",
  });
};
