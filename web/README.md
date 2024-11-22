# Web

Web frontend for the S.T.A.R project.

## Prerequisites

- [Bun.js](https://bun.js.org)
- [API and Database](../api/README.md)
- [Analytics](../analytics/README.md)

> This application uses the API to fetch data from the database and the analytics module to display tests results.

## Running the app

You can define the following environment variables in a `.env` file:

- `VITE_API_URL`: the URL of the core API. The default is `http://localhost:8080`.
- `VITE_ANALYTICS_URL`: the URL of the analytics API. The default is `http://localhost:8000`.

> You can copy the `.env.example` file to `.env` and change the values accordingly.

You can then run the app with:

``` bash
bun i
bun run build
bun run preview
```

> Provided that the API is running on `http://localhost:8080` and the analytics is running on `http://localhost:8000`.

## Development

It's still possible to run the app without docker, in fact it's recommended for development as the spring boot app will [reload on file changes](https://docs.spring.io/spring-boot/how-to/hotswapping.html#howto.hotswapping.fast-application-restarts).

### Database

You need a PostgreSQL 16 database running. You can use docker to create one:

This command will start a PostgreSQL 16 server with a `dev` database, `postgres` user and `postgres` password.

``` bash
docker run -d --name star-db -v star-db:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=dev -p 5432:5432 postgres:16
```

You can the access the database with:

``` powershell
docker exec -it star-db psql -U postgres -d dev
```

> The volume `star-db` holds the data from the container to persist across restarts.

### Running the app

Use the following command to run the app:

``` bash
./mvnw spring-boot:run
```

You can access the API at [http://localhost:8080](http://localhost:8080). Any changes to the code will be automatically reloaded.


{
  "access": "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiZXZhbHVhdG9yIiwiZW1haWwiOiJkYXZpZF9kdWxjZUBpZWVlLm9yZyIsIm5hbWUiOiJEYXZpZCBEdWxjZSIsInN1YiI6IjEiLCJpYXQiOjE3MzIyMzYwNTUsImV4cCI6MTczMjI1MDQ1NX0.ZBCojPlOhx8E0YwMhqQZE3HppCDgyjTb9dssfiOM8wc-XEMLwu_cnCzLQceHfbwr_L-yt-VZUCrB9f9BOCpXSg",
  "refresh": "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiZXZhbHVhdG9yIiwiZW1haWwiOiJkYXZpZF9kdWxjZUBpZWVlLm9yZyIsIm5hbWUiOiJEYXZpZCBEdWxjZSIsInN1YiI6IjEiLCJpYXQiOjE3MzIyMzYwNTUsImV4cCI6MTczMzUzMjA1NX0.ZRcMOqLqPcTvNP_ugqIN9mTnbPvBh031qs7Nc1K-NewlnfdPMorqmdKeDhH5TskTEqn2KNg_jglSZ95a13_cBQ"
}