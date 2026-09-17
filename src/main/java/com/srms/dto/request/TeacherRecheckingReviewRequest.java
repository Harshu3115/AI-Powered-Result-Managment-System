package com.srms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherRecheckingReviewRequest {

    @NotNull(message = "Approved status is required")
    private Boolean approved;
}