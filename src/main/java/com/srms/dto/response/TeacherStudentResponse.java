package com.srms.dto.response;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherStudentResponse {

    private Long studentId;

    private String rollNo;

    private String enrollmentNo;

    private Long prnNo;

    private String studentName;

    private String email;

    private String mobile;

    private Integer admissionYear;

    private String semesterName;

    private Integer subjectsCount;

    private Double percentage;

    private Double sgpa;

    private String resultStatus;

    private Map<String, Long> semesterSubjectCounts;
}