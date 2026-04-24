package com.dripverse.backend.config;

import com.dripverse.backend.model.Role;
import com.dripverse.backend.model.User;
import com.dripverse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminIfNotFound("admin", "admin@gmail.com", "admin123");
    }

    private void createAdminIfNotFound(String username, String email, String password) {
        if (!userRepository.existsByUsername(username) && !userRepository.existsByEmail(email)) {
            User admin = new User(username, email, password);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            System.out.println("Successfully seeded admin account: " + username);
        }
    }

}
