package com.catalyst.linkpulse.controller;

import com.catalyst.linkpulse.config.JwtUtil;
import com.catalyst.linkpulse.dto.ApiResponse;
import com.catalyst.linkpulse.dto.AuthDtos.*;
import com.catalyst.linkpulse.model.User;
import com.catalyst.linkpulse.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://team-catalyst-linkpulse.vercel.app"})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@RequestBody SignupRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Password must be at least 6 characters"));
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("An account with this email already exists"));
        }

        User user = new User(
                request.getName() != null && !request.getName().trim().isEmpty() ? request.getName().trim() : "LinkPulse User",
                email,
                passwordEncoder.encode(request.getPassword())
        );

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail(), saved.getName());

        return ResponseEntity.ok(ApiResponse.success(
                new AuthResponse(token, saved.getId(), saved.getName(), saved.getEmail()),
                "User registered successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email and password are required"));
        }

        String email = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid email or password"));
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getName());

        return ResponseEntity.ok(ApiResponse.success(
                new AuthResponse(token, user.getId(), user.getName(), user.getEmail()),
                "Logged in successfully"
        ));
    }
}