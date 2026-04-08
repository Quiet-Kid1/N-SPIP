import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  createDokumen,
  allDokumen,
  deleteDokumen,
  detailDokumen,
  updateDokumen,
  uploadDokumen,
  downloadDokumen,
} from "../controllers/dokumenController.js";

import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

//CRUD Dokumen

//Create Data Dokumen
// post api/v1/dokumen
//middleware owner
router.post("/", protectedMiddleware, adminMiddleware, createDokumen);

//read Data Dokumen
// get api/v1/dokumen
router.get("/", allDokumen);

//test
router.get("/download", protectedMiddleware, adminMiddleware, downloadDokumen);

//detail Data Dokumen
//get api/v1/dokumen/id
//middleware owner
router.get("/:id", protectedMiddleware, adminMiddleware, detailDokumen);

//update Data Dokumen
//put api/v1/dokumen/id
//middleware owner
router.put("/:id", updateDokumen);

//delete Data Dokumen
//delete api/v1/dokumen/id
//middleware owner
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteDokumen);

//upload Data Dokumen
//post api/v1/dokumen/upload-dokumen
//middleware owner
router.post(
  "/dokumen-upload",
  protectedMiddleware,
  adminMiddleware,
  upload.single("file"),
  uploadDokumen,
);

export default router;
