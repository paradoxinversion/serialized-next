import mongoose, { Schema } from "mongoose";
const bcrypt = require("bcrypt");
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  full_name: String,
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now(),
  },
  biography: {
    type: String,
    required: false,
  },
  role: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Schema.Types.ObjectId,
    ref: "Like",
  },
  viewNSFW: {
    type: Boolean,
    default: false,
  },
  accountStatus: {
    type: Number,
    default: 0,
  },
});

UserSchema.methods.validatePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

let User;
try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", UserSchema);
}
export default User;
