import multer from "multer";
import path from "path";

const FILE_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",

  // PDF
  "application/pdf": "pdf",

  // Word
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",

  // Excel
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFormat = FILE_TYPE[file.mimetype];
    let uploadError = new Error("Invalid Format File");

    if (isValidFormat) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFile = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFile);
  },
});

export const upload = multer({ storage: storage });
