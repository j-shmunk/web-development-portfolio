import express from "express";
import mongoose from "mongoose";
import Colorway from "../models/Colorway.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();
const searchFields = ["edition", "colorway", "tier", "surface", "styleCode", "status"];
const allowedTiers = ["Elite", "Pro", "Academy", "Club"];
const allowedSurfaces = ["Firm Ground", "Artificial Grass", "Multi-Ground", "Turf", "Indoor/Court"];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readColorway(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Colorway details must be sent as a JSON object." };
  }
  const fields = {
    edition: 80,
    colorway: 120,
    styleCode: 20,
  };
  const result = {};
  for (const [field, maxLength] of Object.entries(fields)) {
    if (typeof body[field] !== "string" || !body[field].trim() || body[field].trim().length > maxLength) {
      return { error: `${field} is required and must be no more than ${maxLength} characters.` };
    }
    result[field] = body[field].trim();
  }
  result.styleCode = result.styleCode.toUpperCase();
  if (!allowedTiers.includes(body.tier)) return { error: "Select a valid product tier." };
  if (!allowedSurfaces.includes(body.surface)) return { error: "Select a valid playing surface." };
  if (!["Listed", "Coming soon"].includes(body.status)) return { error: "Select a valid catalog status." };
  result.tier = body.tier;
  result.surface = body.surface;
  result.status = body.status;

  if (
    !Array.isArray(body.colors) ||
    body.colors.length < 2 ||
    body.colors.length > 6 ||
    body.colors.some((color) => typeof color !== "string" || !/^#[0-9a-f]{6}$/i.test(color))
  ) {
    return { error: "Provide between 2 and 6 valid hex color swatches." };
  }
  result.colors = body.colors.map((color) => color.toUpperCase());

  for (const field of ["sourceUrl", "imageUrl"]) {
    const value = body[field] === undefined && field === "imageUrl" ? "" : body[field];
    if (typeof value !== "string" || value.length > 500) {
      return { error: `${field} must be a URL of 500 characters or fewer.` };
    }
    if (!value.trim() && field === "imageUrl") {
      result[field] = "";
      continue;
    }
    try {
      const url = new URL(value.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        return { error: `${field} must use HTTP or HTTPS.` };
      }
    } catch {
      return { error: `Provide a valid ${field}.` };
    }
    result[field] = value.trim();
  }
  result.productName = "Nike Mercurial Vapor 17";
  return { colorway: result };
}

function validId(id, res) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid colorway ID." });
    return false;
  }
  return true;
}

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const filter = search
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: escapeRegex(search), $options: "i" },
          })),
        }
      : {};
    res.json(await Colorway.find(filter).sort({ edition: 1, colorway: 1 }));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  if (!validId(req.params.id, res)) return;
  try {
    const item = await Colorway.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Colorway not found." });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const result = readColorway(req.body);
  if (result.error) return res.status(400).json({ message: result.error });
  try {
    res.status(201).json(await Colorway.create(result.colorway));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  if (!validId(req.params.id, res)) return;
  const result = readColorway(req.body);
  if (result.error) return res.status(400).json({ message: result.error });
  try {
    const item = await Colorway.findByIdAndUpdate(req.params.id, result.colorway, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Colorway not found." });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  if (!validId(req.params.id, res)) return;
  try {
    const item = await Colorway.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Colorway not found." });
    res.json({ message: "Colorway deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
