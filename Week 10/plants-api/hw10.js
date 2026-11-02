const express = require('express');

const app = express();
const port = 3000;

//parse the JSON request bodies
app.use(express.json());
app.use(express.static('public'));

//in memory array for cars
let cars = [
    { id: 1, make: "Toyota", model: "Camry", year: 2020 },
    { id: 2, make: "Honda", model: "Civic", year: 2019 },
    { id: 3, make: "Ford", model: "Mustang", year: 2018 },
    { id: 4, make: "Chevrolet", model: "Malibu", year: 2020 },
    { id: 5, make: "Nissan", model: "Altima", year: 2017 },
    { id: 6, make: "Hyundai", model: "Elantra", year: 2019 },
    { id: 7, make: "Kia", model: "Optima", year: 2020 },
    { id: 8, make: "Subaru", model: "Outback", year: 2018 },
    { id: 9, make: "Mazda", model: "CX-5", year: 2020 },
    { id: 10, make: "Volkswagen", model: "Jetta", year: 2019 },
    { id: 11, make: "BMW", model: "330i", year: 2020 },
    { id: 12, make: "Audi", model: "A4", year: 2018 },
    { id: 13, make: "Mercedes-Benz", model: "C300", year: 2019 },
    { id: 14, make: "Jeep", model: "Wrangler", year: 2020 },
    { id: 15, make: "Tesla", model: "Model 3", year: 2020 }
];

let nextId = 16;

//validate car data
function validateCar(body) {
    if(!body || typeof body !== 'object' || Array.isArray(body)) {
        return "A car object is required";
    }

    const {make, model, year} = body;

    if(typeof make !== 'string' || !make.trim()) {
        return "make is required";
    }
    if(typeof model !== 'string' || !model.trim()) {
        return "model is required";
    }
    if(!Number.isInteger(year) || year <= 0) {
        return "year must be a positive whole number";
    }

    return null;
}

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">
                <title>Cars API</title>
                <link rel="stylesheet" href="/css/style.css">
            </head>
            <body>
                <h1>Welcome to the Cars API</h1>
                <p>Use the following endpoints to interact with the API:</p>
                <ul>
                    <li>GET /cars - Get all cars</li>
                    <li>GET /cars/:id - Get a car by ID</li>
                    <li>POST /cars - Create a new car</li>
                    <li>PUT /cars/:id - Update a car by ID</li>
                    <li>DELETE /cars/:id - Delete a car by ID</li>
                </ul>
            </body>
        </html>
    `);
});

//validate IDs
app.param('id', (req, res, next, value) => {
    const id = Number(value);

    if(!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "ID must be a positive whole number"
        });
    }

    next();
});

//routes
//GET /cars - get all cars
app.get('/cars', (req, res) => {
    res.status(200).json(cars);
});

//GET /cars/:id - get a car by id
app.get('/cars/:id', (req, res) => {
    const id = Number(req.params.id);
    const car = cars.find((c) => c.id === id);

    if(!car) {
        return res.status(404).json({ error: "Car not found" });
    }

    res.status(200).json(car);
});

//create a car
//POST /cars - create a new car
app.post('/cars', (req, res) => {
    const error = validateCar(req.body);

    if(error) {
        return res.status(400).json({ error });
    }

    const {make, model, year} = req.body;
    const newCar = {
        id: nextId++,
        make,
        model,
        year
    };

    cars.push(newCar);
    res.status(201).json(newCar);
});

//put
//PUT /cars/:id - replace a car by id
app.put('/cars/:id', (req, res) => {
    const id = Number(req.params.id);
    const carIndex = cars.findIndex((c) => c.id === id);

    if(carIndex === -1) {
        return res.status(404).json({ error: "Car not found" });
    }

    const error = validateCar(req.body);

    if(error) {
        return res.status(400).json({ error });
    }

    const {make, model, year} = req.body;
    const updatedCar = {
        id,
        make,
        model,
        year
    };

    cars[carIndex] = updatedCar;
    res.status(200).json(updatedCar);
});

//delete
//DELETE /cars/:id - delete a car by id
app.delete('/cars/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = cars.findIndex((c) => c.id === id);

    if(index === -1) {
        return res.status(404).json({ error: "Car not found" });
    }

    const [removedCar] = cars.splice(index, 1);

    res.status(200).json({
        message: "Car deleted",
        car: removedCar
    });
});

//handle invalid JSON request bodies
app.use((error, req, res, next) => {
    if(error.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: "Request body must contain valid JSON"
        });
    }

    next(error);
});

//start our server
app.listen(port, () => {
    console.log(`Cars API is running on http://localhost:${port}`);
});