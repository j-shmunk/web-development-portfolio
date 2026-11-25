import mongoose from "mongoose";

const colorwaySchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      default: "Nike Mercurial Vapor 17",
      maxlength: 100,
    },
    edition: { type: String, required: true, trim: true, maxlength: 80 },
    colorway: { type: String, required: true, trim: true, maxlength: 120 },
    tier: { type: String, enum: ["Elite", "Pro", "Academy", "Club"], required: true },
    surface: {
      type: String,
      enum: ["Firm Ground", "Artificial Grass", "Multi-Ground", "Turf", "Indoor/Court"],
      required: true,
    },
    styleCode: { type: String, required: true, trim: true, uppercase: true, unique: true, maxlength: 20 },
    status: { type: String, enum: ["Listed", "Coming soon"], required: true },
    colors: {
      type: [{ type: String, match: /^#[0-9A-Fa-f]{6}$/ }],
      required: true,
      validate: {
        validator: (colors) => colors.length >= 2 && colors.length <= 6,
        message: "Add between 2 and 6 hex color swatches.",
      },
    },
    sourceUrl: { type: String, required: true, trim: true, maxlength: 500 },
    imageUrl: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Colorway", colorwaySchema);
