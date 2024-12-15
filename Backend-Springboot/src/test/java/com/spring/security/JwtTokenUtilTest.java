package com.spring.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetails;

import com.spring.model.User;
import com.spring.util.JwtUtil;

@SpringBootTest
@Import(JwtTestConfig.class)
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    private UserDetails userDetails;
    private String token;

    @BeforeEach
    void setUp() {
        userDetails = (UserDetails) new User("shreyas", "Shreyas@123", new ArrayList<>());
    }

    @Test
    void testGenerateToken() {
        token = jwtUtil.generateToken(userDetails);
        assertNotNull(token, "Token should not be null");
        assertTrue(token.length() > 0, "Token should not be empty");
    }

    @Test
    void testExtractUsername() {
        token = jwtUtil.generateToken(userDetails);
        String username = jwtUtil.extractUsername(token);
        assertEquals("shreyas", username, "Username should match the one used to generate token");
    }

    @Test
    void testValidateToken() {
        token = jwtUtil.generateToken(userDetails);
        assertTrue(jwtUtil.checkToken(token, userDetails),
                "Token should be valid for the user who generated it");
    }

    @Test
    void testTokenNotExpired() {
        token = jwtUtil.generateToken(userDetails);
        assertFalse(jwtUtil.isTokenExpired(token),
                "Newly generated token should not be expired");
    }

    @Test
    void testInvalidUsername() {
        token = jwtUtil.generateToken(userDetails);
        UserDetails wrongUser = (UserDetails) new User("wronguser", "Shreyas@123", new ArrayList<>());
        assertFalse(jwtUtil.checkToken(token, wrongUser),
                "Token should be invalid for wrong username");
    }

    @Test
    void testExtractExpiration() {
        token = jwtUtil.generateToken(userDetails);
        Date expirationDate = jwtUtil.extractExpiration(token);
        assertTrue(expirationDate.after(new Date()),
                "Expiration date should be in the future");
    }

    @Test
    void testInvalidToken() {
        String invalidToken = "invalid.token.string";
        assertThrows(Exception.class, () -> {
            jwtUtil.extractUsername(invalidToken);
        }, "Should throw exception for invalid token format");
    }
}
