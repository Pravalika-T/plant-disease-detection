package com.plantdisease.service;

import com.plantdisease.dto.AuthResponse;
import com.plantdisease.dto.LoginRequest;
import com.plantdisease.dto.RegisterRequest;
import com.plantdisease.entity.User;
import com.plantdisease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("An account with this email address already exists.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(request.getPassword()) // Plain text/basic hash for simple college project demo
                .role("ROLE_FARMER")
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .message("Registration successful! Welcome to Plant Disease Detection.")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid email address or password."));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email address or password.");
        }

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .message("Login successful! Welcome back, " + user.getName())
                .build();
    }
}
