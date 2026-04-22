import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: String, // or userId later
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);