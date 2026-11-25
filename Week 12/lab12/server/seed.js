import dotenv from "dotenv";
import mongoose from "mongoose";
import Plant from "./models/plant.js";

dotenv.config();

const starterPlants = [
  {
    name: "White Wood Aster",
    scientificName: "Eurybia divaricata",
    description: "A woodland perennial with airy clusters of small white flowers.",
    sunlight: "Part shade to shade",
    soil: "Well-drained, average",
    water: "Low to moderate",
    height: 24,
    bloomSeason: "Fall",
    nativeRange: "Eastern North America",
    wildlifeBenefits: ["Late-season nectar for bees and butterflies"],
  },
  {
    name: "Black-Eyed Susan",
    scientificName: "Rudbeckia hirta",
    description: "A cheerful, adaptable wildflower with golden petals and dark centers.",
    sunlight: "Full sun",
    soil: "Well-drained",
    water: "Low to moderate",
    height: 30,
    bloomSeason: "Summer",
    nativeRange: "Eastern and central North America",
    wildlifeBenefits: ["Nectar for pollinators", "Seeds for birds"],
  },
  {
    name: "Butterfly Weed",
    scientificName: "Asclepias tuberosa",
    description: "A drought-tolerant milkweed with vivid orange flower clusters.",
    sunlight: "Full sun",
    soil: "Dry, well-drained",
    water: "Low",
    height: 24,
    bloomSeason: "Summer",
    nativeRange: "Eastern and central North America",
    wildlifeBenefits: ["Host plant for monarch caterpillars", "Nectar for butterflies"],
  },
  {
    name: "Eastern Redbud",
    scientificName: "Cercis canadensis",
    description: "A small understory tree that blooms pink before its heart-shaped leaves emerge.",
    sunlight: "Full sun to part shade",
    soil: "Moist, well-drained",
    water: "Moderate",
    height: 240,
    bloomSeason: "Spring",
    nativeRange: "Eastern North America",
    wildlifeBenefits: ["Early nectar for bees", "Seeds for birds"],
  },
  {
    name: "Wild Blue Phlox",
    scientificName: "Phlox divaricata",
    description: "A fragrant woodland groundcover with soft blue spring flowers.",
    sunlight: "Part shade",
    soil: "Moist, humus-rich",
    water: "Moderate",
    height: 12,
    bloomSeason: "Spring",
    nativeRange: "Eastern North America",
    wildlifeBenefits: ["Nectar for butterflies and hummingbirds"],
  },
  {
    name: "Mountain Laurel",
    scientificName: "Kalmia latifolia",
    description: "An evergreen woodland shrub known for intricate clusters of pink-white blooms.",
    sunlight: "Part shade",
    soil: "Acidic, well-drained",
    water: "Moderate",
    height: 120,
    bloomSeason: "Late spring",
    nativeRange: "Eastern United States",
    wildlifeBenefits: ["Nectar for native bees"],
  },
];

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is required. Copy .env.example to .env and configure it.");
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Plant.countDocuments();
    if (count === 0) {
      await Plant.insertMany(starterPlants);
      console.log(`Added ${starterPlants.length} starter plants.`);
    } else {
      console.log(`Seed skipped: the collection already contains ${count} plants.`);
    }
  } catch (error) {
    console.error("Could not seed MongoDB:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
