import { createMiddleware } from 'hono/factory'
import { decode } from 'hono/jwt'

export const verifyUserId = createMiddleware(async (c, next) => {
    try {
        const urlUserId = c.req.param('id')
        const authBearer = c.req.header('Authorization') as string
        const authToken = authBearer.split(" ")[1] as string
        const tokenUserId = decode(authToken).payload.user_id

        if (urlUserId !== tokenUserId) return c.json({ message: "access denied" }, 403)
    } catch (error) {
        return c.json({ message: "unauthorized s" }, 401)
    }

    await next()
})