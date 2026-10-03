const movies = [
    {
        title: "Transformers",
        genre: "Action",
        year: 2007,
        rating: 7.1
    },
    {
        title: "Transformers 2: Revenge of the Fallen",
        genre: "Action",
        year: 2009,
        rating: 10.0
    },
    {
        title: "Transformers 3: The Dark of the Moon",
        genre: "Action",
        year: 2011,
        rating: 9.4
    },
    {
        title: "Transformers 4: Age of Extinction",
        genre: "Action",
        year: 2014,
        rating: 8.2
    },
    {
        title: "Transformers 5: The Last Knight",
        genre: "Action",
        year: 2017,
        rating: 6.8
    },
    {
        title: "Transformers 6: Rise of the Beasts",
        genre: "Action",
        year: 2023,
        rating: 7.5
    },
    {
        title: "Superman",
        genre: "Action",
        year: 1978,
        rating: 7.3
    },
    {
        title: "Superman II",
        genre: "Action",
        year: 1980,
        rating: 6.5
    },
    {
        title: "Superman III",
        genre: "Action",
        year: 1983,
        rating: 5.5
    },
    {
        title: "Superman IV: The Quest for Peace",
        genre: "Action",
        year: 1987,
        rating: 4.5
    },
    {
        title: "Superman Returns",
        genre: "Action",
        year: 2006,
        rating: 6.2
    },
    {
        title: "Superman: Man of Steel",
        genre: "Action",
        year: 2013,
        rating: 7.1
    },
    {
        title: "The Dark Night",
        genre: "Action",
        year: 2008,
        rating: 9.0
    },
    {
        title: "The Dark Night Rises",
        genre: "Action",
        year: 2012,
        rating: 8.4
    },
    {
        title: "Batman Begins",
        genre: "Action",
        year: 2005,
        rating: 8.2
    },
];


//javascript display movies
function displayMovies(movieArray) {
    const movieList = document.getElementById("movieList");
    movieList.innerHTML = ""; // Clear existing content//map()

        movieArray.map((movie) => {
            movieList.innerHTML += `
                <div class="movie">
                    <h2>${movie.title}</h2>
                    <p>Genre: ${movie.genre}</p>
                    <p>Year: ${movie.year}</p>
                    <p class="rating">Rating: ${movie.rating}</p>
                </div>
        `;
    });
}

//show all movies
function showAllMovies() {
    displayMovies(movies);
}


function sortAlphabetically() {
    const sortedMovies = [...movies].sort((a,b) => {
        return a.title.localeCompare(b.title);
    });
    displayMovies(sortedMovies);
}

function filterByGenre() {
    const genreInput = prompt("Enter a genre to filter by (e.g., Action, Comedy, Drama):");
    if (genreInput) {
        alert("No movies found for the genre: " + genreInput);
        return;

    }

    const filteredMovies = movies.filter(movie => movie.genre.toLowerCase() === genreInput.toLowerCase());

    displayMovies(filteredMovies);
}


function filterByYear() {
    const yearInput = prompt("Enter a year to filter by (e.g., 2007, 2009, 2011):");
    if (yearInput) {
        alert("No movies found for the year");
        return;
    }
}

function filterByRating() {
    const ratinginput = movies.filter(movie => movie.rating >= 7.0);
    displayMovies(ratinginput);
}
//find specific movies
function findMovies() {
    const titleInput = prompt("Enter a movie title to search for:");

    const movieFound = movies.find(movie => movie.title.toLowerCase() === titleInput.toLowerCase());

    if (movieFound) {
        displayMovies([movieFound]);
    } else {
        alert("Movie not found.");
    }
}


function showMovieStats() {
    const totalRating = movies.reduce((total, movie) => {
        return total + movie.rating;
    }, 0);
    const averageRating = (totalRating / movies.length).toFixed(2);

    const stats = document.getElementById("stats");

    stats.innerHTML = `
        <h2>Movie Statistics</h2>
        <p>Total Movies: ${movies.length}</p>
        <p>Average Rating: ${averageRating}</p>
    `;
    
}

showAllMovies(); //Display all movies when the page loads