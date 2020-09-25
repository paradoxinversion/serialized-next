import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
  likeType: String,
  subject: { type: Schema.Types.ObjectId },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

let Like;

try {
  Like = mongoose.model("Like");
} catch {
  Like = mongoose.model("Like", LikeSchema);
}
export default Like;
