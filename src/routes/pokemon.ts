import { Hono } from "hono";
import { buildTursoClient } from "../db/db";
import { Env } from "../types/env";
import { pokemons, pokemonsTypelist, typeList } from "../db/schema";
import { count, eq, gt, sql } from "drizzle-orm";

export const pokemonRoute = new Hono<{ Bindings: Env }>()

pokemonRoute.get('/', async (c) => {
    const db = buildTursoClient(c.env)
    const { pageIndex, query } = c.req.query()

    const maxResults = 20
    const page = Number(pageIndex) * maxResults

    const pokemonsResults = await db
        .select()
        .from(pokemons)
        .innerJoin(pokemonsTypelist, eq(pokemons.id, pokemonsTypelist.pokemonId))
        .innerJoin(typeList, eq(typeList.id, pokemonsTypelist.typeId))
        .limit(maxResults)
        .offset(page)
        .where(query ? sql`${pokemons.name} LIKE ${'%' + query + '%'}` : gt(pokemons.id, 0))
        

        const mergedResults = pokemonsResults.reduce((acc, curr) => {
            const existingPokemonIndex = acc.findIndex(pokemon => pokemon.id === curr.pokemons.id);
            if (existingPokemonIndex !== -1) {
                if (curr.type_list.type !== null) { // Check if the type is not null
                    acc[existingPokemonIndex].types.push(curr.type_list.type);
                }
            } else {
                const typesArray = [];
                if (curr.type_list.type !== null) { // Check if the type is not null
                    typesArray.push(curr.type_list.type);
                }
                acc.push({
                    id: curr.pokemons.id,
                    name: curr.pokemons.name,
                    types: typesArray
                });
            }
            return acc;
        }, [] as { id: number; name: string; types: string[] }[]);

    const pokemonsCount = await db
        .select({ count: count(pokemons) })
        .from(pokemons).where(query ? sql`${pokemons.name} LIKE ${'%' + query + '%'}` : gt(pokemons.id, 0))

    if (pokemonsCount.length < 1) return c.json({ message: "theres no more pokemons" }, 404)

    const maxPokemons = Math.floor(pokemonsCount[0].count)

    const maxPages = Math.floor((maxPokemons / maxResults) - 0.01)

    if (mergedResults.length < 1) return c.json({ message: "theres no more pokemons" }, 404)

    return c.json({ pokemons: mergedResults, pageIndex: Number(pageIndex), maxPages, pokemonsCount: pokemonsCount[0].count })
})