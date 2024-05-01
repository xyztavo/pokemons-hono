import { Hono } from "hono";
import { buildTursoClient } from "../db/db";
import { Env } from "../types/env";
import { pokemons } from "../db/schema";
import { sql } from "drizzle-orm";

export const pokemonRoute = new Hono<{ Bindings: Env }>()

pokemonRoute.get('/', async (c) => {
    const db = buildTursoClient(c.env)
    const { pageIndex, query } = c.req.query()
    const maxResults = 20
    const page = Number(pageIndex) * maxResults
    const maxPokemons = 649

    const maxPages = Math.floor(maxPokemons / maxResults)

    const pokemonsResults = await db.select().from(pokemons).where(sql`${pokemons.name} LIKE ${'%' + query + '%'}`).limit(maxResults).offset(page)

    if (pokemonsResults.length < 1) return c.json({ message: "theres no more pokemons" }, 404)

    return c.json({ pokemonsResults, pageIndex, maxPages })
})