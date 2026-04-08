import asyncHandler from "../middlewares/asyncHandler.js";
import Dokumen from "../Models/DokumenModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const createDokumen = asyncHandler(async (req, res) => {
  const newDokumen = await Dokumen.create(req.body);

  return res.status(201).json({
    message: "Berhasil Menambahkan Dokumen",
    data: newDokumen,
  });
});

export const allDokumen = asyncHandler(async (req, res) => {
  //req query
  const queryObj = { ...req.query };

  //fungsi untuk mengabaikan jika ada req page dan limit
  const excludeField = ["page", "limit", "name"];
  excludeField.forEach((element) => {
    delete queryObj[element];
  });

  let query;

  if (req.query.name) {
    query = Dokumen.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  } else {
    query = Dokumen.find(queryObj);
  }

  //pagination
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 30;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countDokumen = await Dokumen.countDocuments();

  if (req.query.page) {
    if (skipData >= countDokumen) {
      res.status(404);
      throw new Error("This page doesn't exist");
    }
  }

  const semuaDokumen = await query;
  return res.status(201).json({
    message: "Berhasil Menampilkan Semua Dokumen",
    semuaDokumen: semuaDokumen,
    count: countDokumen,
  });
});

export const detailDokumen = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const detailDokumen = await Dokumen.findById(paramsId);

  if (!detailDokumen) {
    res.status(404);
    throw new Error("Dokumen Tidak di Temukan!");
  }

  return res.status(200).json({
    message: "Detail Dokumen Berhasil ditampilkan",
    data: detailDokumen,
  });
});

export const updateDokumen = asyncHandler(async (req, res) => {
  const paramId = req.params.id;

  const updateDokumen = await Dokumen.findByIdAndUpdate(paramId, req.body, {
    runValidators: false,
    returnDocument: "after",
  });

  if (!updateDokumen) {
    return res.status(404).json({
      message: "Dokumen tidak ditemukan",
    });
  }

  return res.status(201).json({
    message: "Update Dokumen Berhasil",
    data: updateDokumen,
  });
});

export const deleteDokumen = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  await Dokumen.findByIdAndDelete(paramId);

  if (!updateDokumen) {
    return res.status(404).json({
      message: "Dokumen tidak ditemukan",
    });
  }

  return res.status(200).json({
    message: "Delete Dokumen Berhasil",
  });
});

export const uploadDokumen = asyncHandler(async (req, res) => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const videoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];

  let resourceType = "raw"; // default untuk pdf, excel, word
  if (imageTypes.includes(req.file.mimetype)) resourceType = "image";
  if (videoTypes.includes(req.file.mimetype)) resourceType = "video";

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      resource_type: resourceType,
      use_filename: true, // pakai nama file asli
      unique_filename: true, // tambah unique id agar tidak bentrok
      filename_override: req.file.originalname, // pakai nama + ekstensi asli
    },
    function (err, results) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "gagal upload dokumen",
          error: err,
        });
      }
      res.json({
        message: "Dokumen Berhasil di Upload",
        url: results.secure_url,
        resource_type: results.resource_type, // image / video / raw
        format: results.format, // pdf, xlsx, docx, dll
      });
    },
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
  //DI COMMENT KARENA SUDAH MAU PINDAH DARI LOCAL KE CLOUDINARY
  // const file = req.file;
  // if (!file) {
  //   res.status(400);
  //   throw new Error("Tidak ada dokumen yang di input");
  // }
  // const dokumenFileName = file.filename;
  // const pathDokumenFile = `/uploads/${dokumenFileName}`;
  // res.status(200).json({
  //   message: "Dokumen Berhasil diupload",
  //   file: pathDokumenFile,
  // });
});

export const downloadDokumen = asyncHandler(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400);
    throw new Error("URL tidak boleh kosong");
  }

  const response = await fetch(url);

  if (!response.ok) {
    res.status(404);
    throw new Error("File tidak ditemukan");
  }

  // ambil nama file + ekstensi dari URL
  const urlPath = new URL(url).pathname;
  const fileName = urlPath.split("/").pop();

  // tentukan content type berdasarkan ekstensi
  const ext = fileName.split(".").pop().toLowerCase();
  const contentTypes = {
    pdf: "application/pdf",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    mp4: "video/mp4",
  };

  const contentType = contentTypes[ext] || "application/octet-stream";

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  const buffer = await response.arrayBuffer();
  res.send(Buffer.from(buffer));
});
