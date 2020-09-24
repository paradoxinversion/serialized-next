import mongoose, { Schema } from "mongoose";

/**
 * Defines user-generated moderation reports
 */
const ReportSchema = new Schema({
  reportType: { type: String, required: true },
  reportedItem: { type: Schema.Types.ObjectId, required: true },
  extraDetails: { type: String },
  reportingUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
