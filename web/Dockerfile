FROM oven/bun AS build

ENV PROD=1

COPY app/ /app

COPY main.js .

RUN bun main.js

FROM nginx:1.27-alpine AS prod

COPY --from=build /app /usr/share/nginx/html

EXPOSE 80
