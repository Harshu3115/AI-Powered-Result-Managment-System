package com.srms.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarksRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Long subjectId;

    @NotNull
    @Min(0)
    private Integer internalMarks;

    @NotNull
    @Min(0)
    private Integer externalMarks;

}