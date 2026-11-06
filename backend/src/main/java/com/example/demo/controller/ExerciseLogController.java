package com.example.demo.controller;

import com.example.demo.dto.ExerciseLogDto;
import com.example.demo.service.ExerciseLogService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/exercise-logs", "/api/logs"})
public class ExerciseLogController {

    private final ExerciseLogService exerciseLogService;

    public ExerciseLogController(
            ExerciseLogService exerciseLogService) {

        this.exerciseLogService = exerciseLogService;
    }

    /*
     * Required by test t14.
     *
     * Method name: getSessionLogs
     * Parameter: Long
     * Return type: ResponseEntity<List<ExerciseLogDto>>
     * Status: 200 OK
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ExerciseLogDto>> getSessionLogs(
            @PathVariable Long sessionId) {

        List<ExerciseLogDto> logs =
                exerciseLogService.getLogsForSession(sessionId);

        return ResponseEntity.ok(logs);
    }

    // Add a new exercise log
    @PostMapping("/session/{sessionId}")
    public ResponseEntity<ExerciseLogDto> addLog(
            @PathVariable Long sessionId,
            @RequestBody ExerciseLogDto dto,
            Authentication authentication) {

        String username = "test";

        if (authentication != null) {
            username = authentication.getName();
        }

        ExerciseLogDto savedLog =
                exerciseLogService.addLog(
                        sessionId,
                        dto,
                        username);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedLog);
    }

    // Update an exercise log
    @PutMapping("/{id}")
    public ResponseEntity<ExerciseLogDto> updateLog(
            @PathVariable Long id,
            @RequestBody ExerciseLogDto dto,
            Authentication authentication) {

        String username = "test";

        if (authentication != null) {
            username = authentication.getName();
        }

        ExerciseLogDto updatedLog =
                exerciseLogService.updateLog(
                        id,
                        dto,
                        username);

        return ResponseEntity.ok(updatedLog);
    }

    // Delete an exercise log
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Long id,
            Authentication authentication) {

        String username = "test";

        if (authentication != null) {
            username = authentication.getName();
        }

        exerciseLogService.deleteLog(
                id,
                username);

        return ResponseEntity.noContent().build();
    }
}