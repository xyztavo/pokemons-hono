import { Hono } from "hono"
import { Env } from "../../types/env"
import { buildTursoClient } from "../../db/db"
import { pokemons, pokemonsTypelist, typeList, userPokemons, users } from "../../db/schema"
import { asc, eq, gt, sql, and, inArray, count } from "drizzle-orm"
import { mergePokemonsFromResult } from "../pokemon/pokemon-route"

export const usersRoute = new Hono<{ Bindings: Env }>()

// get basic profile user info
usersRoute.get('/:username/', async (c) => {
    const db = buildTursoClient(c.env)
    const username = c.req.param("username")

    const results = await db.select({ user: users, pokemonsCount: count(userPokemons)}).from(users).where(eq(users.name, username)).innerJoin(userPokemons, eq(userPokemons.userId, users.id)).innerJoin(pokemons, eq(userPokemons.pokemonsId, pokemons.id))

    if (results.length < 1) {
        return c.json({ message: `username: ${username} not found` }, 404)
    }

    return c.json({ username: results[0].user.name, createdAt: results[0].user.createdAt, pokemonsCount: results[0].pokemonsCount })
})

// get user pokemons
usersRoute.get('/:username/pokemons', async (c) => {
    const db = buildTursoClient(c.env)
    const username = c.req.param("username")
    const { pageIndex, query } = c.req.query()

    const maxResults = 20
    const page = Number(pageIndex) * maxResults

    const existingUser = await db.select().from(users).where(eq(users.name, username))

    if (existingUser.length < 1) return c.json({ message: `no username: ${username} was found` }, 404)

    try {
        const pokemonsResults = await
            db.select()
                .from(users)
                .innerJoin(userPokemons, eq(users.id, userPokemons.userId))
                .innerJoin(pokemons, eq(userPokemons.pokemonsId, pokemons.id))
                .where(and(eq(users.name, username), query ? sql`${pokemons.name} LIKE ${'%' + query + '%'}` : gt(pokemons.id, 0)))
                .orderBy(pokemons.id, asc(pokemons.id))
                .limit(maxResults)
                .offset(page)

        const pokemonsWithTypelist = await
            db.select()
                .from(pokemonsTypelist)
                .innerJoin(typeList, eq(typeList.id, pokemonsTypelist.typeId))
                .where(inArray(pokemonsTypelist.pokemonId, pokemonsResults.map(m => m.pokemons.id.toString())));

        const pokemonsCount = await db
            .select({ count: count(pokemons) })
            .from(users)
            .innerJoin(userPokemons, eq(users.id, userPokemons.userId))
            .innerJoin(pokemons, eq(userPokemons.pokemonsId, pokemons.id))
            .where(and(eq(users.name, username), query ? sql`${pokemons.name} LIKE ${'%' + query + '%'}` : gt(pokemons.id, 0)));


        const maxPokemons = Math.floor(pokemonsCount[0].count)
        const maxPages = Math.floor(maxPokemons / maxResults)

        return c.json({ user: pokemonsResults[0].user.name, totalCount: pokemonsCount[0].count, pageIndex: Number(pageIndex), maxPages, pokemons: mergePokemonsFromResult(pokemonsResults.map(m => m.pokemons), pokemonsWithTypelist) })

    } catch (error) {
        return c.json({ message: `No pokemons named ${query} on ${username} bag were found` }, 400)
    }
})