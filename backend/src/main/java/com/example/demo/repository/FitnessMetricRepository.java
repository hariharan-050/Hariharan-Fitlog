package com.example.demo.repository;

import com.example.demo.entity.FitnessMetric;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FitnessMetricRepository extends JpaRepository<FitnessMetric, Long> {

    Page<FitnessMetric> findByUserIdOrderByRecordedDateDesc(Long userId, Pageable pageable);

}