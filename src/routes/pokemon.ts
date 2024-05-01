import { Hono } from "hono";
import { buildTursoClient } from "../db/db";
import { Env } from "../types/env";
import { pokemons } from "../db/schema";

export const pokemonRoute = new Hono<{ Bindings: Env }>()

pokemonRoute.get('/', async (c) => {
    const db = buildTursoClient(c.env)
    const { pageIndex } = c.req.query()
    const maxResults = 20
    const page = Number(pageIndex) * maxResults

    const pokemonsResults = await db.select().from(pokemons).limit(maxResults).offset(page)
    return c.json({ pokemonsResults, pageIndex })
})