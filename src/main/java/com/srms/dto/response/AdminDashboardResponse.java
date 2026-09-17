package com.srms.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalStudents;

    private long totalTeachers;

    private long totalCourses;

    private long totalSubjects;

    private long totalResults;

    private long pendingRechecking;

    private long completedRechecking;

    private long approvedRechecking;

    private long rejectedRechecking;

    private double averageSGPA;

    private double averagePercentage;

    private long passedResults;

    private long failedResults;

    private double passPercentage;

}