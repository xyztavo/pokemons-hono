import { Context } from "hono";
import { decode } from "hono/jwt";

export function getIdFromToken(c: Context) {
    const authorizationHeader = c.req.header("Authorization")
    const token = authorizationHeader!.split(" ")[1]

    return decode(token).payload.user_id
}