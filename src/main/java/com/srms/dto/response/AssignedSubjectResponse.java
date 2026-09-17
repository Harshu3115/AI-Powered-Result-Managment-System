package com.srms.dto.response;

import lombok.*;
import com.srms.enums.SubjectType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignedSubjectResponse {

    private Long subjectId;

    private String subjectCode;

    private String subjectName;

    private Integer credits;

    private String semesterName;

    private SubjectType subjectType;
}