import PlantCard from "./PlantCard.jsx";

function PlantList() {
  const plants = [
    {
    name: "Black-Eyed Susan",
    scientificName: "Rudbeckia hirta",
    sunlight: "Full Sun",
    height: "2-3 feet",
    bloomSeason: "Summer to Fall",
  },
  {
    name: "Butterfly Weed",
    scientificName: "Asclepias tuberosa",
    sunlight: "Full Sun",
    height: "2-3 feet",
    bloomSeason: "Summer",
  },
  {
    name: "Eastern Redbud",
    scientificName: "Cercis canadensis",
    sunlight: "Full Sun to Partial Shade",
    height: "20-30 feet",
    bloomSeason: "Spring",
  },
  {
    name: "Mountain Laurel",
    scientificName: "Kalmia latifolia",
    sunlight: "Partial Shade",
    height: "10-20 feet",
    bloomSeason: "Spring",
  },
  {
    name: "Sugar Maple",
    scientificName: "Acer saccharum",
    sunlight: "Full Sun to Partial Shade",
    height: "40-60 feet",
    bloomSeason: "Spring",
  },
  {
    name: "Wild Blue Phlox",
    scientificName: "Phlox divaricata",
    sunlight: "Full Sun to Partial Shade",
    height: "1-2 feet",
    bloomSeason: "Spring to Summer",
  },
  {
    name: "White Goldenrod",
    scientificName: "Solidago bicolor",
    sunlight: "Full Sun to Partial Shade",
    height: "2-4 feet",
    bloomSeason: "Late Summer to Fall",
  },
  {
    name: "Purplestem Aster",
    scientificName: "Symphyotrichum puniceum",
    sunlight: "Full Sun to Partial Shade",
    height: "3-5 feet",
    bloomSeason: "Late Summer to Fall",
  },
  {
    name: "Elliptic Shinleaf",
    scientificName: "Pyrola elliptica",
    sunlight: "Partial Shade",
    height: "6-12 inches",
    bloomSeason: "Summer",
  },
  {
    name: "Fragrant Waterlily",
    scientificName: "Nymphaea odorata",
    sunlight: "Full Sun",
    height: "1-3 feet",
    bloomSeason: "Summer",
  }
]

return (
    <section>
        <h2>Plants</h2>
        <div className="plant-list">
            {plants.map((plant, index) => (
                <PlantCard
                    key={index}
                    title={plant.name}
                    scientificName={plant.scientificName}
                    sunlight={plant.sunlight}
                    height={plant.height}
                    bloomSeason={plant.bloomSeason}
                />
            ))}
        </div>
    </section>
    );
}


export default PlantList;
