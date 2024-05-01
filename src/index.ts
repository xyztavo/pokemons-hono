import { Hono } from 'hono'
import { userRoute } from './routes/users'
import { pokemonRoute } from './routes/pokemon'

const app = new Hono()

app.get('/', (c) => {
    return c.json({
        message: "Health ok!",
        description: "This is a rebuild of my pokedoro project which uses cloudfare workers and turso db."
    })
})

app.route('/user', userRoute)
app.route('/pokemon', pokemonRoute)

export default app
