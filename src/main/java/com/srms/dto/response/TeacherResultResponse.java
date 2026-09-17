package com.srms.dto.response;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResultResponse {

    private Long studentId;

    private Long prnNo;

    private String studentName;

    private String rollNo;

    private Long semesterId;

    private String semesterName;

    private Integer totalMarks;

    private Integer obtainedMarks;

    private Double percentage;

    private Double sgpa;

    private Double cgpa;

    private String resultStatus;

    private List<ResultSubjectResponse> subjects;
}