package com.srms.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AdminAiAnalyticsRequest {

    @NotBlank(message = "Question is required")
    private String question;
}