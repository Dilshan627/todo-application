FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /app

RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN java -version && javac -version

COPY pom.xml .

RUN mvn dependency:resolve || true

COPY src ./src

RUN mvn clean package -DskipTests

RUN ls -lh /app/target/*.jar

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
