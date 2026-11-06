package com.example.demo.dto;

public class RoutineExerciseDto {

    private Long id;
    private Long routineId;
    private String exerciseName;
    private Integer sets;
    private Integer reps;
    private Integer durationSeconds;
    private Double weight;

    public RoutineExerciseDto() {
    }

    public RoutineExerciseDto(Long id, Long routineId, String exerciseName,
                              Integer sets, Integer reps,
                              Integer durationSeconds, Double weight) {
        this.id = id;
        this.routineId = routineId;
        this.exerciseName = exerciseName;
        this.sets = sets;
        this.reps = reps;
        this.durationSeconds = durationSeconds;
        this.weight = weight;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoutineId() {
        return routineId;
    }

    public void setRoutineId(Long routineId) {
        this.routineId = routineId;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }
}