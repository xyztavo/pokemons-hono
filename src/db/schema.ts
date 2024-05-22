import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").$type<"admin" | "customer">().default('customer'),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});


export const pokemons = sqliteTable("pokemons", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
})

export const userPokemons = sqliteTable("user_pokemons", {
  userPokemonsId: integer("user_pokemons_id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id, { onDelete: 'cascade' }),
  pokemonsId: integer("pokemon_id").references(() => pokemons.id, { onDelete: 'cascade' })
})

export const pokemonsTypelist = sqliteTable("pokemons_typelist", {
  pokemonId: text("pokemon_id").references(() => pokemons.id, { onDelete: "cascade" }),
  typeId: integer("type_id").references(() => typeList.id, { onDelete: 'cascade' })
})

export const typeList = sqliteTable("type_list", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type")
})

export const pokemonsRelations = relations(pokemons, ({ many }) => ({
  users: many(users),
  typeList: many(typeList),
}));

export const typeListRelations = relations(typeList, ({ many }) => ({
  pokemons: many(pokemons),
}));


export const usersRelations = relations(users, ({ many }) => ({
  pokemons: many(pokemons),
}))