import mongoose from "mongoose";

export interface Attribute {
  id: string;
  productId: string;
  name: string;
}

export const AttributeSchema = new mongoose.Schema<Attribute>(
  {
    id: { type: String, index: true },
    productId: { type: String, index: true },
    name: { type: String },
  },
  { versionKey: false }
);

export interface Product {
  id: string;
  name: string;
  desc: string;
}

export const ProductSchema = new mongoose.Schema<Product>(
  {
    id: { type: String, index: true },
    name: { type: String },
    desc: { type: String },
  },
  { versionKey: false }
);
