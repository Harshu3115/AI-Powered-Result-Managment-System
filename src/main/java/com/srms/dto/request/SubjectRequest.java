package com.srms.dto.request;

import com.srms.enums.SubjectType;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectRequest {

    @NotBlank(message = "Subject Code is required")
    private String subjectCode;

    @NotBlank(message = "Subject Name is required")
    private String subjectName;

    @NotNull(message = "Credits are required")
    @Min(1)
    @Max(10)
    private Integer credits;

    @NotNull(message = "Internal Max Marks are required")
    @Min(0)
    @Max(100)
    private Integer internalMaxMarks;

    @NotNull(message = "External Max Marks are required")
    @Min(0)
    @Max(100)
    private Integer externalMaxMarks;

    @NotNull(message = "Passing Marks are required")
    @Min(0)
    @Max(100)
    private Integer passingMarks;

    @NotNull(message = "Subject Type is required")
    private SubjectType subjectType;

    @NotNull(message = "Semester is required")
    private Long semesterId;

}