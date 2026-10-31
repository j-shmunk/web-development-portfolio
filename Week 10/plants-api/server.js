const express = require('express');

const app = express();
const port = 3000;

//parse the JSON request bodies
app.use(express.json());
app.use(express.static('public'));

//in memory array for plants
let plants = [
    {
        id: 1, name: "White Wood Aster",
        scientificName: "Eurybia divaricata",
        height: 12, season: "Summer",
        sunlight: "Partial Shade", soil: "Loamy"
    },
    {
        id: 2, name: "Purple Coneflower",
        scientificName: "Echinacea purpurea",
        height: 36, season: "Summer",
        sunlight: "Full Sun", soil: "Loamy"
    },
    {
        id: 3, name: "Black-eyed Susan",
        scientificName: "Rudbeckia hirta",
        height: 24, season: "Summer",
        sunlight: "Full Sun", soil: "Loamy"
    },
    {
        id: 4, name: "Bee Balm",
        scientificName: "Monarda didyma",
        height: 48, season: "Summer",
        sunlight: "Partial Shade", soil: "Loamy"
    },
    {
        id: 5, name: "Columbine",
        scientificName: "Aquilegia canadensis",
        height: 18, season: "Spring",
        sunlight: "Partial Shade", soil: "Loamy"
    }
];

let nextId = 6;

//validate plant data
function validatePlant(body) {
    if(!body || typeof body !== 'object' || Array.isArray(body)) {
        return "A plant object is required";
    }

    const {name, scientificName, height, season, sunlight, soil} = body;

    if(typeof name !== 'string' || !name.trim()) {
        return "name is required";
    }
    if(typeof scientificName !== 'string' || !scientificName.trim()) {
        return "scientificName is required";
    }
    if(typeof height !== 'number' || !Number.isFinite(height) || height <= 0) {
        return "height must be a positive number";
    }
    if(typeof season !== 'string' || !season.trim()) {
        return "season is required";
    }
    if(typeof sunlight !== 'string' || !sunlight.trim()) {
        return "sunlight is required";
    }
    if(typeof soil !== 'string' || !soil.trim()) {
        return "soil is required";
    }

    return null;
}

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Plants API</title>
                <link rel="stylesheet" type="text/css" href="/css/style.css">
            </head>
            <body>
                <h1>Welcome to the Plants API</h1>
                <p>Use the following endpoints to interact with the API:</p>
                <ul>
                    <li>GET /plants - Get all plants</li>
                    <li>GET /plants/:id - Get a plant by ID</li>
                    <li>POST /plants - Create a new plant</li>
                    <li>PUT /plants/:id - Update a plant by ID</li>
                    <li>DELETE /plants/:id - Delete a plant by ID</li>
                </ul>
            </body>
        </html>
    `);
});

//routes
//GET /plants - get all plants
app.get('/plants', (req, res) => {
    res.status(200).json(plants);
});

//GET /plants/:id - get a plant by id
app.get('/plants/:id', (req, res) => {
    const id = Number(req.params.id);
    const plant = plants.find((p) => p.id === id);

    if(!plant) {
        return res.status(404).json({ error: "Plant not found" });
    }

    res.status(200).json(plant);
});

//create a plant
//POST /plants - create a new plant
app.post('/plants', (req, res) => {
    const error = validatePlant(req.body);

    if(error) {
        return res.status(400).json({ error });
    }

    const {name, scientificName, height, season, sunlight, soil} = req.body;
    const newPlant = {
        id: nextId++,
        name,
        scientificName,
        height,
        season,
        sunlight,
        soil
    };

    plants.push(newPlant);
    res.status(201).json(newPlant);
});

//put
//PUT /plants/:id - update a plant by id
app.put('/plants/:id', (req, res) => {
    const id = Number(req.params.id);
    const plantIndex = plants.findIndex((p) => p.id === id);

    if(plantIndex === -1) {
        return res.status(404).json({ error: "Plant not found" });
    }

    const error = validatePlant(req.body);

    if(error) {
        return res.status(400).json({ error });
    }

    const {name, scientificName, height, season, sunlight, soil} = req.body;
    const updatedPlant = {
        id,
        name,
        scientificName,
        height,
        season,
        sunlight,
        soil
    };

    plants[plantIndex] = updatedPlant;
    res.status(200).json(updatedPlant);
});

//delete
//DELETE /plants/:id - delete a plant by id
app.delete('/plants/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = plants.findIndex((p) => p.id === id);

    if(index === -1) {
        return res.status(404).json({ error: "Plant not found" });
    }

    const [removedPlant] = plants.splice(index, 1);

    res.status(200).json({
        message: "Plant deleted",
        plant: removedPlant
    });
});

//start our server
app.listen(port, () => {
    console.log(`Plants API is running on http://localhost:${port}`);
});