import mongoose from "mongoose";

const ProductSuggestionSchema = new mongoose.Schema(
  {
    name: String,
    sku: String,
    price: Number,
    suggestedBy: String, // userId
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ProductSuggestion ||
  mongoose.model("ProductSuggestion", ProductSuggestionSchema);