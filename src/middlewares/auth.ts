import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'

export const auth = createMiddleware(async (c, next) => {
    try {
        const authBearer = c.req.header('Authorization') as string
        const authToken = authBearer.split(" ")[1] as string
        await verify(authToken, c.env.SECRET_JWT)
    } catch (error) {
        return c.json({ message: "unauthorized" }, 401)
    }

    await next()
})