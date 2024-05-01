# Hono Pokémons
Simple project that uses some cool tech
- [Cloudfare Workers](https://workers.cloudflare.com/)
- [Hono](https://hono.dev/)
- [Turso DB](https://turso.tech/)
- [Drizzle ORM](https://orm.drizzle.team/)
## Setup enviorment variables
Go to [config.example.json](./config.example.json), add the [turso db url and token](https://turso.tech/) and remove the .example from the file.

Go to [.dev.vars.example](./.dev.vars.example) and add the add the [turso db token](https://turso.tech/) and the jwt token and remove .example from the file extension. mind creating a strong JWT.

node command to generate a strong jwt secret:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Go to [wrangler.toml.example](./wrangler.toml.example) and add the turso [turso db url](https://turso.tech/)

## Push schema to your database and seed

```
bun run db:push
bun run db:seed
```

## Download depedencies and start dev server

```
bun i
bun dev
```

## Deploy to production using cloudfare workers

```
bun run deploy
```
---

## Custom commands:

```
db:generate 
// generates migration folder 

db:push
// pushes changes to database

db:studio
// opens up drizzle studio db viewer

db:seed
// seed database with pokemons
```

## Todos
- [x] hash password
- [x] create login with jwt
- [x] create pokemons table
- [x] seed pokemons with pokemons
- [x] create many to many pokemons and user
- [x] create a way to connect a pokemon to a certain user
- [x] create a pokemons url to get pokemons
- [x] add pagination to that shit
- [x] create a way to query pokemon
- [x] add count to pokemons and maxpages
- [ ] create typelist many to many
- [ ] create a way to connect type to typelist to pokemon
- [ ] swagger

## Known bugs
- [x] if pokemons return exacts to a integer ex: /pokemon?query=ra&pageIndex=2 the maxPages is going to hallucinate