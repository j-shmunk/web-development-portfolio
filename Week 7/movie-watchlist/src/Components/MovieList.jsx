import MovieCard from "./MovieCard.jsx";

function MovieList() {
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

return (
    <section>
        <h2>Movies</h2>
        <div className="movie-list">
            {movies.map((movie, index) => (
                <MovieCard
                    key={index}
                    title={movie.title}
                    genre={movie.genre}
                    releaseYear={movie.year}
                />
            ))}
        </div>
    </section>
    );
}
export default MovieList;
