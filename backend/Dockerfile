FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the JAR
COPY target/DailySync-0.0.1-SNAPSHOT.jar app.jar

# Copy the .env file
COPY .env .env

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
