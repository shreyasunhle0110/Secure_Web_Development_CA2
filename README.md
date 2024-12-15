# E-Commerce Application Security Enhancement

This project demonstrates the modernization and security enhancement of a legacy e-commerce web application. The original codebase, developed using Angular and Spring Boot, has been upgraded and fortified with modern security features.

## Project Overview

- **Original Repository**: [Angular-Springboot](https://github.com/cyela/Angular-Springboot)
- **Backend Repository**: [Springboot-Web-Services](https://github.com/cyela/Springboot-Web-Services)
- **Video Demo**: [YouTube Demo](https://youtu.be/aO_3bSZH_c4)

## Key Enhancements

### Technical Modernization
- Upgraded Angular to the latest stable version
- Implemented JWT (JSON Web Tokens) for modern authentication
- Added CSRF protection against cross-site request forgery attacks
- Developed a login attempt limiter to prevent brute force attacks

### Security Improvements
- Enhanced error handling to prevent unauthorized access and information leaks
- Integrated detailed application-level logging for security audit trails
- Implemented input validation and sanitization
- Secure session management using JWT

## Technology Stack

### Backend
- Spring Boot
- Java 8
- MySQL
- ActiveMQ

### Frontend
- Angular (upgraded from 6 to 18)
- TypeScript
- Node.js

## Security Features

1. **Login Security**
   - Login attempt limiter
   - Account lockout after 5 failed attempts

2. **JWT Authentication**
   - Secure token-based authentication
   - Refresh token mechanism

3. **CSRF Protection**
   - Synchronizer token pattern
   - Unique CSRF tokens per session

4. **Input Validation**
   - Server-side and client-side validation
   - HTML content sanitization

5. **Error Handling and Logging**
   - Secure error management system
   - Comprehensive logging using SLF4J

## Installation and Setup

1. **Prerequisites**
   - Java 8 JDK
   - Node.js and npm
   - MySQL Server
   - RabbitMQ Server
   - IDE (e.g., IntelliJ IDEA, Visual Studio Code)

2. **Database and Message Queue Setup**
   - Start MySQL Server
   - Start RabbitMQ Server

3. **Backend Setup**
   - Clone the backend repository
   - Open the project in your IDE
   - Run `mvn install` to install dependencies
   - Configure `application.properties` with your database credentials
   - Run the Spring Boot application using `mvn spring-boot:run`

4. **Frontend Setup**
   - Clone the frontend repository
   - Open the project in your IDE
   - Run `npm install` to install dependencies
   - Start the Angular development server with `ng serve`

5. **Accessing the Application**
   - Open a web browser and navigate to `http://localhost:4200`

## Testing

- Functional testing for login attempt limiter, JWT authentication, and CSRF protection
- Static Application Security Testing (SAST) using SonarQube

## Contributing

Contributions to enhance the security features or improve the codebase are welcome. Please follow the standard pull request process.
