package com.example.demo.controller;

import com.example.demo.dto.FitnessMetricDto;
import com.example.demo.service.FitnessMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class FitnessMetricController {

    private final FitnessMetricService fitnessMetricService;

    /**
     * GET /api/metrics
     * Get logged-in user's fitness metrics
     */
    @GetMapping
    public ResponseEntity<Page<FitnessMetricDto>> getMyMetrics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Page<FitnessMetricDto> metrics =
                fitnessMetricService.getMemberMetrics(
                        authentication.getName(),
                        page,
                        size);

        return ResponseEntity.ok(metrics);
    }

    /**
     * POST /api/metrics
     * Record a new fitness metric
     */
    @PostMapping
    public ResponseEntity<FitnessMetricDto> recordMetric(
            @RequestBody FitnessMetricDto dto,
            Authentication authentication) {

        FitnessMetricDto metric =
                fitnessMetricService.recordMetric(
                        dto,
                        authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(metric);
    }

    /**
     * DELETE /api/metrics/{id}
     * Delete a fitness metric
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetric(
            @PathVariable Long id,
            Authentication authentication) {

        fitnessMetricService.deleteMetric(
                id,
                authentication.getName());

        return ResponseEntity.noContent().build();
    }
}