package com.srms.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FabmyyChatRequest {

    @NotBlank(message = "Question cannot be empty.")
    @Size(max = 2000, message = "Question cannot exceed 2000 characters.")
    private String question;
}