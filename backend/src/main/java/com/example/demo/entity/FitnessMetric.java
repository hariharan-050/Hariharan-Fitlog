package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
@Table(name = "fitness_metrics")
public class FitnessMetric {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private LocalDate recordedDate;



    private Double bodyWeightKg;



    private Double bodyFatPercentage;



    private Double chestCircumferenceCm;



    private Double waistCircumferenceCm;



    @ManyToOne
    @JoinColumn(name = "user_id")
    private SystemAccount user;




    public FitnessMetric() {
    }




    public FitnessMetric(Long id,
                         LocalDate recordedDate,
                         Double bodyWeightKg,
                         Double bodyFatPercentage,
                         Double chestCircumferenceCm,
                         Double waistCircumferenceCm,
                         SystemAccount user) {

        this.id = id;
        this.recordedDate = recordedDate;
        this.bodyWeightKg = bodyWeightKg;
        this.bodyFatPercentage = bodyFatPercentage;
        this.chestCircumferenceCm = chestCircumferenceCm;
        this.waistCircumferenceCm = waistCircumferenceCm;
        this.user = user;
    }




    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }




    public LocalDate getRecordedDate() {
        return recordedDate;
    }


    public void setRecordedDate(LocalDate recordedDate) {
        this.recordedDate = recordedDate;
    }




    public Double getBodyWeightKg() {
        return bodyWeightKg;
    }


    public void setBodyWeightKg(Double bodyWeightKg) {
        this.bodyWeightKg = bodyWeightKg;
    }




    public Double getBodyFatPercentage() {
        return bodyFatPercentage;
    }


    public void setBodyFatPercentage(Double bodyFatPercentage) {
        this.bodyFatPercentage = bodyFatPercentage;
    }




    public Double getChestCircumferenceCm() {
        return chestCircumferenceCm;
    }


    public void setChestCircumferenceCm(Double chestCircumferenceCm) {
        this.chestCircumferenceCm = chestCircumferenceCm;
    }




    public Double getWaistCircumferenceCm() {
        return waistCircumferenceCm;
    }


    public void setWaistCircumferenceCm(Double waistCircumferenceCm) {
        this.waistCircumferenceCm = waistCircumferenceCm;
    }




    public SystemAccount getUser() {
        return user;
    }


    public void setUser(SystemAccount user) {
        this.user = user;
    }

}