package com.atharva.backend.factory;

import com.atharva.backend.entity.User;
import org.springframework.http.ResponseEntity;

public interface UserAction {
    ResponseEntity<?> execute(User user);
}
