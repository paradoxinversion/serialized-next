import mongoose, { Schema } from "mongoose";

/**
 * Defines a single part of a serial story
 */
const SerialPartSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  lastModified: {
    type: Date,
  },
  parentSerial: {
    type: Schema.Types.ObjectId,
    ref: "Serial",
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  partNumber: {
    type: Number,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  synopsis: {
    type: String,
    required: false,
  },
});

export default mongoose.models.SerialPart ||
  mongoose.model("SerialPart", SerialPartSchema);
