import {useState} from "react";
import "./App.css";

function App() {
  // Variables //
  const [latitude, setLatitude] = useState("40.50");
  const [longitude, setLongitude] = useState("-77.00");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch weather
  async function getWeather(e){
    e.preventDefault();
    setError("");
    setWeather(null);

    if (
      latitude.trim() === "" ||
      longitude.trim() === "" ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude)) ||
      Number(latitude) < -90 ||
      Number(latitude) > 90 ||
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      setError("Enter a valid latitude and longitude.");
      return;
    }

    setLoading(true);

    try {
      // GET request
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${Number(latitude)}&longitude=${Number(longitude)}&current=temperature_2m,relative_humidity_2m,precipitation&temperature_unit=fahrenheit&precipitation_unit=inch`
      );

      // Check for errors
      if(!response.ok){
        throw new Error("Failed to fetch weather. Please try again.");
      }

      // Parse the JSON response
      const data = await response.json();

      if (
        !data.current ||
        typeof data.current.temperature_2m !== "number" ||
        typeof data.current.relative_humidity_2m !== "number" ||
        typeof data.current.precipitation !== "number"
      ) {
        throw new Error("Weather information is unavailable.");
      }

      // Update the displayed results
      setWeather({
        latitude: data.latitude,
        longitude: data.longitude,
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Native Plant Weather App</h1>
      <p>Enter your garden's coordinates to check the weather.</p>

      <form onSubmit={getWeather}>
        <label htmlFor="latitude">Latitude</label>
        <input
          id="latitude"
          type="number"
          min="-90"
          max="90"
          step="any"
          required
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />

        <label htmlFor="longitude">Longitude</label>
        <input
          id="longitude"
          type="number"
          min="-180"
          max="180"
          step="any"
          required
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </form>

      {loading && (
        <p className="loading" role="status">
          Loading weather information...
        </p>
      )}

      {error && (
        <p className="error" role="alert">{error}</p>
      )}

      {/* Display the weather if available */}
      {weather && !loading && (
        <div className="weather-card" aria-live="polite">
          <h2>Current Garden Weather</h2>
          <p>
            Weather location: {weather.latitude}, {weather.longitude}
          </p>
          <p>Temperature: {weather.temperature} °F</p>
          <p>Humidity: {weather.humidity}%</p>
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