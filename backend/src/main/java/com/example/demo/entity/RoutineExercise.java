package com.example.demo.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "routine_exercises")
public class RoutineExercise {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String exerciseName;



    private int targetSets;



    private int targetReps;



    private double targetWeightKg;



    private int restDurationSeconds;



    @ManyToOne
    @JoinColumn(name = "routine_id")
    private WorkoutRoutine routine;



    public RoutineExercise() {
    }



    public RoutineExercise(Long id,
                           String exerciseName,
                           int targetSets,
                           int targetReps,
                           double targetWeightKg,
                           int restDurationSeconds,
                           WorkoutRoutine routine) {

        this.id = id;
        this.exerciseName = exerciseName;
        this.targetSets = targetSets;
        this.targetReps = targetReps;
        this.targetWeightKg = targetWeightKg;
        this.restDurationSeconds = restDurationSeconds;
        this.routine = routine;
    }



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }



    public String getExerciseName() {
        return exerciseName;
    }


    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }



    public int getTargetSets() {
        return targetSets;
    }


    public void setTargetSets(int targetSets) {
        this.targetSets = targetSets;
    }



    public int getTargetReps() {
        return targetReps;
    }


    public void setTargetReps(int targetReps) {
        this.targetReps = targetReps;
    }



    public double getTargetWeightKg() {
        return targetWeightKg;
    }


    public void setTargetWeightKg(double targetWeightKg) {
        this.targetWeightKg = targetWeightKg;
    }



    public int getRestDurationSeconds() {
        return restDurationSeconds;
    }


    public void setRestDurationSeconds(int restDurationSeconds) {
        this.restDurationSeconds = restDurationSeconds;
    }



    public WorkoutRoutine getRoutine() {
        return routine;
    }


    public void setRoutine(WorkoutRoutine routine) {
        this.routine = routine;
    }

}