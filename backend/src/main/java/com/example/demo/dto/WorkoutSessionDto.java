package com.example.demo.dto;

public class WorkoutSessionDto {

    private Long id;
    private Long routineId;
    private String routineTitle;
    private String startTime;
    private String endTime;
    private String sessionStatus;
    private Integer caloriesBurned;

    public WorkoutSessionDto() {
    }

    public WorkoutSessionDto(Long id, Long routineId,
                             String startTime,
                             String endTime,
                             String sessionStatus,
                             Integer caloriesBurned) {
        this.id = id;
        this.routineId = routineId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.sessionStatus = sessionStatus;
        this.caloriesBurned = caloriesBurned;
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

    public String getRoutineTitle() {
        return routineTitle;
    }

    public void setRoutineTitle(String routineTitle) {
        this.routineTitle = routineTitle;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getSessionStatus() {
        return sessionStatus;
    }

    public void setSessionStatus(String sessionStatus) {
        this.sessionStatus = sessionStatus;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }
}