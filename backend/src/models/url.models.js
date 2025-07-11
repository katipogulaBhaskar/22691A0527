import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, required: true },
  referrer: { type: String, required: true },
  geo: { type: String, required: true },
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, required: true },
  expiresAt: { type: Date, required: true },
  clicks: { type: [clickSchema], required: true, default: [] },
});

export const Url = mongoose.model("Url", urlSchema);
