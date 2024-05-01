import { createClient } from '@libsql/client';
import * as env from '../../../config.json'
import { drizzle } from 'drizzle-orm/libsql';
import * as pokemonsJson from './pokemons.json'
import { pokemons } from '../schema';

const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function seed() {
    const pokemonsFormated = pokemonsJson.map((pokemon) => {
        return { id: pokemon.id, name: pokemon.name }
    })

    await db.insert(pokemons).values(pokemonsFormated)
}

seed().then(() => {
    console.log("🌱 Database seeded!")
})
