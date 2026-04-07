import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import authRouter from "./router/authRouter.js";
import dokumenRouter from "./router/dokumenRouter.js";

import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

dotenv.config();

const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

//Parent Router
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
