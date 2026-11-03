package com.example.translatorbackend.controller;

// Unga folder structure padi User and JwtUtil imports
import com.example.translatorbackend.module.User;
import com.example.translatorbackend.config.JwtUtil; // Oruvela config folder-la irundha .config.JwtUtil nu mathikonga
import com.example.translatorbackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. SIGNUP API
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Email already database-la irukka nu check pandrom
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        // Password-ah hash (encrypt) panni save pandrom
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // 2. LOGIN API
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        // Email-ah vachi user-ah thedurom
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Database password-um frontend password-um match aagutha nu check pandrom
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                // Match aana JWT token generate panni anupurom
                String token = jwtUtil.generateToken(user.getEmail());
                return ResponseEntity.ok(Map.of("token", token));
            }
        }

        // Match aagalana error anupurom
        return ResponseEntity.status(401).body("Invalid Email or Password");
    }
}