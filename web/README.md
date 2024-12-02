# Web

Web frontend for the RJ45 project.

## Prerequisites

- [Bun.js](https://bun.js.org)
- [API and Database](../api/README.md)
- [Analytics](../analytics/README.md)

> This application uses the API to fetch data from the database and the analytics to display the results.

## Running the app

``` bash
docker build -t rj45-web . && docker run -p 80:80 --name rj45-web -e API_URL=http://localhost:8080 -e ANALYTICS_URL=http://localhost:8000 rj45-web
```

> Provided that the API is running on `http://localhost:8080` and the analytics is running on `http://localhost:8000`.

## Environment variables

You can define:

- `API_URL`: the URL of the core API. The default is `http://localhost:8080`.

- `ANALYTICS_URL`: the URL of the analytics API. The default is `http://localhost:8000`.

## Development

### Running locally

You only need to have Bun or Node installed, I recommend using Bun for better performance, but both can use the `serve` package.

You also need the other applications, I suggest running the [api, database](../api/compose.yaml) and [analytics](../analytics/README.md) using the compose files in each directory.

Then you can run the frontend with:

``` bash
bunx serve app # replace bunx with npx if you are using Node
```