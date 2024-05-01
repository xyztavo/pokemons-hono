import * as pokemonsJson from '../pokemons.json'

export const getPokemonsTypelistFormated = pokemonsJson.flatMap((pokemon) => {
    return pokemon.typeList.map((type) => {
        let typeId;
        switch (type) {
            case 'Bug':
            typeId = 1;
            break;
        case 'Flying':
            typeId = 2;
            break;
        case 'Poison':
            typeId = 3;
            break;
        case 'Normal':
            typeId = 4;
            break;
        case 'Electric':
            typeId = 5;
            break;
        case 'Ground':
            typeId = 6;
            break;
        case 'Fire':
            typeId = 7;
            break;
        case 'Fairy':
            typeId = 8;
            break;
        case 'Psychic':
            typeId = 9;
            break;
        case 'Water':
            typeId = 10;
            break;
        case 'Fighting':
            typeId = 11;
            break;
        case 'Grass':
            typeId = 12;
            break;
        case 'Rock':
            typeId = 13;
            break;
        case 'Dark':
            typeId = 14;
            break;
        case 'Steel':
            typeId = 15;
            break;
        case 'Ghost':
            typeId = 16;
            break;
        case 'Dragon':
            typeId = 17;
            break;
        case 'Ice':
            typeId = 18;
            break;
        }
        return { pokemonId: pokemon.id.toLocaleString(), typeId: typeId };
    })
})