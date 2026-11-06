package com.example.demo.dto;

public class FitnessMetricDto {

    private Long id;
    private Double bodyWeightKg;
    private Double heightCm;
    private Double bmi;
    private Double bodyFatPercentage;
    private Double chestCircumferenceCm;
    private Double waistCircumferenceCm;
    private String recordedDate;

    public FitnessMetricDto() {
    }

    public FitnessMetricDto(Long id,
                            Double bodyWeightKg,
                            Double heightCm,
                            Double bmi,
                            String recordedDate) {
        this.id = id;
        this.bodyWeightKg = bodyWeightKg;
        this.heightCm = heightCm;
        this.bmi = bmi;
        this.recordedDate = recordedDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getBodyWeightKg() {
        return bodyWeightKg;
    }

    public void setBodyWeightKg(Double bodyWeightKg) {
        this.bodyWeightKg = bodyWeightKg;
    }

    public Double getHeightCm() {
        return heightCm;
    }

    public void setHeightCm(Double heightCm) {
        this.heightCm = heightCm;
    }

    public Double getBmi() {
        return bmi;
    }

    public void setBmi(Double bmi) {
        this.bmi = bmi;
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

    public String getRecordedDate() {
        return recordedDate;
    }

    public void setRecordedDate(String recordedDate) {
        this.recordedDate = recordedDate;
    }
}