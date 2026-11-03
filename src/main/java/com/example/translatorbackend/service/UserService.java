package com.example.translatorbackend.service;

import com.example.translatorbackend.module.User;
import com.example.translatorbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional; // Idhu miss aagirundhuchu

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // Login function
    public User loginUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        // Optional-kulla data irukka nu check panni, adha eduthu password compare pandrom
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user; // Match aana user-ah anuppurom
            }
        }
        return null; // Password thappu na illa user illana null varum
    }
}