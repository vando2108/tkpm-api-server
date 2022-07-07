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

export const ProductSchema = new mongoose.Schema<Product>({
  id: { type: String, index: true },
  name: { type: String },
  desc: { type: String },
  price: { type: Number },
});

export interface AttributeSet {
  id: string;
  productId: string;
  name: string;
}

export const AttributeSetSchema = new mongoose.Schema<AttributeSet>({
  id: { type: String, index: true },
  productId: { type: String, index: true },
  name: { type: String },
});

export interface StringValue {
  id: string;
  attributeId: string;
  value: string;
}

export const StringValueSchema = new mongoose.Schema<StringValue>({
  id: { type: String, index: true },
  attributeId: { type: String, index: true },
  value: { type: String },
});

export interface NumberValue {
  id: string;
  attributeId: string;
  value: number;
}

export const NumberValueSchema = new mongoose.Schema<NumberValue>({
  id: { type: String, index: true },
  attributeId: { type: String, index: true },
  value: { type: Number },
});
