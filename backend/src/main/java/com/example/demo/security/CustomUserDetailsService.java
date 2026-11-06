package com.example.demo.security;

import com.example.demo.entity.SystemAccount;
import com.example.demo.repository.SystemAccountRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final SystemAccountRepository systemAccountRepository;

    public CustomUserDetailsService(
            SystemAccountRepository systemAccountRepository) {

        this.systemAccountRepository =
                systemAccountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String username)
            throws UsernameNotFoundException {

        SystemAccount account =
                systemAccountRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found: " + username));

        String role = account.getRole();

        if (role == null || role.isBlank()) {
            role = "ROLE_USER";
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new User(
                account.getUsername(),
                account.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority(role)));
    }
}