import express from "express";
import mongoose from "mongoose";
import Plant from "../models/plant.js";

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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

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
    const plants = await Plant.find(filter).sort({ name: 1 });
    res.json(plants);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid plant ID." });
  }
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found." });
    res.json(plant);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json(plant);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid plant ID." });
  }
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
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
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid plant ID." });
  }
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found." });
    res.json({ message: "Plant deleted successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
