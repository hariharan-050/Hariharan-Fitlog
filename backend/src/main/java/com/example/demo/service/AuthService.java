package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemAccount;
import com.example.demo.repository.SystemAccountRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final SystemAccountRepository systemAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(SystemAccountRepository systemAccountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.systemAccountRepository = systemAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponseDto register(RegisterDto dto) {

        if (systemAccountRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (systemAccountRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        SystemAccount account = new SystemAccount();
        account.setUsername(dto.getUsername());
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setRole("ROLE_MEMBER");

        systemAccountRepository.save(account);

        String token = jwtUtil.generateToken(
                account.getUsername(),
                account.getRole());

        return new AuthResponseDto(
                account.getUsername(),
                account.getRole(),
                token
        );
    }

    public AuthResponseDto login(AuthRequestDto dto) {

        SystemAccount account = systemAccountRepository
                .findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(dto.getPassword(), account.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(
                account.getUsername(),
                account.getRole());

        return new AuthResponseDto(
                account.getUsername(),
                account.getRole(),
                token
        );
    }
}