package com.spring.security;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import com.spring.util.JwtUtil;

@TestConfiguration
public class JwtTestConfig {
    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }
}
