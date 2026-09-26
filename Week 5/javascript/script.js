const movies = [
  {
    title: "Transformers 2: Revenge of the Fallen",
    director: "Michael Bay",
    genre: "Action",
    releaseYear: 2009,
    rating: 6.0,
    runtime: 150,
    description: "The Autobots and Decepticons continue their battle on Earth, with the fate of humanity hanging in the balance."
  },
  {
    title: "Se7en",
    director: "David Fincher",
    genre: "Thriller",
    releaseYear: 1995,
    rating: 8.6,
    runtime: 127,
    description: "Two detectives hunt a serial killer who uses the seven deadly sins as his motives."
  },
  {
    title: "Dune: Part Two",
    director: "Denis Villeneuve",
    genre: "Science Fiction",
    releaseYear: 2023,
    rating: 8.2,
    runtime: 155,
    description: "The continuation of the epic saga, following Paul Atreides as he navigates the political and mystical challenges of Arrakis."
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    genre: "Science Fiction",
    releaseYear: 2010,
    rating: 8.8,
    runtime: 148,
    description: "A skilled thief is given a chance at redemption if he can successfully perform an inception, planting an idea into someone's subconscious."
  }
];

// class variables for filter input
const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genre-filter");
const yearFilter = document.getElementById("year-filter");
const resetButton = document.getElementById("reset-button");
const movieCount = document.getElementById("movie-count");



function displayMovies(movieList){
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = "";

    if(movieList.length === 0){
        movieContainer.innerHTML = "<p>No movies found matching your criteria. Try sum else</p>";
        return;
    }

    movieList.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");
        movieElement.innerHTML = `
            <h2>${movie.title}</h2> 
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Release Year:</strong> ${movie.releaseYear}</p>
            <p><strong>Rating:</strong> ${movie.rating}</p>
            <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
            <p><strong>Description:</strong> ${movie.description}</p>
        `;
        movieContainer.appendChild(movieElement);
    });
}

displayMovies(movies);


function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    const selectedYear = yearFilter.value;

    const filteredMovies = movies.filter(movie => {
      const mathcesSearch = movie.title.toLowerCase().includes(searchTerm);
      const matchesGenre = selectedGenre === "all"|| movie.genre === selectedGenre;
      let matchesYear = true;

      if (selectedYear === "1990"){
        matchesYear = movie.releaseYear < 2000;
      } else if (selectedYear === "2000"){
        matchesYear = movie.releaseYear >= 2000;
      }

      return mathcesSearch && matchesGenre && matchesYear;
    });

    displayMovies(filteredMovies);
    movieCount.textContent = `Showing: ${filteredMovies.length} movies`;
}

// Event listeners for filters
searchInput.addEventListener("input", filterMovies);
genreFilter.addEventListener("change", filterMovies);
yearFilter.addEventListener("change", filterMovies);
resetButton.addEventListener("click", () => {
    searchInput.value = "";
    genreFilter.value = "all";
    yearFilter.value = "all";
    filterMovies();
});

//Results are Empty

