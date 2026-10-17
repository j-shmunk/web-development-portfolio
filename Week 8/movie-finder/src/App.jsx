import {useState} from 'react'

const movies = [
  {
    id: 1,
    title: "Seven Pounds",
    genre: "Drama",
    year: 2008,
  },
  {
    id: 2,
    title: "The Pursuit of Happyness",
    genre: "Drama",
    year: 2006,
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action",
    year: 2008,
  },
  {
    id: 4,
    title: "Inception",
    genre: "Sci-Fi",
    year: 2010,
  },
  {
    id: 5,
    title: "The Matrix",
    genre: "Sci-Fi",
    year: 1999,
  },
  {
    id: 6,
    title: "Goodfellas",
    genre: "Crime",
    year: 1990,
  },
  {
    id: 7,
    title: "The Godfather",
    genre: "Crime",
    year: 1972,
  },
  {
    id: 8,
    title: "Pulp Fiction",
    genre: "Crime",
    year: 1994,
  },
  {
    id: 9,
    title: "The Shawshank Redemption",
    genre: "Drama",
    year: 1994,
  },
  {
    id: 10,
    title: "Forrest Gump",
    genre: "Drama",
    year: 1994,
  },
  {
    id: 11,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    genre: "Fantasy",
    year: 2001,
  },
  {
    id: 12,
    title: "The Lord of the Rings: The Two Towers",
    genre: "Fantasy",
    year: 2002,
  },
  {
    id: 13,
    title: "The Lord of the Rings: The Return of the King",
    genre: "Fantasy",
    year: 2003,
  },
  {
    id: 14,
    title: "The Avengers",
    genre: "Action",
    year: 2012,
  },
  {
    id: 15,
    title: "Avengers: Age of Ultron",
    genre: "Action",
    year: 2015,
  }
];

function App() {
  //state info

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [favorites, setFavorites] = useState([]);

  //searching and filtering
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title
      .toLowerCase().includes(search.toLowerCase());
  

  const matchesGenre = 
    selectedGenre === "All" ||
    movie.genre === selectedGenre;
  return matchesSearch && matchesGenre;
  });

//add and remove favorites
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    setFavorites(favorites.filter((movieId) => movieId !== id));
  } else {
    setFavorites([...favorites, id]);
  }
}

return (
  <div className="App">
    <h1>Movie Finder</h1>
    <p>Search for a movie or filter by genre:</p>

    <input
      type="text"
      placeholder="Search for a movie..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    {/*Genre Filter*/}
    <select
      value={selectedGenre}
      onChange={(e) => setSelectedGenre(e.target.value)}
    >
      <option value="All">All</option>
      <option value="Action">Action</option>
      <option value="Drama">Drama</option>
      <option value="Sci-Fi">Sci-Fi</option>
      <option value="Crime">Crime</option>
      <option value="Fantasy">Fantasy</option>
    </select>

    <p>Movies Found: {filteredMovies.length}</p>
    <p>Favorites: {favorites.length}</p>

    {/*Render on filters*/}
    {filteredMovies.length === 0 ? (
      <p>No movies found.</p>
    ) : (
      <div className="movie-list">
        {filteredMovies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <h2>{movie.title}</h2>
            <p>Genre: {movie.genre}</p>
            <p>Year: {movie.year}</p>
            <button 
              onClick={() => toggleFavorite(movie.id)}
              >
                {favorites.includes(movie.id)
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