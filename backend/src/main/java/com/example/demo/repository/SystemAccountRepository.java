package com.example.demo.repository;

import com.example.demo.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SystemAccountRepository extends JpaRepository<SystemAccount, Long> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<SystemAccount> findByUsername(String username);

}