package com.atharva.backend.controller;

import com.atharva.backend.api.response.WeatherResponse;
import com.atharva.backend.entity.JournalEntry;
import com.atharva.backend.entity.User;
import com.atharva.backend.repository.UserRepo;
import com.atharva.backend.repository.UserRepoImpl;
import com.atharva.backend.schedular.UserSchedular;
import com.atharva.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private JournalEntryService journalEntryService;

    @Autowired
    private UserRepoImpl userRepoImpl;

    @Autowired
    private UserSchedular userSchedular;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private CheckListService checkListService;

    @GetMapping("/getallusers")
    public List<User> getAllUsers() {
        return userService.getAll();
    }
    @GetMapping("{username}")
    public User getUserByUserName(@PathVariable String username) {
        return userService.findByUserName(username);
    }

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User userInDb = userService.findByUserName(userName);
        userInDb.setUserName(user.getUserName());
        userInDb.setPassword(user.getPassword());
        userService.saveNewUser(userInDb);
        return new ResponseEntity<>(HttpStatus.OK);

    }

//    @DeleteMapping
//    public ResponseEntity<?> deleteUserById() {
//        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
//        userRepo.deleteByUserName(authentication.getName());
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }

    @DeleteMapping
    public ResponseEntity<?> deleteUserById() {
        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        User user = userService.findByUserName(name);
        List<JournalEntry> userEntries = user.getJournalEntry();
        for(JournalEntry element : userEntries){
            journalEntryService.deleteById(element.getId(), name);
        }
        userRepo.deleteByUserName(authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/weather/{city}")
    public ResponseEntity<?> getWeatherDetails(@PathVariable String city) {
        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
        WeatherResponse weatherResponse = weatherService.getWeather(city);
        String greeting = "";
        if(weatherResponse != null){
            greeting = " Weather feels like for: "+city +" is "+ weatherResponse.getCurrent().getTemperature();
        }
        return new ResponseEntity<>("Hi " + authentication.getName() + greeting, HttpStatus.OK);
    }
    @GetMapping("/query/{userName}")
    public ResponseEntity<?> queryUser() {
        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();
        List<User> userForSA = userRepoImpl.getUserForSA();
        return new ResponseEntity<>(userForSA, HttpStatus.OK);
    }

    @GetMapping("/send-email")
    public void sendEmail(){
        userSchedular.fetchUserAndSendSAEmail();
//        redisTemplate.opsForValue().set("email","abc@gmail.com");
//        Object name = redisTemplate.opsForValue().get("Weather_of_Mumbai");
//        System.out.println(name.toString());
    }
}
