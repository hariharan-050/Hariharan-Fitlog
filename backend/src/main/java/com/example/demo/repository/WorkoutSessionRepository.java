package com.example.demo.repository;

import com.example.demo.entity.SystemAccount;
import com.example.demo.entity.WorkoutSession;
import com.example.demo.entity.WorkoutSession.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {

    boolean existsByUserIdAndSessionStatus(
            Long userId,
            SessionStatus sessionStatus
    );

    Page<WorkoutSession> findByUser(
            SystemAccount user,
            Pageable pageable
    );

    Page<WorkoutSession> findByUser_Username(
            String username,
            Pageable pageable
    );
}