package com.dripverse.backend.repository;

import com.dripverse.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String Username, String Email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
