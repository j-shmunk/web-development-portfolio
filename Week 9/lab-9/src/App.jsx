import {useState} from "react";
import "./App.css";

function App() {
  // Variables //
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // function to fetch weather
  async function getWeather(){
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // GET request using sample garden coordinates
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=40.50&longitude=-77.00&current=temperature_2m,relative_humidity_2m,precipitation&temperature_unit=fahrenheit&precipitation_unit=inch"
      );

      // check for error
      if(!response.ok){
        throw new Error("Failed to fetch weather");
      }

      // parse the JSON response
      const data = await response.json();

      if(!data.current){
        throw new Error("Weather information is unavailable");
      }

      setWeather(data.current);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{textAlign: "center", padding: "30px"}}>
      <h1>Native Plant Weather App</h1>
      <p>Check weather conditions for your garden.</p>

      <button onClick={getWeather} disabled={loading}>
        Get Weather
      </button>

      {loading && <p>Loading Weather...</p>}

      {error && <p style={{color: "red"}}>{error}</p>}

      {/* display the weather if available */}
      {weather && !loading && (
        <div>
          <h2>Current Garden Weather</h2>
          <p>Temperature: {weather.temperature_2m} °F</p>
          <p>Humidity: {weather.relative_humidity_2m}%</p>
          <p>Precipitation: {weather.precipitation} inches</p>
        </div>
      )}

      <p>
        Weather data from{" "}
        <a href="https://open-meteo.com/">Open-Meteo</a>
      </p>
    </div>
  );
}

export default App;