# Database

We use PostgreSQL 16 for the database, you can run it with docker:

``` bash
docker run -d --name rj45-db -v rj45-db:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=db -p 5432:5432 postgres:16
```

In order to access the database you can use the `psql` command line tool:

``` bash
sudo apt install -y postgresql-client
```

Then you can access the database with:

``` bash
psql -h localhost -U postgres -d db
```

You can also use the `init.sql` file to create the tables and populate the database:

``` bash
psql -h localhost -U postgres -d db -f ./init.sql
```
