import mongoose from "mongoose";

const RestockRequestSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["pending", "approved" , "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.RestockRequest ||
  mongoose.model("RestockRequest", RestockRequestSchema);