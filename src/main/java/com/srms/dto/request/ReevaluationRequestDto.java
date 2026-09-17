package com.srms.dto.request;

import java.util.List;

import com.srms.enums.ExamType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReevaluationRequestDto {

    @NotNull(message = "Exam Type is required")
    private ExamType examType;

    @NotEmpty(message = "Please select at least one subject")
    private List<Long> resultSubjectIds;

    @NotBlank(message = "Reason is required")
    private String reason;
}