import { Hono } from 'hono'
import { buildTursoClient } from "../db/db";
import { Env } from '../types/env';
import { userPokemons, users, pokemons, pokemonsTypelist, typeList } from '../db/schema';
import bcrypt from 'bcryptjs'
import { sign } from 'hono/jwt';
import { sql, eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator'
import { auth } from '../middlewares/auth';
import { nanoid } from 'nanoid';
import { getIdFromToken } from '../utils/getIdFromToken';


export const userRoute = new Hono<{ Bindings: Env }>()




// Create User
const newUserSchema = z.object({
    name: z.string().min(5, {
        message: "min of 5 characters to name"
    }),
    email: z.string().email({ message: "email not valid" }),
    password: z.string().min(5, {
        message: "min of 5 characters to password"
    })
})

userRoute.post('/', zValidator('json', newUserSchema), async (c) => {
    const { email, password, name } = await c.req.json()

    const db = buildTursoClient(c.env)

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await db.insert(users).values({ email, password: hashedPassword, name, id: nanoid() }).returning({ user_id: users.id, username: users.name })

    const token = await sign(
        { username: createdUser[0].username, user_id: createdUser[0].user_id }, c.env.SECRET_JWT
    )

    return c.json({ message: "user created with ease", user_id: createdUser[0].user_id, token }, 201)
})

// Login User
userRoute.post('/login', async (c) => {
    const db = buildTursoClient(c.env)

    const { email, password } = await c.req.json()

    const existingUser = await db.select().from(users).where(eq(users.email, email))

    try {
        await bcrypt.compare(password, existingUser[0].password)
    } catch (error) {
        return c.json({ message: "password does not match" }, 401)
    }



    const token = await sign(
        { name: existingUser[0].name, user_id: existingUser[0].id }, c.env.SECRET_JWT
    )

    return c.json({ message: "logged in!", token }, 200)
})

// Update User
const updateUserSchema = z.object({
    name: z.string().min(5, {
        message: "min of 5 characters to name"
    }),
})

userRoute.put('/profile', auth, zValidator('json', updateUserSchema), async (c) => {
    const { name } = await c.req.json()
    const db = buildTursoClient(c.env)
    const idFromToken = getIdFromToken(c)


    const updatedUser = await db.update(users).set({ name }).where(sql`${users.id} = ${idFromToken}`).returning({ users })
    return c.json({ updatedUser }, 200)
})



// Get user
userRoute.get('/profile', auth, async (c) => {
    const db = buildTursoClient(c.env)
    const idFromToken = getIdFromToken(c)

    try {
        const results = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, idFromToken))
        return c.json({ user: results[0] })
    } catch (error) {
        return c.json({ message: "user not found" }, 404)
    }

})

// get user pokemons
userRoute.get('/pokemon', auth, async (c) => {
    const db = buildTursoClient(c.env)
    const idFromToken = getIdFromToken(c)

    const results = await db.select({ users, pokemons, typeList }).from(users)
        .innerJoin(userPokemons, eq(users.id, userPokemons.userId)).groupBy()
        .innerJoin(pokemons, eq(userPokemons.pokemonsId, pokemons.id))
        .innerJoin(pokemonsTypelist, eq(pokemons.id, pokemonsTypelist.pokemonId))
        .innerJoin(typeList, eq(pokemonsTypelist.typeId, typeList.id))
        .where(eq(users.id, idFromToken))

    const mergedResults = results.reduce((acc, curr) => {
        const existingPokemonIndex = acc.findIndex(pokemon => pokemon.id === curr.pokemons.id);
        if (existingPokemonIndex !== -1) {
            if (curr.typeList.type !== null) { // Check if the type is not null
                acc[existingPokemonIndex].types.push(curr.typeList.type);
            }
        } else {
            const typesArray = [];
            if (curr.typeList.type !== null) { // Check if the type is not null
                typesArray.push(curr.typeList.type);
            }
            acc.push({
                id: curr.pokemons.id,
                name: curr.pokemons.name,
                types: typesArray
            });
        }
        return acc;
    }, [] as { id: number; name: string; types: string[] }[]);

    return c.json({ userid: results[0].users.id, username: results[0].users.name, pokemons: mergedResults })
})

// add pokemon to user
const addPokemonToUserBody = z.object({
    pokemonId: z.number()
})
userRoute.put('/pokemon', auth, zValidator('json', addPokemonToUserBody), async (c) => {
    const { pokemonId } = await c.req.json()
    const db = buildTursoClient(c.env)
    const idFromToken = getIdFromToken(c)

    try {
        await db.insert(userPokemons).values({ userId: idFromToken, pokemonsId: pokemonId })
        return c.json({ message: 'pokemon added to user!' }, 201)
    } catch (error) {
        return c.json({ message: 'could not add pokemon' }, 500)
    }
})


