import {useState} from 'react'

const plants = [
  {
    id: 1,
    name: "White Wood Aster",
    scientificName: "Eurybia divaricata",
    height: 12,
    season: "Summer",
    sunlight: "Full Sun",
    soil: "Loamy",
  },
  {
    id: 2,
    name: "Purple Coneflower",
    scientificName: "Echinacea purpurea",
    height: 36,
    season: "Summer",
    sunlight: "Full Sun",
    soil: "Loamy",
  },
  {
    id: 3,
    name: "Black-eyed Susan",
    scientificName: "Rudbeckia hirta",
    height: 24,
    season: "Summer",
    sunlight: "Full Sun",
    soil: "Loamy",
  },
  {
    id: 4,
    name: "Bee Balm",
    scientificName: "Monarda didyma",
    height: 48,
    season: "Summer",
    sunlight: "Partial Shade",
    soil: "Loamy",
  },
  {
    id: 5,
    name: "Columbine",
    scientificName: "Aquilegia canadensis",
    height: 18,
    season: "Spring",
    sunlight: "Partial Shade",
    soil: "Loamy",
  },
  {
    id: 6,
    name: "Hosta",
    scientificName: "Hosta",
    height: 24,
    season: "Summer",
    sunlight: "Shade",
    soil: "Loamy",
  },
  {
    id: 7,
    name: "Ferns",
    scientificName: "",
    height: 36,
    season: "Spring",
    sunlight: "Shade",
    soil: "Loamy",
  },
  {
    id: 8,
    name: "Succulents",
    scientificName: "",
    height: 12,
    season: "Year-round",
    sunlight: "Full Sun",
    soil: "Sandy",
  },
  {
    id: 9,
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    height: 24,
    season: "Summer",
    sunlight: "Full Sun",
    soil: "Sandy",
  },
  {
    id: 10,
    name: "Daffodils",
    scientificName: "Narcissus",
    height: 18,
    season: "Spring",
    sunlight: "Full Sun",
    soil: "Loamy",
  },
  {
    id: 11,
    name: "Tulips",
    scientificName: "Tulipa",
    height: 12,
    season: "Spring",
    sunlight: "Full Sun",
    soil: "Sandy",
  },
  {
    id: 12,
    name: "Roses",
    scientificName: "Rosa",
    height: 36,
    season: "Summer",
    sunlight: "Full Sun",
    soil: "Loamy",
  },
  {
    id: 13,
    name: "Marigolds",
    scientificName: "Tagetes",
    height: 12,
    season: "Summer",
    sunlight: "Full Sun",
    soil: "Loamy",
  },
  {
    id: 14,
    name: "Zinnias",
    scientificName: "Zinnia elegans",
    height: 24,
    season: "Summer",
    sunlight: "Full Sun",
    soil: "Loamy",
  },
  {
    id: 15,
    name: "Snapdragons",
    scientificName: "Antirrhinum majus",
    height: 18,
    season: "Summer",
    sunlight: "Full Sun",
    soil: "Loamy",
  }
];


function App() {
  
  const [search, setSearch] = useState("");
  const [selectedSunlight, setSelectedSunlight] = useState("All");
  const [selectedSoil, setSelectedSoil] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [favorites, setFavorites] = useState([]);

  
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(search.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(search.toLowerCase());

    const matchesSunlight =
      selectedSunlight === "All" ||
      plant.sunlight === selectedSunlight;

    const matchesSoil =
      selectedSoil === "All" ||
      plant.soil === selectedSoil;

    const matchesSeason =
      selectedSeason === "All" ||
      plant.season === selectedSeason;

    return matchesSearch && matchesSunlight && matchesSoil && matchesSeason;
  });

  function resetFilters() {
    setSearch("");
    setSelectedSunlight("All");
    setSelectedSoil("All");
    setSelectedSeason("All");
  }

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((plantId) => plantId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  return (
    <div className="App">
      <h1>Plant List</h1>
      <p>Search by common or scientific name, or filter plants:</p>

      <input
        type="text"
        placeholder="Search by common or scientific name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={selectedSunlight}
        onChange={(e) => setSelectedSunlight(e.target.value)}
      >
        <option value="All">All Sunlight Requirements</option>
        <option value="Full Sun">Full Sun</option>
        <option value="Partial Shade">Partial Shade</option>
        <option value="Shade">Shade</option>
      </select>

      <select
        value={selectedSoil}
        onChange={(e) => setSelectedSoil(e.target.value)}
      >
        <option value="All">All Soil Types</option>
        <option value="Loamy">Loamy</option>
        <option value="Sandy">Sandy</option>
      </select>

      <select
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(e.target.value)}
      >
        <option value="All">All Bloom Seasons</option>
        <option value="Spring">Spring</option>
        <option value="Summer">Summer</option>
        <option value="Fall">Fall</option>
        <option value="Winter">Winter</option>
        <option value="Year-round">Year-round</option>
      </select>

      <button onClick={resetFilters}>
        Reset All Filters
      </button>

      <p>Plants Found: {filteredPlants.length}</p>
      <p>Favorites: {favorites.length}</p>

      {filteredPlants.length === 0 ? (
        <p>No plants found.</p>
      ) : (
        <div className="plant-list">
          {filteredPlants.map((plant) => (
            <div className="plant-card" key={plant.id}>
              <h2>{plant.name}</h2>
              <p>
                Scientific Name: {plant.scientificName || "Not specified"}
              </p>
              <p>Height: {plant.height} inches</p>
              <p>Bloom Season: {plant.season}</p>
              <p>Sunlight: {plant.sunlight}</p>
              <p>Soil Type: {plant.soil}</p>

              <button onClick={() => toggleFavorite(plant.id)}>
                {favorites.includes(plant.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;