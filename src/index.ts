import { Hono } from 'hono'
import { userRoute } from './routes/users'
import { pokemonRoute } from './routes/pokemon'
import { cors } from 'hono/cors'


const app = new Hono()
app.use(cors({
    origin: 'http://localhost:3000',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  }))

app.get('/', (c) => {
    return c.json({
        message: "Health ok!",
        description: "This is a rebuild of my pokedoro project which uses cloudfare workers and turso db."
    })
})

app.route('/user', userRoute)
app.route('/pokemon', pokemonRoute)

export default app
