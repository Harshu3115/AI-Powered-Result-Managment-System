package com.srms.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherRecheckingCompleteRequest {

    @NotNull(message = "Review result is required")
    private String reviewResult;

    @Min(value = 0, message = "Marks cannot be negative")
    @Max(value = 60, message = "External marks cannot exceed 60")
    private Integer newMarks;

    @Size(max = 1000, message = "Teacher message cannot exceed 1000 characters")
    private String teacherMessage;
}