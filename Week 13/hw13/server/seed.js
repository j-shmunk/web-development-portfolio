import dotenv from "dotenv";
import mongoose from "mongoose";
import Colorway from "./models/Colorway.js";

dotenv.config();

const source = "https://www.nike.com/t/mercurial-vapor-17-elite-firm-ground-low-top-soccer-cleats-YnaBVCly/IF8508-102";
const colorways = [
  {
    edition: "Core",
    colorway: "White/Dusty Cactus",
    tier: "Elite",
    surface: "Firm Ground",
    styleCode: "IF8508-102",
    status: "Listed",
    colors: ["#F5F3EF", "#A4C842", "#252525"],
    sourceUrl: source,
    imageUrl: "https://static.nike.com/a/images/t_PDP_144_v1/f_auto,q_auto:eco/007d54db-bd1c-41c1-84aa-79994b54af82/VAPOR+17+ELITE+FG.png",
  },
  {
    edition: "Core",
    colorway: "Bright Crimson/Blur",
    tier: "Elite",
    surface: "Firm Ground",
    styleCode: "IF8508-600",
    status: "Listed",
    colors: ["#E53245", "#E6D9D5", "#242424"],
    sourceUrl: "https://www.nike.com/t/mercurial-vapor-17-elite-firm-ground-low-top-soccer-cleats-YnaBVCly/IF8508-600",
    imageUrl: "https://static.nike.com/a/images/t_PDP_144_v1/f_auto,q_auto:eco/4299b7a3-93c0-4f78-bfad-7c43b6448b7a/VAPOR+17+ELITE+FG.png",
  },
  {
    edition: "Core",
    colorway: "Black/Black/Illusion Green",
    tier: "Elite",
    surface: "Firm Ground",
    styleCode: "IF8508-001",
    status: "Listed",
    colors: ["#111111", "#A6E51D"],
    sourceUrl: "https://www.nike.com/t/mercurial-vapor-17-elite-firm-ground-low-top-soccer-cleats-YnaBVCly/IF8508-001",
    imageUrl: "https://static.nike.com/a/images/t_PDP_144_v1/f_auto,q_auto:eco/3897b187-4d25-4a77-b4e0-4aa6e5d3aea1/VAPOR+17+ELITE+FG.png",
  },
  {
    edition: "United",
    colorway: "Multi-Color/Black",
    tier: "Elite",
    surface: "Firm Ground",
    styleCode: "IQ7698-900",
    status: "Listed",
    colors: ["#EF4D39", "#31599A", "#FFD54A", "#171717"],
    sourceUrl: "https://www.nike.com/t/united-mercurial-vapor-17-elite-firm-ground-low-top-soccer-cleats-YnaBVCly/IQ7698-900",
    imageUrl: "https://static.nike.com/a/images/t_PDP_144_v1/f_auto,q_auto:eco/b21ca0a8-1ad1-4779-88f5-78a03ca8b7cb/VAPOR+17+ELITE+FG+NU4.png",
  },
  {
    edition: "Vini Jr.",
    colorway: "Laser Orange/Fuchsia Flash",
    tier: "Elite",
    surface: "Firm Ground",
    styleCode: "IQ8048-800",
    status: "Listed",
    colors: ["#FF6A16", "#E92B84", "#F5EBDD"],
    sourceUrl: "https://www.nike.com/t/mercurial-vapor-17-elite-vini-jr-firm-ground-low-top-soccer-cleats-YnaBVCly/IQ8048-800",
    imageUrl: "https://static.nike.com/a/images/t_PDP_144_v1/f_auto,q_auto:eco/f47b93ef-cdc2-4a72-ad22-a3ded8d95147/VAPOR+17+ELITE+FG+VJR.png",
  },
  {
    edition: "Kobe Mambacurial",
    colorway: "Hyper Pink/Red Plum/Electric Green",
    tier: "Elite",
    surface: "Firm Ground",
    styleCode: "IU3417-600",
    status: "Coming soon",
    colors: ["#F00984", "#7A194D", "#76D13D", "#171717"],
    sourceUrl: "https://www.nike.com/t/kobe-mercurial-vapor-17-elite-mambacurial-firm-ground-low-top-soccer-cleats-jnaOooe2/IU3417-600",
    imageUrl: "https://static.nike.com/a/images/t_PDP_144_v1/f_auto,q_auto:eco/e8babfe8-3aa4-49c9-b29e-f30e7c89ed98/VAPOR+17+ELITE+FG+SE.png",
  },
];

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is required. Copy .env.example to .env and configure it.");
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    for (const colorway of colorways) {
      await Colorway.updateOne(
        { styleCode: colorway.styleCode },
        { $set: colorway },
        { upsert: true, runValidators: true },
      );
    }
    console.log(`Seeded ${colorways.length} Mercurial Vapor 17 colorway records.`);
  } catch (error) {
    console.error("Could not seed MongoDB:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
