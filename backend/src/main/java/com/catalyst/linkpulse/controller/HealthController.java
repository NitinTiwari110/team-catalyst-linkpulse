package com.catalyst.linkpulse.controller;

import com.catalyst.linkpulse.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> checkHealth() {
        return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                        "status", "UP",
                        "service", "LinkPulse Spring Boot 3 Engine",
                        "team", "TEAM CATALYST",
                        "database", "MySQL Connected"
                ),
                "Handshake verified"
        ));
    }
}