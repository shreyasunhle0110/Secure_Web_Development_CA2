package com.spring.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.constants.ResponseCode;
import com.spring.constants.WebConstants;
import com.spring.exception.UserCustomException;
import com.spring.model.User;
import com.spring.repository.UserRepository;
import com.spring.response.ServerResponse;
import com.spring.service.MyUserDetailService;
import com.spring.util.JwtUtil;
import com.spring.util.Validator;

@CrossOrigin(origins = WebConstants.ALLOWED_URL)
@RestController
@RequestMapping("/home")
public class HomeController {

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @Autowired
    @Lazy // Use lazy initialization to avoid circular dependency issues
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailService userDetailService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/auth")
    public ResponseEntity<ServerResponse> createAuthToken(@RequestBody HashMap<String, String> credential) {
        logger.info("Attempting authentication for user: {}", credential.get(WebConstants.USER_EMAIL));

        final String email = credential.get(WebConstants.USER_EMAIL);
        final String password = credential.get(WebConstants.USER_PASSWORD);

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (BadCredentialsException e) {
            logger.error("Authentication failed for user: {}", email);
            throw new UserCustomException("Invalid User Credentials");
        }

        final UserDetails userDetails = userDetailService.loadUserByUsername(email);
        final String jwt = jwtUtil.generateToken(userDetails);

        ServerResponse resp = new ServerResponse();
        resp.setStatus(ResponseCode.SUCCESS_CODE);
        resp.setMessage(ResponseCode.SUCCESS_MESSAGE);
        resp.setAuthToken(jwt);

        if (userDetails != null && userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            resp.setUserType("ADMIN");
            logger.info("Admin user authenticated: {}", email);
        } else {
            resp.setUserType("CUSTOMER");
            logger.info("Customer user authenticated: {}", email);
        }

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<ServerResponse> addUser(@RequestBody User user) {
        logger.info("Attempting to register new user: {}", user.getEmail());

        ServerResponse resp = new ServerResponse();
        try {
            if (Validator.isUserEmpty(user)) {
                logger.warn("Empty user data received for registration");
                resp.setStatus(ResponseCode.BAD_REQUEST_CODE);
                resp.setMessage(ResponseCode.BAD_REQUEST_MESSAGE);
            } else if (!Validator.isValidEmail(user.getEmail())) {
                logger.warn("Invalid email format for user registration: {}", user.getEmail());
                resp.setStatus(ResponseCode.BAD_REQUEST_CODE);
                resp.setMessage(ResponseCode.INVALID_EMAIL_FAIL_MSG);
            } else {
                userRepo.save(user);
                resp.setStatus(ResponseCode.SUCCESS_CODE);
                resp.setMessage(ResponseCode.CUST_REG);
                logger.info("User successfully registered: {}", user.getEmail());
            }
        } catch (Exception e) {
            logger.error("Error occurred while registering user: {}", user.getEmail(), e);
            throw new UserCustomException("An error occurred while saving user, please check details or try again");
        }
        return new ResponseEntity<>(resp, HttpStatus.ACCEPTED);
    }

    @GetMapping(value = "/logout")
    public void logoutPage(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            logger.info("User logged out: {}", auth.getName());
        } else {
            logger.warn("Logout attempt with no active authentication");
        }
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken token) {
        return token; // Expose the CSRF token to the client
    }
}
