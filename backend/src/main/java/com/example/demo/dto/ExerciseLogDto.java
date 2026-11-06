package com.example.demo.dto;

public class ExerciseLogDto {

    private Long id;
    private Long sessionId;
    private Long exerciseId;
    private Integer completedSets;
    private Integer completedReps;
    private Double weightUsed;
    private Integer durationSeconds;
    private String notes;

    public ExerciseLogDto() {
    }

    public ExerciseLogDto(Long id, Long sessionId, Long exerciseId,
                          Integer completedSets, Integer completedReps,
                          Double weightUsed, Integer durationSeconds,
                          String notes) {
        this.id = id;
        this.sessionId = sessionId;
        this.exerciseId = exerciseId;
        this.completedSets = completedSets;
        this.completedReps = completedReps;
        this.weightUsed = weightUsed;
        this.durationSeconds = durationSeconds;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public Integer getCompletedSets() {
        return completedSets;
    }

    public void setCompletedSets(Integer completedSets) {
        this.completedSets = completedSets;
    }

    public Integer getCompletedReps() {
        return completedReps;
    }

    public void setCompletedReps(Integer completedReps) {
        this.completedReps = completedReps;
    }

    public Double getWeightUsed() {
        return weightUsed;
    }

    public void setWeightUsed(Double weightUsed) {
        this.weightUsed = weightUsed;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}