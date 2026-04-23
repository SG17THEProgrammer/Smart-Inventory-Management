import mongoose from "mongoose";

const InsightSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    insight: { type: String, required: true },
    demand: { type: Object, required: true },
    lastUpdatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Insight ||
  mongoose.model("Insight", InsightSchema);