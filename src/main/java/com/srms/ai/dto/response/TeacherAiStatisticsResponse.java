package com.srms.ai.dto.response;

import java.util.List;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherAiStatisticsResponse {

    private long totalAssignedSubjects;

    private long totalStudentAttempts;

    private long passedAttempts;

    private long failedAttempts;

    private double passPercentage;

    private double averageMarks;

    private double averagePercentage;

    private List<SubjectStatistics> subjectStatistics;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectStatistics {

        private String subjectCode;

        private String subjectName;

        private int totalAttempts;

        private int passedAttempts;

        private int failedAttempts;

        private double passPercentage;

        private double averageMarks;

        private double averagePercentage;
    }
}