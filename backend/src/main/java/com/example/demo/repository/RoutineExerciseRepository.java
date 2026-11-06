package com.example.demo.repository;

import com.example.demo.entity.RoutineExercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineExerciseRepository 
        extends JpaRepository<RoutineExercise, Long> {


    Page<RoutineExercise> findByRoutineId(
            Long routineId,
            Pageable pageable
    );

}