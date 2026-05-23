package com.dripverse.backend.controller;

import com.dripverse.backend.model.User;
import com.dripverse.backend.repository.UserRepository;
import com.dripverse.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> payload, Authentication authentication) {
        String currentUsername = authentication.getName();

        return userRepository.findByUsername(currentUsername)
                .map(user -> {
                    Object usernameObj = payload.get("username");
                    if (usernameObj == null) {
                        usernameObj = payload.get("userName");
                    }
                    String newUsername = usernameObj != null ? usernameObj.toString().trim() : null;
                    System.out.println("DEBUG: newUsername from Map=" + newUsername);

                    if (newUsername != null && !newUsername.isEmpty()) {
                        if (!newUsername.equalsIgnoreCase(currentUsername)) {
                            if (userRepository.existsByUsername(newUsername)) {
                                return ResponseEntity.badRequest().body("username already exists");
                            }
                            user.setUsername(newUsername);
                        }
                    }

                    if (payload.containsKey("firstName")) {
                        user.setFirstName(payload.get("firstName") != null ? payload.get("firstName").toString() : null);
                    }
                    if (payload.containsKey("lastName")) {
                        user.setLastName(payload.get("lastName") != null ? payload.get("lastName").toString() : null);
                    }
                    if (payload.containsKey("phone")) {
                        user.setPhone(payload.get("phone") != null ? payload.get("phone").toString() : null);
                    }
                    if (payload.containsKey("address")) {
                        user.setAddress(payload.get("address") != null ? payload.get("address").toString() : null);
                    }

                    User savedUser = userRepository.save(user);


                    String newToken = null;
                    if (!savedUser.getUsername().equalsIgnoreCase(currentUsername)) {
                        newToken = tokenProvider.generateTokenFromUsername(savedUser.getUsername());
                    }

                    Map<String, Object> response = new HashMap<>();
                    response.put("user", savedUser);
                    if (newToken !=null) {
                        response.put("token", newToken);
                    }
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
