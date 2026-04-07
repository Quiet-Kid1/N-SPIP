import mongoose from "mongoose";

const { Schema } = mongoose;

const dokumenSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama Dokumen Harus diisi"],
    unique: [true, "Username sudah digunakan silahkan buat yang lain"],
  },
  deskripsi: {
    type: String,
  },
  tanggal: {
    type: String,
    required: [true, "Tanggal Harus diisi"],
  },
  Kategori: {
    type: String,
    required: [true, "Kategori Harus diisi"],
    enum: ["Keuangan", "Perencanaan", "Hukum"],
  },
  file: {
    type: String,
    default: null,
  },
});

const Dokumen = mongoose.model("Dokumen", dokumenSchema);

export default Dokumen;
