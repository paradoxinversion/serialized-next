import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
  likeType: String,
  subject: { type: Schema.Types.ObjectId },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Like") || mongoose.model("Like", LikeSchema);
