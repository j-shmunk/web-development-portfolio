function PlantCard(props) {
    return (
        <article className="plant-card">
            <h2>{props.title}</h2>
            <p>Scientific Name: {props.scientificName}</p>
            <p>Sunlight: {props.sunlight}</p>
            <p>Height: {props.height}</p>
            <p>Bloom Season: {props.bloomSeason}</p>
        </article>
    )
}

export default PlantCard;