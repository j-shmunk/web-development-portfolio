import mongoose from 'mongoose';
import dotenv from 'dotenv';
import creature from './models/creature.js';

dotenv.config();

const creatures = [
    {
        name: 'Dragon',
        species: 'Reptile',
        habitat: 'Mountains',
        rarity: 'rare',
        description: 'A mythical creature that breathes fire.',
    },
    {
        name: 'Unicorn',
        species: 'Mammal',
        habitat: 'Forests',
        rarity: 'rare',
        description: 'A legendary horse-like creature with a single horn.',
    },
    {
        name: 'Phoenix',
        species: 'Bird',
        habitat: 'Deserts',
        rarity: 'rare',
        description: 'A mythical bird that is reborn from its ashes.',
    },
    {
        name: 'Griffin',
        species: 'Hybrid',
        habitat: 'Mountains',
        rarity: 'rare',
        description: 'A legendary creature with the body of a lion and the head and wings of an eagle.',
    },
    {
        name: 'Mermaid',
        species: 'Aquatic',
        habitat: 'Oceans',
        rarity: 'uncommon',
        description: 'A mythical creature with the upper body of a human and the tail of a fish.',
    },
];

try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/creatures');
    await creature.deleteMany({});
    await creature.insertMany(creatures);
    console.log('Database seeded successfully');
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}