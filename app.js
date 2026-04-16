import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import authRouter from "./router/authRouter.js";
import dokumenRouter from "./router/dokumenRouter.js";
import { v2 as cloudinary } from "cloudinary";


import helmet from "helmet";

dotenv.config();

const app = express();
const port = 3000;
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

//Parent Routerr
app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/dokumen/", dokumenRouter);

app.use(notFound);
app.use(errorHandler);
//server
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("Database Connect");
});
