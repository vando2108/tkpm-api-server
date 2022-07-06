import mongoose from "mongoose";

export interface Attribute {
  id: string;
  productId: string;
  name: string;
  value: string | number;
}

export const AttributeSchema = new mongoose.Schema<Attribute>(
  {
    id: { type: String, index: true },
    productId: { type: String, index: true },
    name: { type: String },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { versionKey: false }
);

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
}

export const ProductSchema = new mongoose.Schema<Product>(
  {
    id: { type: String, index: true },
    name: { type: String },
    desc: { type: String },
    price: { type: Number },
  },
  { versionKey: false }
);
