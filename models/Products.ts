import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  sku: String,
  price: Number,
  stock: Number,
  threshold: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);