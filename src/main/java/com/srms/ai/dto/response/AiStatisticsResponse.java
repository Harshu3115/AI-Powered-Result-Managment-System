package com.srms.ai.dto.response;

import java.util.List;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiStatisticsResponse {

    private long totalStudents;

    private long totalResults;

    private long passedResults;

    private long failedResults;

    private double passPercentage;

    private double averageSGPA;

    private double averagePercentage;

    private List<SubjectStatistics> subjectStatistics;

    private List<SemesterStatistics> semesterStatistics;

    private List<DepartmentStatistics> departmentStatistics;

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

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SemesterStatistics {

        private String semesterName;

        private int totalResults;

        private double averageSGPA;

        private double averagePercentage;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentStatistics {

        private Long departmentId;

        private String departmentCode;

        private String departmentName;

        private int totalStudents;

        private int totalResults;

        private int passedResults;

        private int failedResults;

        private double passPercentage;

        private double averageSGPA;

        private double averagePercentage;
    }
}