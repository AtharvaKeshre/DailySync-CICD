package com.atharva.backend.factory;

import com.atharva.backend.entity.User;
import com.atharva.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class UpgradeToAdminAction implements UserAction {

    @Autowired
    private UserService userService;

    @Override
    public ResponseEntity<?> execute(User user) {
        userService.saveExistingUserToAdmin(user.getUserName());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
