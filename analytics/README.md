# Analytics

This simple API is the analytics module of the RJ45 project. It's a FastAPI application that provides a REST API to perform analytics on tests.

## Prerequisites

- [Python 3.12](https://www.python.org/downloads/)
- [API and Database](../api/README.md)

> This application uses the API to fetch tests data.

## Running the app

``` bash
docker build -t rj45-analytics . && docker run -p 8000:8000 --name rj45-analytics -e API_URL=http://localhost:8080 rj45-analytics
```

> Provided that the API is running on `http://localhost:8080`

## Access OpenAPI

[Here's a self hosted instance of the app with Swagger UI](https://rj45.ddulce.app/analytics/docs)

## Environment variables

You can define `API_URL`, the URL of the API to fetch tests data from. The default is `http://localhost:8080`.

## Development

### Running locally

First you need to create a virtual environment and activate it:

``` bash
python3 -m venv .venv
source .venv/bin/activate
```

Then you need to install the dependencies:

``` bash
pip install -r reqs.txt
```

I suggest running the api and database using the [compose](../api/compose.yaml) file.

and then you can run this application using the following commands:

``` bash
fastapi dev main.py
```