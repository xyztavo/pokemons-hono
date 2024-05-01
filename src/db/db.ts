import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { Env } from "../types/env";
import * as schema from './schema'

export function buildTursoClient(env: Env) {
    const client = createClient({
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN,
    });

    return drizzle(client, { schema });
}