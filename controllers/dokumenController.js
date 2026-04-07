import asyncHandler from "../middlewares/asyncHandler.js";
import Dokumen from "../Models/DokumenModel.js";

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
  const file = req.file;
  if (!file) {
    res.status(400);
    throw new Error("Tidak ada dokumen yang di input");
  }

  const dokumenFileName = file.filename;
  const pathDokumenFile = `/uploads/${dokumenFileName}`;

  res.status(200).json({
    message: "Dokumen Berhasil diupload",
    file: pathDokumenFile,
  });
});
