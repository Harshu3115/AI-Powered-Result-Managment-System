package com.srms.dto.response;

import lombok.*;
import com.srms.enums.SubjectType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectResponse {

    private Long id;

    private String subjectCode;

    private String subjectName;

    private Integer credits;

    private Integer internalMaxMarks;
    private Integer externalMaxMarks;
    private SubjectType subjectType;

    private Integer passingMarks;

    private Long semesterId;

    private String semesterName;

    private Long courseId;

    private String courseName;

    private Long departmentId;

    private String departmentName;

}