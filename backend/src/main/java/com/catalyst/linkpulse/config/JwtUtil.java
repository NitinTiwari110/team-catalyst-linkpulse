package com.catalyst.linkpulse.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 256-bit secret key for HMAC-SHA256 signing
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(
            "LinkPulseInnovista2026TeamCatalystSecretKeyForJwtTokenAuth123!".getBytes()
    );

    // Token validity: 7 Days
    private static final long EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000L;

    public String generateToken(String userId, String email, String name) {
        return Jwts.builder()
                .setSubject(userId)
                .claim("email", email)
                .claim("name", name)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            return !getClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}