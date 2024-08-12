
type poke = {
    id: number,
    name: string,
    image: string,
    iconImage: string,
    type: string,
    jpName: string,
    jpType: string,
}

export default function PokemonThumbnails({ id, name, image, type }:poke) {
    return(
        <div className="thumb-container grass">
            <div className="number">
                <small>#0{id}</small>
            </div>
            <img src={image} alt={name} />
            <div className="detail-wrapper">
                <h4>{name}</h4>
                <h3>{type}</h3>
            </div>
        </div>
    )
}