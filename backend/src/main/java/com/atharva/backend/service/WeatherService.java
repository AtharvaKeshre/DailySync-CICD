package com.atharva.backend.service;

import com.atharva.backend.api.response.WeatherResponse;
import com.atharva.backend.cache.AppCache;
import com.atharva.backend.constants.PlaceHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AppCache appCache;
    @Autowired
    private RedisService redisService;

    public WeatherResponse getWeather(String city) {
        WeatherResponse weatherResponse = redisService.get("Weather_of_"+city,WeatherResponse.class);
        if(weatherResponse != null){
            return weatherResponse;
        }
        else{
            String finalAPI = appCache.APP_CACHE.get(AppCache.keys.WEATHER_API.toString()).replace(PlaceHolder.CITY,city).replace(PlaceHolder.API_KEY,apiKey);
            ResponseEntity<WeatherResponse> response = restTemplate.exchange(finalAPI, HttpMethod.GET, null, WeatherResponse.class);
            WeatherResponse body = response.getBody();
            if(body != null){
                redisService.set("Weather_of_"+city,body,300l);
            }
            return body;
        }


    }
}
