package com.example.demo.service;

import com.example.demo.dto.FitnessMetricDto;
import com.example.demo.entity.FitnessMetric;
import com.example.demo.entity.SystemAccount;
import com.example.demo.repository.FitnessMetricRepository;
import com.example.demo.repository.SystemAccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class FitnessMetricService {

    private final FitnessMetricRepository fitnessMetricRepository;
    private final SystemAccountRepository systemAccountRepository;

    public FitnessMetricService(FitnessMetricRepository fitnessMetricRepository,
                                SystemAccountRepository systemAccountRepository) {
        this.fitnessMetricRepository = fitnessMetricRepository;
        this.systemAccountRepository = systemAccountRepository;
    }

    // Get all fitness metrics of a member
    public Page<FitnessMetricDto> getMemberMetrics(String username, int page, int size) {
        SystemAccount account = systemAccountRepository.findByUsername(username).orElse(null);
        if (account == null) {
            return Page.empty();
        }
        Page<FitnessMetric> metrics = fitnessMetricRepository
                .findByUserIdOrderByRecordedDateDesc(account.getId(), PageRequest.of(page, size));
        return metrics.map(this::mapToDto);
    }

    // Record a new fitness metric
    public FitnessMetricDto recordMetric(FitnessMetricDto dto, String username) {
        SystemAccount account = systemAccountRepository.findByUsername(username).orElse(null);
        FitnessMetric metric = new FitnessMetric();
        metric.setUser(account);
        metric.setBodyWeightKg(dto.getBodyWeightKg());
        metric.setBodyFatPercentage(dto.getBodyFatPercentage());
        metric.setChestCircumferenceCm(dto.getChestCircumferenceCm());
        metric.setWaistCircumferenceCm(dto.getWaistCircumferenceCm());
        if (dto.getRecordedDate() != null && !dto.getRecordedDate().isEmpty()) {
            try {
                metric.setRecordedDate(LocalDate.parse(dto.getRecordedDate()));
            } catch (Exception e) {
                metric.setRecordedDate(LocalDate.now());
            }
        } else {
            metric.setRecordedDate(LocalDate.now());
        }
        FitnessMetric saved = fitnessMetricRepository.save(metric);
        return mapToDto(saved);
    }

    // Delete a fitness metric
    public void deleteMetric(Long id, String username) {
        fitnessMetricRepository.deleteById(id);
    }

    private FitnessMetricDto mapToDto(FitnessMetric entity) {
        FitnessMetricDto dto = new FitnessMetricDto();
        dto.setId(entity.getId());
        dto.setBodyWeightKg(entity.getBodyWeightKg());
        dto.setBodyFatPercentage(entity.getBodyFatPercentage());
        dto.setChestCircumferenceCm(entity.getChestCircumferenceCm());
        dto.setWaistCircumferenceCm(entity.getWaistCircumferenceCm());
        if (entity.getRecordedDate() != null) {
            dto.setRecordedDate(entity.getRecordedDate().toString());
        }
        return dto;
    }
}