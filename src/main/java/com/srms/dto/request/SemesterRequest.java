package com.srms.dto.request;

import com.srms.enums.ExamMode;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import com.srms.enums.ExamMode;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SemesterRequest {

    @NotNull(message = "Semester Number is required")
    @Min(value = 1)
    @Max(value = 10)
    private Integer semesterNumber;

    private String semesterName;

    @NotNull(message = "Course is required")
    private Long courseId;

    @NotNull(message = "Exam mode is required")
    private ExamMode examMode;

}