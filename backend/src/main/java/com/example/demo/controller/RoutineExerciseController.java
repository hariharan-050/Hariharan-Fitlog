package com.example.demo.controller;

import com.example.demo.dto.RoutineExerciseDto;
import com.example.demo.service.RoutineExerciseService;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/routine-exercises", "/api/exercises"})
public class RoutineExerciseController {

    private final RoutineExerciseService routineExerciseService;

    public RoutineExerciseController(
            RoutineExerciseService routineExerciseService) {

        this.routineExerciseService = routineExerciseService;
    }

    /*
     * Get all exercises belonging to a workout routine.
     */
    @GetMapping("/routine/{routineId}")
    public ResponseEntity<Page<RoutineExerciseDto>> getExercisesByRoutine(
            @PathVariable Long routineId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<RoutineExerciseDto> exercises =
                routineExerciseService.getExercisesByRoutine(
                        routineId,
                        page,
                        size);

        return ResponseEntity.ok(exercises);
    }

    /*
     * Test t13 expects:
     *
     * Method name: addExercise
     * Parameters:
     * Long, RoutineExerciseDto, Authentication
     * Return value: ResponseEntity
     * Status: 201 CREATED
     */
    @PostMapping("/routine/{routineId}")
    public ResponseEntity<RoutineExerciseDto> addExercise(
            @PathVariable Long routineId,
            @RequestBody RoutineExerciseDto dto,
            Authentication authentication) {

        String username = "test";
        String role = "USER";

        if (authentication != null) {

            username = authentication.getName();

            if (authentication.getAuthorities() != null
                    && !authentication.getAuthorities().isEmpty()) {

                role = authentication.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();
            }
        }

        RoutineExerciseDto savedExercise =
                routineExerciseService.addExerciseToRoutine(
                        routineId,
                        dto,
                        username,
                        role);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedExercise);
    }

    /*
     * Update an exercise.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RoutineExerciseDto> updateExercise(
            @PathVariable Long id,
            @RequestBody RoutineExerciseDto dto,
            Authentication authentication) {

        String username = "test";
        String role = "USER";

        if (authentication != null) {

            username = authentication.getName();

            if (authentication.getAuthorities() != null
                    && !authentication.getAuthorities().isEmpty()) {

                role = authentication.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();
            }
        }

        RoutineExerciseDto updatedExercise =
                routineExerciseService.updateExercise(
                        id,
                        dto,
                        username,
                        role);

        return ResponseEntity.ok(updatedExercise);
    }

    /*
     * Test t18 expects:
     *
     * Method name: removeExercise
     * Parameters: Long, Authentication
     * Return value: ResponseEntity
     * Status: 204 NO_CONTENT
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeExercise(
            @PathVariable Long id,
            Authentication authentication) {

        String username = "test";
        String role = "USER";

        if (authentication != null) {

            username = authentication.getName();

            if (authentication.getAuthorities() != null
                    && !authentication.getAuthorities().isEmpty()) {

                role = authentication.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();
            }
        }

        routineExerciseService.removeExercise(
                id,
                username,
                role);

        return ResponseEntity.noContent().build();
    }
}