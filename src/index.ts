import { Hono } from 'hono'
import { userRoute } from './routes/users'

const app = new Hono()

app.get('/', (c) => {
    return c.json({
        message: "Health ok!",
        description: "This is a rebuild of my pokedoro project which uses cloudfare workers and turso db."
    })
})

app.route('/user', userRoute)

export default app
