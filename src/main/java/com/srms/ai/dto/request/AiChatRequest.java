package com.srms.ai.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AiChatRequest {

    @JsonProperty("question")
    @NotBlank(message = "Question is required")
    private String question;
}