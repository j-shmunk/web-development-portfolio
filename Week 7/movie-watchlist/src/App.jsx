import "./index.css";
import Navigation from "./Components/Navigation.jsx";
import Footer from "./Components/Footer.jsx";
import MovieList from "./Components/MovieList.jsx";

function App() {
  return (
    <>
      <Navigation />
      <main>
        <MovieList />
      </main>
      <Footer />
    </>
  );
}

export default App;