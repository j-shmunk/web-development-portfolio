import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    scientificName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    sunlight: { type: String, required: true, trim: true },
    soil: { type: String, required: true, trim: true },
    water: { type: String, required: true, trim: true },
    height: { type: Number, min: 0, default: null },
    bloomSeason: { type: String, required: true, trim: true },
    nativeRange: { type: String, required: true, trim: true },
    wildlifeBenefits: { type: [String], default: [] },
    image: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Plant", plantSchema);
