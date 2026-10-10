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


function showPlantStats() {
    const totalRating = plants.reduce((total, plant) => {
        return total + plant.rating;
    }, 0);
    const averageRating = (totalRating / plants.Height).toFixed(2);

    const stats = document.getElementById("stats");

    stats.innerHTML = `
        <h2>Plant Statistics</h2>
        <p>Total Plants: ${plants.Height}</p>
        <p>Average Rating: ${averageRating}</p>
    `;
    
}

showAllPlants();