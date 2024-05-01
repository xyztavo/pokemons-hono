import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").$type<"admin" | "customer">().default('customer'),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

export const usersRelations = relations(users, ({ many }) => ({
  pokemons: many(pokemons),
}))

export const pokemons = sqliteTable("pokemons", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  typeList: text("type_list")
})

export const pokemonsRelations = relations(pokemons, ({ many }) => ({
  users: many(users),
}));

export const userPokemons = sqliteTable("user_pokemons", {
  userId: text("user_id").references(() => users.id, { onDelete: 'cascade'}),
  pokemonsId: integer("pokemon_id").references(() => pokemons.id, { onDelete: 'cascade' }).primaryKey()
})

