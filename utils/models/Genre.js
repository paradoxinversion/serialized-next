import mongoose, { Schema } from "mongoose";
/**
 * Defines serial story genres
 */
const GenreSchema = new Schema({
  name: { type: String, unique: true },
  description: { type: String },
});

let Genre;
try {
  Genre = mongoose.model("Genre");
} catch {
  Genre = mongoose.model("Genre", GenreSchema);
}
export default Genre;
