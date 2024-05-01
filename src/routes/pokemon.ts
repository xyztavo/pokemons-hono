import { Hono } from "hono";
import { buildTursoClient } from "../db/db";
import { Env } from "../types/env";
import { pokemons } from "../db/schema";
import { count, gt, sql } from "drizzle-orm";

export const pokemonRoute = new Hono<{ Bindings: Env }>()

pokemonRoute.get('/', async (c) => {
    const db = buildTursoClient(c.env)
    const { pageIndex, query } = c.req.query()

    const maxResults = 20
    const page = Number(pageIndex) * maxResults

    const pokemonsResults = await db
        .select()
        .from(pokemons).where(query ? sql`${pokemons.name} LIKE ${'%' + query + '%'}` : gt(pokemons.id, 0))
        .limit(maxResults)
        .offset(page)

    const pokemonsCount = await db
        .select({ count: count(pokemons) })
        .from(pokemons).where(query ? sql`${pokemons.name} LIKE ${'%' + query + '%'}` : gt(pokemons.id, 0))

    if (pokemonsCount.length < 1) return c.json({ message: "theres no more pokemons" }, 404)

    const maxPokemons = Math.floor(pokemonsCount[0].count)

    const maxPages = Math.floor(maxPokemons / maxResults)

    if (pokemonsResults.length < 1) return c.json({ message: "theres no more pokemons" }, 404)

    return c.json({ pokemons: pokemonsResults, pageIndex: Number(pageIndex), maxPages, pokemonsCount: pokemonsCount[0].count })
})