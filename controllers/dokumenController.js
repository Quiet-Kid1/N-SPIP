import asyncHandler from "../middlewares/asyncHandler.js";
import Dokumen from "../Models/DokumenModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import transporter from "../config/emailConfig.js";
import { templatePengingatEmail } from "../utils/emailTemplate.js";

export const createDokumen = asyncHandler(async (req, res) => {
  const newDokumen = await Dokumen.create(req.body);

  return res.status(201).json({
    message: "Berhasil Menambahkan Dokumen",
    data: newDokumen,
  });
});

export const allDokumen = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };

  // Keluarkan field yang tidak langsung jadi filter MongoDB
  const excludeField = ["page", "limit", "name", "bulan", "tahun"];
  excludeField.forEach((element) => {
    delete queryObj[element];
  });

  // Filter tanggal berdasarkan bulan dan tahun
  if (req.query.bulan && req.query.tahun) {
    const bulan = req.query.bulan;
    const tahun = req.query.tahun;
    const start = new Date(`${tahun}-${bulan}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    queryObj.tanggal = { $gte: start, $lt: end };
  } else if (req.query.tahun) {
    const tahun = req.query.tahun;
    queryObj.tanggal = {
      $gte: new Date(`${tahun}-01-01`),
      $lt: new Date(`${Number(tahun) + 1}-01-01`),
    };
  }

  let query;

  if (req.query.name) {
    query = Dokumen.find({
      ...queryObj,
      name: { $regex: req.query.name, $options: "i" },
    });
  } else {
    query = Dokumen.find(queryObj);
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 10;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countDokumen = await Dokumen.countDocuments(queryObj);

  if (req.query.page) {
    if (skipData >= countDokumen) {
      res.status(404);
      throw new Error("This page doesn't exist");
    }
  }

  const semuaDokumen = await query;
  const totalPage = Math.ceil(countDokumen / limitData);

  return res.status(201).json({
    message: "Berhasil Menampilkan Semua Dokumen",
    semuaDokumen,
    pagination: {
      totalPage,
      page,
      totalDokumen: countDokumen,
    },
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
  const pdfTypes = ["application/pdf"]; // ← tambah ini

  let resourceType = "raw"; // default untuk excel, word
  if (imageTypes.includes(req.file.mimetype)) resourceType = "image";
  if (videoTypes.includes(req.file.mimetype)) resourceType = "video";
  if (pdfTypes.includes(req.file.mimetype)) resourceType = "image"; // ← PDF sebagai image

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      filename_override: req.file.originalname,
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

// Tambahkan fungsi ini dan pastikan ada kata "export"
export const searchDokumen = asyncHandler(async (req, res) => {
  const { name, Kategori, page, limit } = req.query;

  const queryObj = {};

  if (name) {
    queryObj.name = { $regex: name, $options: "i" };
  }

  if (Kategori) {
    queryObj.Kategori = Kategori;
  }

  const currentPage = page * 1 || 1;
  const limitData = limit * 1 || 10;
  const skipData = (currentPage - 1) * limitData;

  const semuaDokumen = await Dokumen.find(queryObj)
    .skip(skipData)
    .limit(limitData);

  const countDokumen = await Dokumen.countDocuments(queryObj);

  const totalPage = Math.ceil(countDokumen / limitData);

  return res.status(200).json({
    message: "Berhasil Menampilkan Hasil Pencarian",
    semuaDokumen,
    pagination: {
      totalPage,
      page: currentPage,
      totalDokumen: countDokumen,
    },
  });
});

/**
 * POST /api/email/kirim-pengingat
 * Body: { email, namaDokumen, kategori, pesan }
 */
export const kirimPengingat = asyncHandler(async (req, res) => {
  const { email, namaDokumen, kategori, pesan } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Alamat email tujuan wajib diisi");
  }

  // Validasi format email sederhana
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error(`Format email tidak valid: ${email}`);
  }

  const mailOptions = {
    from: `"KPU Kab. Bolmong Timur" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `[Pengingat] Segera Upload Dokumen — ${namaDokumen || "Kartu Kendali"}`,
    html: templatePengingatEmail({ namaDokumen, kategori, pesan }),
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    success: true,
    message: `Email pengingat berhasil dikirim ke ${email}`,
  });
});
