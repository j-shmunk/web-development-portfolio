import express from "express";
import mongoose from "mongoose";
import Plant from "../models/Plant.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();
const searchableFields = [
  "name",
  "scientificName",
  "description",
  "sunlight",
  "soil",
  "water",
  "bloomSeason",
  "nativeRange",
  "wildlifeBenefits",
];
const textLimits = {
  name: 100,
  scientificName: 120,
  description: 1000,
  sunlight: 100,
  soil: 100,
  water: 100,
  bloomSeason: 60,
  nativeRange: 200,
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readPlant(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Plant details must be sent as a JSON object." };
  }

  const plant = {};
  for (const [field, maxLength] of Object.entries(textLimits)) {
    const value = body[field];
    if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
      return { error: `${field} is required and must be no more than ${maxLength} characters.` };
    }
    plant[field] = value.trim();
  }

  if (body.height === null || body.height === "") {
    plant.height = null;
  } else if (
    typeof body.height !== "number" ||
    !Number.isInteger(body.height) ||
    body.height < 0 ||
    body.height > 3000
  ) {
    return { error: "Height must be a whole number between 0 and 3000 inches." };
  } else {
    plant.height = body.height;
  }

  if (
    !Array.isArray(body.wildlifeBenefits) ||
    body.wildlifeBenefits.length > 8 ||
    body.wildlifeBenefits.some(
      (benefit) => typeof benefit !== "string" || !benefit.trim() || benefit.trim().length > 120,
    )
  ) {
    return { error: "Wildlife benefits must be a list of up to 8 values, each no longer than 120 characters." };
  }
  plant.wildlifeBenefits = body.wildlifeBenefits.map((benefit) => benefit.trim());

  if (typeof body.image !== "string" || body.image.length > 500) {
    return { error: "Image URL must be a string of 500 characters or fewer." };
  }
  const image = body.image.trim();
  if (image) {
    try {
      const imageUrl = new URL(image);
      if (imageUrl.protocol !== "https:" && imageUrl.protocol !== "http:") {
        return { error: "Image URL must use HTTP or HTTPS." };
      }
    } catch {
      return { error: "Provide a valid image URL." };
    }
  }
  plant.image = image;
  return { plant };
}

function validId(id, res) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid plant ID." });
    return false;
  }
  return true;
}

router.use(requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const filter = search
      ? {
          $or: searchableFields.map((field) => ({
            [field]: { $regex: escapeRegex(search), $options: "i" },
          })),
        }
      : {};
    res.json(await Plant.find(filter).sort({ name: 1 }));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  if (!validId(req.params.id, res)) return;
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found." });
    res.json(plant);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const result = readPlant(req.body);
  if (result.error) return res.status(400).json({ message: result.error });
  try {
    res.status(201).json(await Plant.create(result.plant));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  if (!validId(req.params.id, res)) return;
  const result = readPlant(req.body);
  if (result.error) return res.status(400).json({ message: result.error });
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, result.plant, {
      new: true,
      runValidators: true,
    });
    if (!plant) return res.status(404).json({ message: "Plant not found." });
    res.json(plant);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  if (!validId(req.params.id, res)) return;
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found." });
    res.json({ message: "Plant deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
