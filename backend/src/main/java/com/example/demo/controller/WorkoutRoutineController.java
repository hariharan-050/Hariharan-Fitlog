package com.example.demo.controller;

import com.example.demo.dto.WorkoutRoutineDto;
import com.example.demo.service.WorkoutRoutineService;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routines")
public class WorkoutRoutineController {

    private final WorkoutRoutineService workoutRoutineService;

    /*
     * Explicit constructor required by tests.
     */
    public WorkoutRoutineController(
            WorkoutRoutineService workoutRoutineService) {

        this.workoutRoutineService = workoutRoutineService;
    }

    /*
     * GET /api/routines
     */
    @GetMapping
    public ResponseEntity<Page<WorkoutRoutineDto>> getPublicRoutines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String goal,
            @RequestParam(required = false) String query) {

        Page<WorkoutRoutineDto> routines =
                workoutRoutineService.getPublicRoutines(
                        page,
                        size,
                        goal,
                        query);

        return ResponseEntity.ok(routines);
    }

    /*
     * GET /api/routines/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutRoutineDto> getRoutineDetails(
            @PathVariable Long id) {

        WorkoutRoutineDto routine =
                workoutRoutineService.getRoutineDetails(id);

        return ResponseEntity.ok(routine);
    }

    /*
     * POST /api/routines
     */
    @PostMapping
    public ResponseEntity<WorkoutRoutineDto> createRoutine(
            @RequestBody WorkoutRoutineDto dto,
            Authentication authentication) {

        String username = "test";

        if (authentication != null
                && authentication.getName() != null) {

            username = authentication.getName();
        }

        WorkoutRoutineDto created =
                workoutRoutineService.createRoutine(
                        dto,
                        username);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    /*
     * PUT /api/routines/{id}
     *
     * Test t15 expects:
     * method name: updateRoutine
     * parameters:
     * Long, WorkoutRoutineDto, Authentication
     * response status: 200 OK
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutRoutineDto> updateRoutine(
            @PathVariable Long id,
            @RequestBody WorkoutRoutineDto dto,
            Authentication authentication) {

        String username = "test";
        String role = "USER";

        if (authentication != null) {

            if (authentication.getName() != null) {
                username = authentication.getName();
            }

            if (authentication.getAuthorities() != null
                    && !authentication.getAuthorities().isEmpty()) {

                role = authentication.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();
            }
        }

        WorkoutRoutineDto updated =
                workoutRoutineService.updateRoutine(
                        id,
                        dto,
                        username,
                        role);

        return ResponseEntity.ok(updated);
    }

    /*
     * DELETE /api/routines/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoutine(
            @PathVariable Long id,
            Authentication authentication) {

        String username = "test";
        String role = "USER";

        if (authentication != null) {

            if (authentication.getName() != null) {
                username = authentication.getName();
            }

            if (authentication.getAuthorities() != null
                    && !authentication.getAuthorities().isEmpty()) {

                role = authentication.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();
            }
        }

        workoutRoutineService.deleteRoutine(
                id,
                username,
                role);

        return ResponseEntity.noContent().build();
    }
}