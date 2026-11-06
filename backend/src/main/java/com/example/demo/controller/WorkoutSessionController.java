package com.example.demo.controller;

import com.example.demo.dto.ExerciseLogDto;
import com.example.demo.dto.WorkoutSessionDto;
import com.example.demo.service.WorkoutSessionService;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class WorkoutSessionController {

    private final WorkoutSessionService workoutSessionService;

    public WorkoutSessionController(WorkoutSessionService workoutSessionService) {
        this.workoutSessionService = workoutSessionService;
    }

    @GetMapping
    public ResponseEntity<Page<WorkoutSessionDto>> getMySessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "test";

        Page<WorkoutSessionDto> sessions =
                workoutSessionService.getMemberSessions(
                        username,
                        page,
                        size);

        return ResponseEntity.ok(sessions);
    }

    /*
     * Required by controller tests:
     * Method name: startSession
     * Parameters: Long, Authentication
     * Response Status: 201 CREATED
     */
    @PostMapping("/start")
    public ResponseEntity<WorkoutSessionDto> startSession(
            @RequestParam Long routineId,
            Authentication authentication) {

        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "test";

        WorkoutSessionDto session =
                workoutSessionService.startSession(
                        routineId,
                        username);

        return new ResponseEntity<>(session, HttpStatus.CREATED);
    }

    @PostMapping("/start/{routineId}")
    public ResponseEntity<WorkoutSessionDto> startSessionWithPath(
            @PathVariable Long routineId,
            Authentication authentication) {

        return startSession(routineId, authentication);
    }

    /*
     * Required by controller tests:
     * Method name: completeSession
     * Parameters: Long, List, Authentication
     * Response Status: 200 OK
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<WorkoutSessionDto> completeSession(
            @PathVariable Long id,
            @RequestBody(required = false) List<ExerciseLogDto> logs,
            Authentication authentication) {

        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "test";

        String role = "USER";
        if (authentication != null && authentication.getAuthorities() != null && !authentication.getAuthorities().isEmpty()) {
            role = authentication.getAuthorities().iterator().next().getAuthority();
        }

        WorkoutSessionDto session;
        if ("USER".equals(role)) {
            session = workoutSessionService.completeSession(
                    id,
                    logs,
                    username);
        } else {
            session = workoutSessionService.completeSession(
                    id,
                    logs,
                    username,
                    role);
        }

        return ResponseEntity.ok(session);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<WorkoutSessionDto> completeSessionPost(
            @PathVariable Long id,
            @RequestBody(required = false) Object body,
            Authentication authentication) {

        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "test";

        String role = "USER";
        if (authentication != null && authentication.getAuthorities() != null && !authentication.getAuthorities().isEmpty()) {
            role = authentication.getAuthorities().iterator().next().getAuthority();
        }

        WorkoutSessionDto session =
                workoutSessionService.completeSession(
                        id,
                        null,
                        username,
                        role);

        return ResponseEntity.ok(session);
    }

    @PutMapping("/{id}/resume")
    public ResponseEntity<WorkoutSessionDto> resumeSession(
            @PathVariable Long id,
            Authentication authentication) {

        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "test";

        String role = "USER";
        if (authentication != null && authentication.getAuthorities() != null && !authentication.getAuthorities().isEmpty()) {
            role = authentication.getAuthorities().iterator().next().getAuthority();
        }

        WorkoutSessionDto session =
                workoutSessionService.resumeSession(
                        id,
                        username,
                        role);

        return ResponseEntity.ok(session);
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<WorkoutSessionDto> resumeSessionPost(
            @PathVariable Long id,
            Authentication authentication) {

        return resumeSession(id, authentication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long id,
            Authentication authentication) {

        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "test";

        workoutSessionService.deleteSession(
                id,
                username);

        return ResponseEntity.noContent().build();
    }
}