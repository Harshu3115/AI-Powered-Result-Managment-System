package com.srms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherSubjectRequest {

    @NotNull(message = "Teacher is required")
    private Long teacherId;

    @NotNull(message = "Subject is required")
    private Long subjectId;
}