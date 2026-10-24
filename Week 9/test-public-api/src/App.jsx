import {useState} from "react";
import "./App.css";

function App() {
  // Variable //
  const [dogImage, setDogimage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //function to fetch dog image
  async function getDog(){
    setLoading(true);
    setError("");

    try {
      // get request
      const response = await fetch(
        "https://dog.ceo/api/breeds/image/random"
      );

      // check for error
      if(!response.ok){
        throw new Error("Failed to fetch dog image")
      }

      //parse the JSON response
      const data = await response.json();
      setDogimage(data.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{textAlign: "center" , padding: "30px"}}>
    <h1>Random Dog App</h1>
    <button onClick={getDog}>Get a Dog!</button>

    {loading && <p>Loading Dog Image...</p>}

    {error && <p style={{color: "red"}}>{error}</p>}

    /* display the dog image if available */
    {dogImage && !loading && (
      <div>
        <h2>Look at this dog!</h2>
        <img
        src={dogImage}
        alt="Random Dog"
        style={{maxwidth: "400px", marginTop: "20px"}} 
        />
      </div>
    )}
  </div>
  );
}

export default App;