package com.srms.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultSubjectResponse {

    private Long resultSubjectId;

    private Long subjectId;

    private String subjectCode;

    private String subjectName;

    private Integer credits;

    private Integer totalMarks;

    private Integer obtainedMarks;

    private Double percentage;

    private String grade;

    private Double gradePoint;
}