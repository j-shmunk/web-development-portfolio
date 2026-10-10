import "./index.css";
import Navigation from "./components/Navigation.jsx";
import Footer from "./components/Footer.jsx";
import PlantList from "./components/PlantList.jsx";

function App() {
  return (
    <>
      <Navigation />
      <main>
        <PlantList />
      </main>
      <Footer />
    </>
  );
}

export default App;