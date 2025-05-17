package com.atharva.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableScheduling
public class DailySync {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();
        System.setProperty("DATABASE_URL", dotenv.get("DATABASE_URL"));
        System.setProperty("KAFKA_SERVERS", dotenv.get("KAFKA_SERVERS"));
        System.setProperty("KAFKA_USERNAME", dotenv.get("KAFKA_USERNAME"));
        System.setProperty("KAFKA_PASSWORD", dotenv.get("KAFKA_PASSWORD"));
        System.setProperty("DATABASE_USER", dotenv.get("DATABASE_USER"));
        System.setProperty("REDIS_HOST", dotenv.get("REDIS_HOST"));
        System.setProperty("REDIS_PASSWORD", dotenv.get("REDIS_PASSWORD"));
        System.setProperty("GOOGLE_APP_USERNAME", dotenv.get("GOOGLE_APP_USERNAME"));
        System.setProperty("GOOGLE_APP_PASSWORD", dotenv.get("GOOGLE_APP_PASSWORD"));
        System.setProperty("KAFKA_SERVER", dotenv.get("KAFKA_SERVER"));
        System.setProperty("WEATHER_APP_KEY", dotenv.get("WEATHER_APP_KEY"));
        System.setProperty("DATABASE_PASSWORD", dotenv.get("DATABASE_PASSWORD"));
        System.setProperty("DATABASE_ACTIVE", dotenv.get("DATABASE_ACTIVE"));
        SpringApplication.run(DailySync.class, args);

    }



}
