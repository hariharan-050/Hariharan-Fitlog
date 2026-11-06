package com.example.demo.service;

import com.example.demo.dto.RoutineExerciseDto;
import com.example.demo.entity.RoutineExercise;
import com.example.demo.entity.WorkoutRoutine;
import com.example.demo.repository.RoutineExerciseRepository;
import com.example.demo.repository.WorkoutRoutineRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class RoutineExerciseService {

    private final RoutineExerciseRepository routineExerciseRepository;
    private final WorkoutRoutineRepository workoutRoutineRepository;

    public RoutineExerciseService(
            RoutineExerciseRepository routineExerciseRepository,
            WorkoutRoutineRepository workoutRoutineRepository) {

        this.routineExerciseRepository = routineExerciseRepository;
        this.workoutRoutineRepository = workoutRoutineRepository;
    }

    /*
     * Test t13 expects this exact method:
     *
     * addExerciseToRoutine(
     *      Long,
     *      RoutineExerciseDto,
     *      String,
     *      String
     * )
     *
     * It must return RoutineExerciseDto.
     */
    public RoutineExerciseDto addExerciseToRoutine(
            Long routineId,
            RoutineExerciseDto dto,
            String username,
            String role) {

        WorkoutRoutine routine = workoutRoutineRepository
                .findById(routineId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Workout routine not found with id: "
                                        + routineId));

        RoutineExercise exercise = new RoutineExercise();

        exercise.setRoutine(routine);
        exercise.setExerciseName(dto.getExerciseName());

        if (dto.getSets() != null) {
            exercise.setTargetSets(dto.getSets());
        }

        if (dto.getReps() != null) {
            exercise.setTargetReps(dto.getReps());
        }

        if (dto.getWeight() != null) {
            exercise.setTargetWeightKg(dto.getWeight());
        }

        if (dto.getDurationSeconds() != null) {
            exercise.setRestDurationSeconds(
                    dto.getDurationSeconds());
        }

        RoutineExercise savedExercise =
                routineExerciseRepository.save(exercise);

        return convertToDto(savedExercise);
    }

    /*
     * Optional method.
     * You can keep this if another controller or test uses addExercise().
     */
    public RoutineExerciseDto addExercise(
            Long routineId,
            RoutineExerciseDto dto,
            String username,
            String role) {

        return addExerciseToRoutine(
                routineId,
                dto,
                username,
                role);
    }

    /*
     * Get exercises belonging to a routine.
     */
    public Page<RoutineExerciseDto> getExercisesByRoutine(
            Long routineId,
            int page,
            int size) {

        if (!workoutRoutineRepository.existsById(routineId)) {
            throw new RuntimeException(
                    "Workout routine not found with id: "
                            + routineId);
        }

        return routineExerciseRepository
                .findByRoutineId(
                        routineId,
                        PageRequest.of(page, size))
                .map(this::convertToDto);
    }

    /*
     * Update an existing exercise.
     */
    public RoutineExerciseDto updateExercise(
            Long id,
            RoutineExerciseDto dto,
            String username,
            String role) {

        RoutineExercise existingExercise =
                routineExerciseRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Routine exercise not found with id: "
                                                + id));

        if (dto.getExerciseName() != null) {
            existingExercise.setExerciseName(
                    dto.getExerciseName());
        }

        if (dto.getSets() != null) {
            existingExercise.setTargetSets(
                    dto.getSets());
        }

        if (dto.getReps() != null) {
            existingExercise.setTargetReps(
                    dto.getReps());
        }

        if (dto.getWeight() != null) {
            existingExercise.setTargetWeightKg(
                    dto.getWeight());
        }

        if (dto.getDurationSeconds() != null) {
            existingExercise.setRestDurationSeconds(
                    dto.getDurationSeconds());
        }

        /*
         * Change the workout routine only when routineId
         * is provided in the request.
         */
        if (dto.getRoutineId() != null) {

            WorkoutRoutine routine =
                    workoutRoutineRepository
                            .findById(dto.getRoutineId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Workout routine not found with id: "
                                                    + dto.getRoutineId()));

            existingExercise.setRoutine(routine);
        }

        RoutineExercise updatedExercise =
                routineExerciseRepository
                        .save(existingExercise);

        return convertToDto(updatedExercise);
    }

    /*
     * Delete an exercise.
     */
    public void removeExercise(
            Long id,
            String username,
            String role) {

        RoutineExercise exercise =
                routineExerciseRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Routine exercise not found with id: "
                                                + id));

        routineExerciseRepository.delete(exercise);
    }

    /*
     * Convert entity into DTO.
     */
    private RoutineExerciseDto convertToDto(
            RoutineExercise exercise) {

        RoutineExerciseDto dto =
                new RoutineExerciseDto();

        dto.setId(exercise.getId());

        if (exercise.getRoutine() != null) {
            dto.setRoutineId(
                    exercise.getRoutine().getId());
        }

        dto.setExerciseName(
                exercise.getExerciseName());

        dto.setSets(
                exercise.getTargetSets());

        dto.setReps(
                exercise.getTargetReps());

        dto.setWeight(
                exercise.getTargetWeightKg());

        dto.setDurationSeconds(
                exercise.getRestDurationSeconds());

        return dto;
    }
}