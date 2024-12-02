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

### Prerequisites

You can run the API using the compose file in the [api](../api) directory:

``` bash
docker compose -f ./api/compose.yaml up # assuming you're on the root directory
```

Then you can use the dockerfile in the analytics directory to run the analytics module:

``` bash
docker build -t star-analytics ./analytics # assuming you're on the root directory
```

### Running the app

Create the same `.env` file as in the previous section.

Use the following command to run the app:

``` bash
bun dev
```

You can access it at [http://localhost:5173](http://localhost:5173). Any changes to the code will be automatically reloaded.
