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
  searchDokumen,
  kirimPengingat,
} from "../controllers/dokumenController.js";

import { upload } from "../utils/uploadFileHandler.js";
import { templatePengingatEmail } from "../utils/emailTemplate.js";

const router = express.Router();

//CRUD Dokumen

//Create Data Dokumen
// post api/v1/dokumen
//middleware owner
router.post("/", protectedMiddleware, createDokumen);

//search data berdasarkan nama dan kategori
router.get("/dokumen/search", searchDokumen);

//read Data Dokumen
// get api/v1/dokumen
router.get("/", allDokumen);

//test
router.get("/download", protectedMiddleware, downloadDokumen);

//detail Data Dokumen
//get api/v1/dokumen/id
//middleware owner
router.get("/:id", detailDokumen);

router.post("/kirim-pengingat", kirimPengingat);

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
  upload.single("file"),
  uploadDokumen,
);

export default router;
