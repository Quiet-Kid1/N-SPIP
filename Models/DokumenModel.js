import mongoose from "mongoose";

const { Schema } = mongoose;

const dokumenSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama Dokumen Harus diisi"],
  },
  deskripsi: {
    type: String,
  },
  tanggal: {
    type: Date,
    required: [true, "Tanggal Harus diisi"],
  },
  Kategori: {
    type: String,
    required: [true, "Kategori Harus diisi"],
    enum: [
      "Kartu Kendali Kepegawaian",
      "Kartu Kendali Keuangan Negara dan Hibah",
      "Kartu Kendali Pengadaan Barang dan Jasa",
      "Kartu Kendali Persedian dan Aset",
      "Kartu Kendali Kelengkapan Administrasi Pengelolaan Dana Hibah",
      "Kartu Kendali Matrik Progress Tindak Lanjut",
      "Kartu Kendali Logistik",
      "Kartu Kendali Evaluasi Kinerja",
      "Laporan Hasil pengisian kartu kendali",
    ],
  },
  file: {
    type: String,
    default: null,
  },
});

const Dokumen = mongoose.model("Dokumen", dokumenSchema);

export default Dokumen;
