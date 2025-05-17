package com.atharva.backend.controller;


import com.atharva.backend.cache.AppCache;
import com.atharva.backend.entity.User;
import com.atharva.backend.factory.UserAction;
import com.atharva.backend.factory.UserActionFactory;
import com.atharva.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AppCache appCache;

    @Autowired
    private UserActionFactory userActionFactory;

    @GetMapping("all-users")
    public ResponseEntity<?> getAllUsers() {
        List<User> all = userService.getAll();
        if (all != null && !all.isEmpty()) {
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/user-action/{actionType}")
    public ResponseEntity<?> performUserAction(@PathVariable String actionType, @RequestBody User user) {
        UserAction action = userActionFactory.getAction(actionType);
        return action.execute(user);
    }

    @GetMapping("clear-app-cache")
    public void clearAppCache() {
        appCache.init();
    }
}
