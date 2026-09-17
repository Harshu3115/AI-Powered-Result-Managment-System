package com.srms.dto.response;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDashboardResponse {

    private Long studentId;

    private String studentName;

    private String rollNo;

    private String courseName;

    private String departmentName;

    private String currentSemester;

    private Double latestSgpa;

    private Double cgpa;

    private Double cgpaPercentage;

    private Integer totalCredits;

    private Integer totalSubjects;

    private Integer passedSubjects;

    private Integer backlogs;

    private String latestResultStatus;

    private List<ResultResponse> semesterResults;
}