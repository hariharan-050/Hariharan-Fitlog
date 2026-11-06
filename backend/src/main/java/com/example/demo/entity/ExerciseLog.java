package com.example.demo.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "exercise_logs")
public class ExerciseLog {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String exerciseName;



    private int actualSets;



    private int actualReps;



    private double actualWeightKg;



    private boolean isPersonalRecord;



    @ManyToOne
    @JoinColumn(name = "session_id")
    private WorkoutSession session;




    public ExerciseLog() {
    }




    public ExerciseLog(Long id,
                       String exerciseName,
                       int actualSets,
                       int actualReps,
                       double actualWeightKg,
                       boolean isPersonalRecord,
                       WorkoutSession session) {

        this.id = id;
        this.exerciseName = exerciseName;
        this.actualSets = actualSets;
        this.actualReps = actualReps;
        this.actualWeightKg = actualWeightKg;
        this.isPersonalRecord = isPersonalRecord;
        this.session = session;
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




    public int getActualSets() {
        return actualSets;
    }


    public void setActualSets(int actualSets) {
        this.actualSets = actualSets;
    }




    public int getActualReps() {
        return actualReps;
    }


    public void setActualReps(int actualReps) {
        this.actualReps = actualReps;
    }




    public double getActualWeightKg() {
        return actualWeightKg;
    }


    public void setActualWeightKg(double actualWeightKg) {
        this.actualWeightKg = actualWeightKg;
    }




    public boolean isPersonalRecord() {
        return isPersonalRecord;
    }


    public void setPersonalRecord(boolean personalRecord) {
        isPersonalRecord = personalRecord;
    }




    public WorkoutSession getSession() {
        return session;
    }


    public void setSession(WorkoutSession session) {
        this.session = session;
    }

}