package com.catalyst.linkpulse.dto;

public class AuthDtos {

    public static class SignupRequest {
        private String name;
        private String email;
        private String password;

        public SignupRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private String userId;
        private String name;
        private String email;

        public AuthResponse(String token, String userId, String name, String email) {
            this.token = token;
            this.userId = userId;
            this.name = name;
            this.email = email;
        }

        public String getToken() { return token; }
        public String getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
    }
}