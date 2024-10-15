# RJ45 REST API

This REST API works as an abstraction to the database and handles most of the business logic.

## Prerequisites

- [Docker](https://www.docker.com)
- [Java 21](https://docs.aws.amazon.com/corretto/latest/corretto-21-ug/downloads-list.html)

> Docker is enough for running the project. However, it's recommended to install java 21 for development.

## Running the app

``` bash
docker build -t rj45-api . && docker run -p --name rj45-api -e DB_URL=postgress://postgres:postgres@localhost:5432/db 8080:8080 rj45-api
```

or with [docker compose](../compose.yaml):

``` bash
docker compose up
```

## Access OpenAPI

[Here's a self hosted instance of the app with Swagger UI](https://api.rj45.ddulce.app/docs)

## Client

The frontend, a web application is available [here](https://rj45.ddulce.app/) and its source code [here](../web/README.md).

## Development

It's still possible to run the app without docker, in fact it's recommended for development as the spring boot app will [reload on file changes](https://docs.spring.io/spring-boot/how-to/hotswapping.html#howto.hotswapping.fast-application-restarts).

### Environment Variables

Create a `.env` file with the following content:

``` bash
DB_URL=postgres://postgres:postgres@localhost:5432/db
```

### Database Configuration

#### Docker

This command will start a PostgreSQL 16 container with the `db` database, `postgres` user and `postgres` password.

``` bash
docker run -d --name rj45-db -v rj45-db:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=db -p 5432:5432 postgres:16
```

You can the access the database with:

``` powershell
docker exec -it spring psql -U postgres
```

> The volume `rj45-db` holds the data from the container to persist across restarts.

#### Local

You can also use a local database, just make sure to change the `DB_URL` in the `.env` file.

### Running the app

``` bash
./mvnw spring-boot:run
```