import mongoose, { mongo, Schema } from "mongoose";
/**
 * Defines serial story genres
 */
const GenreSchema = new Schema({
  name: { type: String, unique: true },
  description: { type: String },
});

export default mongoose.models.Genre || mongoose.model("Genre", GenreSchema);
