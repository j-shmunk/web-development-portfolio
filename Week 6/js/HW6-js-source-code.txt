const plants = [
    {
    name: "Black-Eyed Susan",
    scientificName: "Rudbeckia hirta",
    sunlight: "Full Sun",
    height: "2-3 feet",
    bloomSeason: "Summer to Fall",
  },
  {
    name: "Butterfly Weed",
    scientificName: "Asclepias tuberosa",
    sunlight: "Full Sun",
    height: "2-3 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Eastern Redbud",
    scientificName: "Cercis canadensis",
    sunlight: "Full Sun to Partial Shade",
    height: "20-30 feet",
    bloomSeason: "Spring",
  },
  {
    name: "Mountain Laurel",
    scientificName: "Kalmia latifolia",
    sunlight: "Partial Shade",
    height: "10-20 feet",
    bloomSeason: "Spring",
  },
  {
    name: "Sugar Maple",
    scientificName: "Acer saccharum",
    sunlight: "Full Sun to Partial Shade",
    height: "40-60 feet",
    bloomSeason: "Spring",
  },
  {
    name: "Wild Blue Phlox",
    scientificName: "Phlox divaricata",
    sunlight: "Full Sun to Partial Shade",
    height: "1-2 feet",
    bloomSeason: "Spring to Summer",
  },
  {
    name: "White Goldenrod",
    scientificName: "Solidago bicolor",
    sunlight: "Full Sun to Partial Shade",
    height: "2-4 feet",
    bloomSeason: "Late Summer to Fall",
  },
  {
    name: "Purplestem Aster",
    scientificName: "Symphyotrichum puniceum",
    sunlight: "Full Sun to Partial Shade",
    height: "3-5 feet",
    bloomSeason: "Late Summer to Fall",
  },
  {
    name: "Elliptic Shinleaf",
    scientificName: "Pyrola elliptica",
    sunlight: "Partial Shade",
    height: "6-12 inches",
    bloomSeason: "Summer",
  },
  {
    name: "Fragrant Waterlily",
    scientificName: "Nymphaea odorata",
    sunlight: "Full Sun",
    height: "1-3 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Virginsbower",
    scientificName: "Clematis virginiana",
    sunlight: "Full Sun to Partial Shade",
    height: "10-20 feet",
    bloomSeason: "Summer to Fall",
  },
  {
    name: "Spotted St. John's-Wort",
    scientificName: "Hypericum punctatum",
    sunlight: "Full Sun to Partial Shade",
    height: "2-4 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Northern Blueflag",
    scientificName: "Iris versicolor",
    sunlight: "Full Sun to Partial Shade",
    height: "2-4 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Spotted Jewelweed",
    scientificName: "Impatiens capensis",
    sunlight: "Partial Shade",
    height: "1-3 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Indian Tobacco",
    scientificName: "Lobelia inflata",
    sunlight: "Full Sun to Partial Shade",
    height: "2-4 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Great Blue Lobelia",
    scientificName: "Lobelia siphilitica",
    sunlight: "Full Sun to Partial Shade",
    height: "2-4 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Busy Seedbox",
    scientificName: "Ludwigia alternifolia",
    sunlight: "Full Sun to Partial Shade",
    height: "2-4 feet",
    bloomSeason: "Summer",
  },
  {
    name: "American Bugleweed",
    scientificName: "Lycopus americanus",
    sunlight: "Full Sun to Partial Shade",
    height: "2-4 feet",
    bloomSeason: "Summer",
  },
  {
    name: "False Solomon's Seal",
    scientificName: "Maianthemum racemosum",
    sunlight: "Partial Shade",
    height: "1-3 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Partridge-Berry",
    scientificName: "Mitchella repens",
    sunlight: "Partial Shade",
    height: "2-6 inches",
    bloomSeason: "Spring to Summer",
  }
]


function displayPlants(plantArray) {
    const plantList = document.getElementById("plantList");
    plantList.innerHTML = "";

        plantArray.map((plant) => {
            plantList.innerHTML += `
                <div class="plant">
                    <h2>${plant.name}</h2>
                    <p>Scientific Name: ${plant.scientificName}</p>
                    <p>Sunlight: ${plant.sunlight}</p>
                    <p>Height: ${plant.height}</p>
                    <p>Bloom Season: ${plant.bloomSeason}</p>
                </div>
        `;
    });
}


function showAllPlants() {
    displayPlants(plants);
}


function sortAlphabetically() {
    const sortedPlants = [...plants].sort((a,b) => {
        return a.name.localeCompare(b.name);
    });
    displayPlants(sortedPlants);
}

