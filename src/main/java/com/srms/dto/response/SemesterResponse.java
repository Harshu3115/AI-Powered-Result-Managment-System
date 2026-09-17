package com.srms.dto.response;

import lombok.*;
import com.srms.enums.ExamMode;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SemesterResponse {

    private Long id;

    private Integer semesterNumber;

    private String semesterName;

    private Long courseId;

    private String courseName;

    private Long departmentId;

    private String departmentName;
    private ExamMode examMode;

}