import mongoose, { Schema } from "mongoose";

/**
 * Defines a serial story
 */
const SerialSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },
  nsfw: {
    type: Boolean,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  lastModified: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});
SerialSchema.methods.isAuthor = async function (authorId) {
  return authorId === this.author;
};
let Serial;

try {
  Serial = mongoose.model("Serial");
} catch {
  Serial = mongoose.model("Serial", SerialSchema);
}
export default Serial;
