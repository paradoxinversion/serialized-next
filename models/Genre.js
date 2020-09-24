import mongoose, { mongo, Schema } from "mongoose";
/**
 * Defines serial story genres
 */
const GenreSchema = new Schema({
  name: { type: String, unique: true },
  description: { type: String },
});

export default mongoose.model("Genre") || mongoose.model("Genre", GenreSchema);
