import mongoose, { Schema } from "mongoose";
/**
 * Defines serial story genres
 */
const ConfigSchema = new Schema(
  {
    setupComplete: { type: Boolean, default: false },
    description: { type: String },
  },
  { capped: { size: 1024, max: 1, autoIndexId: true } }
);

let Config;
try {
  Config = mongoose.model("Config");
} catch {
  Config = mongoose.model("Config", ConfigSchema);
}
export default Config;
