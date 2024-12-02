FROM maven:3-amazoncorretto-21 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src src

RUN mvn package -DskipTests

FROM amazoncorretto:21-alpine AS runtime

ENV SPRING_PROFILES_ACTIVE=prod

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Least privilege principle
RUN addgroup --system javauser && \
    adduser -S -s /bin/false -G javauser javauser && \
    chown -R javauser:javauser .

USER javauser

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]