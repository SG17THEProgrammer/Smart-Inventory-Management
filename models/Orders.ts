import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" , required: true},
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
  quantity: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);