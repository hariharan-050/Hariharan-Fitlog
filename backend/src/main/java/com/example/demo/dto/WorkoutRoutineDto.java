package com.example.demo.dto;

public class WorkoutRoutineDto {

    private Long id;
    private String title;
    private String description;
    private String goal;
    private String difficulty;
    private Integer durationMinutes;
    private Boolean isPublic;

    public WorkoutRoutineDto() {
    }

    public WorkoutRoutineDto(Long id, String title, String description,
                             String goal, String difficulty,
                             Integer durationMinutes, Boolean isPublic) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.goal = goal;
        this.difficulty = difficulty;
        this.durationMinutes = durationMinutes;
        this.isPublic = isPublic;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
}