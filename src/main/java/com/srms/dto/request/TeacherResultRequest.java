package com.srms.dto.request;

import com.srms.enums.SubjectType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResultRequest {

    private Long studentId;
    private Long subjectId;
    private Integer internalMarks;
    private Integer externalMarks;

    private SubjectType subjectType;
}