package com.example.demo.service;

import com.example.demo.dto.ExerciseLogDto;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExerciseLogService {

    /*
     * Required by test t14.
     *
     * Method name: getLogsForSession
     * Parameter: Long
     * Return type: List<ExerciseLogDto>
     */
    public List<ExerciseLogDto> getLogsForSession(
            Long sessionId) {

        /*
         * Replace this with repository logic later.
         */
        return new ArrayList<>();
    }

    /*
     * Existing paginated method.
     * You can keep this if it is used elsewhere.
     */
    public Page<ExerciseLogDto> getSessionLogs(
            Long sessionId,
            int page,
            int size) {

        return null;
    }

    // Add a new exercise log
    public ExerciseLogDto addLog(
            Long sessionId,
            ExerciseLogDto dto,
            String username) {

        return null;
    }

    // Update an exercise log
    public ExerciseLogDto updateLog(
            Long id,
            ExerciseLogDto dto,
            String username) {

        return null;
    }

    // Delete an exercise log
    public void deleteLog(
            Long id,
            String username) {

        // Delete logic
    }
}