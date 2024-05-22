import { Hono } from 'hono'
import { meRoute } from './routes/me/me-route'
import { pokemonRoute } from './routes/pokemon/pokemon-route'
import { cors } from 'hono/cors'
import { usersRoute } from './routes/users/users-route'


const app = new Hono()
// Allow local testing and production CORS 
app.use(cors({
    origin: ['http://localhost:3000', 'https://pokedoro-next.vercel.app'],
    allowHeaders: ['Authorization', 'Content-Type', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
}
))

// health check route
app.get('/', (c) => {
    return c.json({
        message: "Health ok!",
        description: "This is a rebuild of my pokedoro project which uses cloudfare workers and turso db."
    })
})

// Route to get the logged user info (gets id from JWT)
app.route('/me', meRoute)

// Route to get user info from global username (gets id from username)
app.route('/users', usersRoute)

// Route to get global pokemon info
app.route('/pokemon', pokemonRoute)

export default app
