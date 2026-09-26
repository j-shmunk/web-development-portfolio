const plants = [
  {
    name: "Black-Eyed Susan",
    scientificName: "Rudbeckia hirta",
    sunlight: "Full Sun",
    soil: "Well-drained",
    height: "2-3 feet",
    bloomSeason: "Summer to Fall",
    wildlifeBenefits: "Attracts butterflies and bees"
  },
  {
    name: "Butterfly Weed",
    scientificName: "Asclepias tuberosa",
    sunlight: "Full Sun",
    soil: "Well-drained",
    height: "2-3 feet",
    bloomSeason: "Summer",
    wildlifeBenefits: "Attracts butterflies, especially monarchs"
  },
  {
    name: "Eastern Redbud",
    scientificName: "Cercis canadensis",
    sunlight: "Full Sun to Partial Shade",
    soil: "Moist, well-drained",
    height: "20-30 feet",
    bloomSeason: "Spring",
    wildlifeBenefits: "Provides nectar for bees and early pollinators"
  },
  {
    name: "Mountain Laurel",
    scientificName: "Kalmia latifolia",
    sunlight: "Partial Shade",
    soil: "Acidic, well-drained",
    height: "10-20 feet",
    bloomSeason: "Spring",
    wildlifeBenefits: "Provides nectar for bees and early pollinators"
  },
  {
    name: "Sugar Maple",
    scientificName: "Acer saccharum",
    sunlight: "Full Sun to Partial Shade",
    soil: "Moist, well-drained",
    height: "40-60 feet",
    bloomSeason: "Spring",
    wildlifeBenefits: "Provides habitat for birds and mammals"
  },
  {
    name: "Wild Blue Phlox",
    scientificName: "Phlox divaricata",
    sunlight: "Full Sun to Partial Shade",
    soil: "Moist, well-drained",
    height: "1-2 feet",
    bloomSeason: "Spring to Summer",
    wildlifeBenefits: "Attracts butterflies and hummingbirds"
  },
  {
    name: "White Goldenrod",
    scientificName: "Solidago bicolor",
    sunlight: "Full Sun to Partial Shade",
    soil: "Moist, well-drained",
    height: "2-4 feet",
    bloomSeason: "Late Summer to Fall",
    wildlifeBenefits: "Provides nectar for bees and butterflies"
  },
  {
    name: "Purplestem Aster",
    scientificName: "Symphyotrichum puniceum",
    sunlight: "Full Sun to Partial Shade",
    soil: "Moist, well-drained",
    height: "3-5 feet",
    bloomSeason: "Late Summer to Fall",
    wildlifeBenefits: "Attracts butterflies and provides habitat for beneficial insects"
  },
  {
    name: "Elliptic Shinleaf",
    scientificName: "Pyrola elliptica",
    sunlight: "Partial Shade",
    soil: "Moist, well-drained",
    height: "6-12 inches",
    bloomSeason: "Summer",
    wildlifeBenefits: "Provides nectar for bees and other pollinators"
  },
  {
    name: "Fragrant Waterlily",
    scientificName: "Nymphaea odorata",
    sunlight: "Full Sun",
    soil: "Aquatic, submerged",
    height: "1-3 feet",
    bloomSeason: "Summer",
    wildlifeBenefits: "Provides habitat for aquatic insects and birds"
  }
];

// class variables for filter input
const searchInput = document.getElementById("search");
const sunlightFilter = document.getElementById("sunlight-filter");
const bloomSeasonFilter = document.getElementById("bloom-season-filter");
const resetButton = document.getElementById("reset-button");
const plantCount = document.getElementById("plant-count");



function displayPlants(plantList){
    const plantContainer = document.getElementById("plant-container");
    plantContainer.innerHTML = "";

    if(plantList.length === 0){
        plantContainer.innerHTML = "<p>No plants found matching your criteria. Try something else</p>";
        return;
    }

    plantList.forEach(plant => {
        const plantElement = document.createElement("div");
        plantElement.classList.add("plant");
        plantElement.innerHTML = `
            <h2>${plant.name}</h2>
            <p><strong>Scientific Name:</strong> ${plant.scientificName}</p>
            <p><strong>Sunlight:</strong> ${plant.sunlight}</p>
            <p><strong>Soil:</strong> ${plant.soil}</p>
            <p><strong>Height:</strong> ${plant.height}</p>
            <p><strong>Bloom Season:</strong> ${plant.bloomSeason}</p>
            <p><strong>Wildlife Benefits:</strong> ${plant.wildlifeBenefits}</p>
        `;
        plantContainer.appendChild(plantElement);
    });
}

function filterPlants() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSunlight = sunlightFilter.value;
    const selectedBloomSeason = bloomSeasonFilter.value;

    const filteredPlants = plants.filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm);
      const matchesSunlight = selectedSunlight === "all" || plant.sunlight === selectedSunlight;
      const matchesBloomSeason = selectedBloomSeason === "all" || plant.bloomSeason === selectedBloomSeason;

      return matchesSearch && matchesSunlight && matchesBloomSeason;
    });

    displayPlants(filteredPlants);
    plantCount.textContent = `Showing: ${filteredPlants.length} plants`;
}

filterPlants();

// Event listeners for filters
searchInput.addEventListener("input", filterPlants);
sunlightFilter.addEventListener("change", filterPlants);
bloomSeasonFilter.addEventListener("change", filterPlants);
resetButton.addEventListener("click", () => {
    searchInput.value = "";
    sunlightFilter.value = "all";
    bloomSeasonFilter.value = "all";
    filterPlants();
});
