package com.example.demo.repository;

import com.example.demo.entity.WorkoutRoutine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WorkoutRoutineRepository extends JpaRepository<WorkoutRoutine, Long> {


    Page<WorkoutRoutine> findByIsPublicTrue(Pageable pageable);


    @Query("""
           SELECT w FROM WorkoutRoutine w
           WHERE w.isPublic = true
           AND (
                LOWER(w.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(w.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
           )
           """)
    Page<WorkoutRoutine> searchPublicRoutines(
            @Param("keyword") String keyword,
            Pageable pageable
    );

}