# STAR REST API

This REST API works as an abstraction to the database and handles most of the business logic.

## Prerequisites

- [Docker](https://www.docker.com)
- [Java 21](https://docs.aws.amazon.com/corretto/latest/corretto-21-ug/downloads-list.html)

> Docker is enough for running the project. However, java 21 is mandatory for development.

## Running the app

You can run this API and its DB with [docker compose](../compose.yaml):

``` bash
docker compose up
```

The API will be available at [http://localhost:8080](http://localhost:8080) and the database at `localhost:5432`.

> See [Development](#development) for running the app without docker.

## Access OpenAPI

[Here's a self hosted instance of the app with Swagger UI](https://star.ddulce.app/api/docs)

## Client

The frontend, a web application is available [here](https://star.ddulce.app/) and its source code [here](../web/README.md).

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