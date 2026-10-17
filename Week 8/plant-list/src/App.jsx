import {useState} from 'react'

const plants = [
  {
    id: 1,
    name: "White Wood Aster",
    height: 12,
    season: "Summer",
    sunlight: "Full Sun",
  },
  {
    id: 2,
    name: "Purple Coneflower",
    height: 36,
    season: "Summer",
    sunlight: "Full Sun",
  },
  {
    id: 3,
    name: "Black-eyed Susan",
    height: 24,
    season: "Summer",
    sunlight: "Full Sun",
  },
  {
    id: 4,
    name: "Bee Balm",
    height: 48,
    season: "Summer",
    sunlight: "Partial Shade",
  },
  {
    id: 5,
    name: "Columbine",
    height: 18,
    season: "Spring",
    sunlight: "Partial Shade",
  },
  {
    id: 6,
    name: "Hosta",
    height: 24,
    season: "Summer",
    sunlight: "Shade",
  },
  {
    id: 7,
    name: "Ferns",
    height: 36,
    season: "Spring",
    sunlight: "Shade",
  },
  {
    id: 8,
    name: "Succulents",
    height: 12,
    season: "Year-round",
    sunlight: "Full Sun",
  },
  {
    id: 9,
    name: "Lavender",
    height: 24,
    season: "Summer",
    sunlight: "Full Sun",
  },
  {
    id: 10,
    name: "Daffodils",
    height: 18,
    season: "Spring",
    sunlight: "Full Sun",
  },
  {
    id: 11,
    name: "Tulips",
    height: 12,
    season: "Spring",
    sunlight: "Full Sun",
  },
  {
    id: 12,
    name: "Roses",
    height: 36,
    season: "Summer",
    sunlight: "Full Sun",
  },
  {
    id: 13,
    name: "Marigolds",
    height: 12,
    season: "Summer",
    sunlight: "Full Sun",
  },
  {
    id: 14,
    name: "Zinnias",
    height: 24,
    season: "Summer",
    sunlight: "Full Sun",
  },
  {
    id: 15,
    name: "Snapdragons",
    height: 18,
    season: "Summer",
    sunlight: "Full Sun",
  }
];


function App() {
  
  const [search, setSearch] = useState("");
  const [selectedSunlight, setSelectedSunlight] = useState("All");
  const [favorites, setFavorites] = useState([]);

  
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSunlight =
      selectedSunlight === "All" ||
      plant.sunlight === selectedSunlight;

    return matchesSearch && matchesSunlight;
  });

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
      <p>Search for a plant or filter by sunlight:</p>

      <input
        type="text"
        placeholder="Search for a plant..."
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

      <p>Plants Found: {filteredPlants.length}</p>
      <p>Favorites: {favorites.length}</p>

     
      {filteredPlants.length === 0 ? (
        <p>No plants found.</p>
      ) : (
        <div className="plant-list">
          {filteredPlants.map((plant) => (
            <div className="plant-card" key={plant.id}>
              <h2>{plant.name}</h2>
              <p>Height: {plant.height} inches</p>
              <p>Bloom Season: {plant.season}</p>
              <p>Sunlight: {plant.sunlight}</p>

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