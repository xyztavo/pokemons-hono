import { createClient } from '@libsql/client';
import * as env from '../../../config.json'
import { drizzle } from 'drizzle-orm/libsql';
import * as pokemonsJson from './pokedata/pokemons.json'
import * as typelistJson from './pokedata/typelist.json'
import { pokemons, pokemonsTypelist, typeList } from '../schema';
import { getPokemonsTypelistFormated } from './pokedata/utils/getPokemonsTypelistFormated';

const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function seed() {
    const pokemonsFormated = pokemonsJson.map((pokemon) => {
        return { id: pokemon.id, name: pokemon.name }
    })

    const typeListFormated = typelistJson.map((type) => {
        return { type: type.type }
    })

    const pokemonsTypelistFormatted = getPokemonsTypelistFormated


    await db.insert(pokemons).values(pokemonsFormated)
    await db.insert(typeList).values(typeListFormated)
    await db.insert(pokemonsTypelist).values(pokemonsTypelistFormatted)
}

seed().then(() => {
    console.log("🌱 Database seeded!")
})
