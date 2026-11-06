package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.List;


@Entity
@Table(name = "workout_routine")
public class WorkoutRoutine {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank
    private String title;


    private String description;


    private String difficultyLevel;


    private String targetGoal;


    private boolean isPublic;


    @ManyToOne
    @JoinColumn(name = "author_id")
    private SystemAccount author;


    @OneToMany(mappedBy = "routine", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoutineExercise> exercises;



    public WorkoutRoutine() {
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


    public String getDifficultyLevel() {
        return difficultyLevel;
    }


    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }


    public String getTargetGoal() {
        return targetGoal;
    }


    public void setTargetGoal(String targetGoal) {
        this.targetGoal = targetGoal;
    }


    public boolean isPublic() {
        return isPublic;
    }


    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }


    public SystemAccount getAuthor() {
        return author;
    }


    public void setAuthor(SystemAccount author) {
        this.author = author;
    }


    public List<RoutineExercise> getExercises() {
        return exercises;
    }


    public void setExercises(List<RoutineExercise> exercises) {
        this.exercises = exercises;
    }
}