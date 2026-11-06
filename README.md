# FitLog – Personal Fitness Tracking and Workout Management System

## Project Overview

FitLog is a full-stack web-based fitness tracking and workout management application designed to help users maintain fitness records, manage workout routines, track exercise performance, and monitor their fitness progress.

The application provides centralized fitness metric management, reusable workout plans, active workout sessions, and performance tracking with secure role-based access.

## Technologies Used

**Frontend**
- React 18
- Redux Toolkit
- Axios
- Lucide Icons
- Vanilla CSS

**Backend**
- Java 17
- Spring Boot 3.2.4
- Spring Data JPA
- Spring Security
- Maven

**Database**
- MySQL

**Authentication & Security**
- JWT (HS256)
- BCrypt Password Hashing
- Role-Based Access Control (RBAC)

## Key Features

- User Registration and Login
- Fitness Metric Management
- Workout Routine Creation and Management
- Workout Session Tracking
- Exercise Performance Logging
- Fitness Progress Dashboard
- Secure Authentication and Authorization
- Role-Based User Management

## User Roles

1. Fitness Member – Tracks personal fitness metrics and workout sessions.
2. Certified Trainer – Creates and manages workout routines.
3. Platform Coordinator – Manages users and system-wide resources.

## System Architecture

FitLog follows a client-server architecture.

- React provides the user interface.
- Redux Toolkit manages frontend application state.
- Axios communicates with backend REST APIs.
- Spring Boot handles business logic and REST services.
- Spring Data JPA manages database operations.
- MySQL stores application data.
- Spring Security and JWT provide secure access.

## Project Structure

- `frontend/` – React application
- `backend/` – Spring Boot application
- `package-lock.json` – Frontend dependency lock file

## Future Enhancements

- Mobile application support
- Advanced fitness analytics
- Wearable device integration
- Personalized workout recommendations

## Project Information

**Project Name:** FitLog – Personal Fitness Tracking and Workout Management System

**Project Type:** Full-Stack Web Application

**Developed by:** N. Hariharan and R. Dharanidharan

**Department:** Artificial Intelligence and Data Science

**Institution:** Sri Krishna College of Engineering and Technology
