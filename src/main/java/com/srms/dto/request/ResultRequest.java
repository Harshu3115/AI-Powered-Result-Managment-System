package com.srms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultRequest {

    @NotNull(message = "Student is required")
    private Long studentId;

    @NotNull(message = "Semester is required")
    private Long semesterId;
}