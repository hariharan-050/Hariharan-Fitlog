package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "workout_sessions")
public class WorkoutSession {


    public enum SessionStatus {
        IN_PROGRESS,
        COMPLETED,
        ABORTED
    }



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String routineTitle;



    private LocalDate scheduledDate;



    private LocalDateTime startedAt;



    private LocalDateTime completedAt;



    @Enumerated(EnumType.STRING)
    private SessionStatus sessionStatus;



    private Integer fatigueScore;



    @ManyToOne
    @JoinColumn(name = "user_id")
    private SystemAccount user;



    @OneToMany(mappedBy = "session",
            cascade = CascadeType.ALL)
    private List<ExerciseLog> logs;




    public WorkoutSession() {
    }




    public WorkoutSession(Long id,
                          String routineTitle,
                          LocalDate scheduledDate,
                          LocalDateTime startedAt,
                          LocalDateTime completedAt,
                          SessionStatus sessionStatus,
                          Integer fatigueScore,
                          SystemAccount user,
                          List<ExerciseLog> logs) {

        this.id = id;
        this.routineTitle = routineTitle;
        this.scheduledDate = scheduledDate;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.sessionStatus = sessionStatus;
        this.fatigueScore = fatigueScore;
        this.user = user;
        this.logs = logs;
    }




    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }




    public String getRoutineTitle() {
        return routineTitle;
    }


    public void setRoutineTitle(String routineTitle) {
        this.routineTitle = routineTitle;
    }




    public LocalDate getScheduledDate() {
        return scheduledDate;
    }


    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }




    public LocalDateTime getStartedAt() {
        return startedAt;
    }


    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }




    public LocalDateTime getCompletedAt() {
        return completedAt;
    }


    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }




    public SessionStatus getSessionStatus() {
        return sessionStatus;
    }


    public void setSessionStatus(SessionStatus sessionStatus) {
        this.sessionStatus = sessionStatus;
    }




    public Integer getFatigueScore() {
        return fatigueScore;
    }


    public void setFatigueScore(Integer fatigueScore) {
        this.fatigueScore = fatigueScore;
    }




    public SystemAccount getUser() {
        return user;
    }


    public void setUser(SystemAccount user) {
        this.user = user;
    }




    public List<ExerciseLog> getLogs() {
        return logs;
    }


    public void setLogs(List<ExerciseLog> logs) {
        this.logs = logs;
    }

}