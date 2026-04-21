import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" , required: true},
  quantity: { type: Number, required: true },
  type: { type: String, enum: ["sale", "purchase"]  , required: true},
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);