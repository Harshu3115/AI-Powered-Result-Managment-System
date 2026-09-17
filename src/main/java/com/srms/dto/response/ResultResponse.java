package com.srms.dto.response;

import java.util.List;

import com.srms.enums.ExamMode;
import com.srms.enums.ResultStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultResponse {

    private Long id;

    private Long studentId;
    private String studentName;
    private String rollNo;

    private Long semesterId;
    private String semesterName;

    private Long courseId;
    private String courseName;

    private Long departmentId;
    private String departmentName;

    private Integer totalMarks;
    private Integer obtainedMarks;

    private Double percentage;

    private Double sgpa;

    private ResultStatus resultStatus;

    private List<ResultSubjectResponse> subjects;

    private ExamMode examMode;

    private Double cgpaPercentage;
}