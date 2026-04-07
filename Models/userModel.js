import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama Harus diisi"],
    unique: [true, "Username sudah digunakan silahkan buat yang lain"],
  },
  email: {
    type: String,
    required: [true, "Email Harus diisi"],
    unique: [true, "email sudah pernah di daftarkan"],
    validate: {
      validator: validator.isEmail,
      message: "inputan harus berformat email",
    },
  },
  password: {
    type: String,
    required: [true, "Password Harus diisi"],
    minLength: [6, "Password minimal 6 karakter"],
  },
  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
