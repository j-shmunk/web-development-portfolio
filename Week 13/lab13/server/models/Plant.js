import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    scientificName: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    sunlight: { type: String, required: true, trim: true, maxlength: 100 },
    soil: { type: String, required: true, trim: true, maxlength: 100 },
    water: { type: String, required: true, trim: true, maxlength: 100 },
    height: { type: Number, min: 0, max: 3000, default: null },
    bloomSeason: { type: String, required: true, trim: true, maxlength: 60 },
    nativeRange: { type: String, required: true, trim: true, maxlength: 200 },
    wildlifeBenefits: {
      type: [{ type: String, trim: true, maxlength: 120 }],
      default: [],
      validate: {
        validator: (benefits) => benefits.length <= 8,
        message: "A plant can have at most 8 wildlife benefits.",
      },
    },
    image: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Plant", plantSchema);