function filterBySunlight() {
    const sunlightInput = prompt("Enter a sunlight requirement to filter by (e.g., Full Sun, Partial Shade):");
    if (!sunlightInput || !sunlightInput.trim()) {
        return;
    }

    const filteredPlants = plants.filter(plant => plant.sunlight.toLowerCase().includes(sunlightInput.trim().toLowerCase()));
    if (filteredPlants.length === 0) {
        alert("No plants found for the sunlight requirement: " + sunlightInput);
        return;
    }

    displayPlants(filteredPlants);
}


function filterByBloomSeason() {
    const bloomSeasonInput = prompt("Enter a bloom season to filter by (e.g., Spring, Summer, Fall):");
    if (!bloomSeasonInput || !bloomSeasonInput.trim()) {
        return;
    }

    const filteredPlants = plants.filter(plant => plant.bloomSeason.toLowerCase().includes(bloomSeasonInput.trim().toLowerCase()));
    if (filteredPlants.length === 0) {
        alert("No plants found for the bloom season: " + bloomSeasonInput);
        return;
    }

    displayPlants(filteredPlants);
}

function filterByPlantHeight() {
    const heightInput = prompt("Enter a height to filter by (e.g., 1-3 feet, 4-6 feet):");
    if (!heightInput || !heightInput.trim()) {
        return;
    }

    const filteredPlants = plants.filter(plant => plant.height.toLowerCase() === heightInput.trim().toLowerCase());
    if (filteredPlants.length === 0) {
        alert("No plants found for the height: " + heightInput);
        return;
    }

    displayPlants(filteredPlants);
}


function findPlants() {
    const nameInput = prompt("Enter a plant name to search for:");

    const plantFound = plants.find(plant => plant.name.toLowerCase() === nameInput.toLowerCase());

    if (plantFound) {
        displayPlants([plantFound]);
    } else {
        alert("Plant not found.");
    }
}

function getHeightRangeInFeet(height) {
    const match = height.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(feet|foot|ft|inches|inch|in)\b/i);
    if (!match) {
        throw new Error(`Unable to parse plant height: ${height}`);
    }

    const conversionFactor = /^(inches|inch|in)$/i.test(match[3]) ? 1 / 12 : 1;
    return {
        minimum: Number(match[1]) * conversionFactor,
        maximum: Number(match[2]) * conversionFactor,
    };
}


function showPlantStats() {
    const plantsWithHeights = plants.map(plant => ({
        ...plant,
        heightRange: getHeightRangeInFeet(plant.height),
    }));
    const averageHeight = plantsWithHeights.reduce((total, plant) => {
        return total + (plant.heightRange.minimum + plant.heightRange.maximum) / 2;
    }, 0) / plantsWithHeights.length;
    const tallestHeight = Math.max(...plantsWithHeights.map(plant => plant.heightRange.maximum));
    const shortestHeight = Math.min(...plantsWithHeights.map(plant => plant.heightRange.minimum));
    const tallestPlants = plantsWithHeights.filter(plant => plant.heightRange.maximum === tallestHeight);
    const shortestPlants = plantsWithHeights.filter(plant => plant.heightRange.minimum === shortestHeight);

    const bloomSeasonCounts = ["Spring", "Summer", "Fall", "Winter"].map(season => ({
        name: season,
        count: plants.filter(plant => new RegExp(`\\b${season}\\b`, "i").test(plant.bloomSeason)).length,
    }));
    const sunlightCounts = plants.reduce((counts, plant) => {
        counts.set(plant.sunlight, (counts.get(plant.sunlight) || 0) + 1);
        return counts;
    }, new Map());

    const stats = document.getElementById("stats");

    stats.innerHTML = `
        <h2>Plant Statistics</h2>
        <p>Number of Plants: ${plants.length}</p>
        <p>Average Plant Height (range midpoints): ${averageHeight.toFixed(2)} feet</p>
        <p>Tallest Plant${tallestPlants.length === 1 ? "" : "s"}: ${tallestPlants.map(plant => `${plant.name} (${plant.height})`).join(", ")}</p>
        <p>Shortest Plant${shortestPlants.length === 1 ? "" : "s"}: ${shortestPlants.map(plant => `${plant.name} (${plant.height})`).join(", ")}</p>
        <div class="stats-group">
            <h3>Plants by Bloom Season</h3>
            <ul>${bloomSeasonCounts.map(season => `<li>${season.name}: ${season.count}</li>`).join("")}</ul>
        </div>
        <div class="stats-group">
            <h3>Plants by Sunlight Requirement</h3>
            <ul>${Array.from(sunlightCounts, ([sunlight, count]) => `<li>${sunlight}: ${count}</li>`).join("")}</ul>
        </div>
    `;
    
}

showPlantStats();
showAllPlants();