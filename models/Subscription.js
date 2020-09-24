import mongoose, { Schema } from "mongoose";

/**
 * Defines a subscription between a user and a serial story
 */
const SubscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscribedObject: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  subscriptionType: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
