import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], default: [] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
})
export default mongoose.model("Product", productSchema) 