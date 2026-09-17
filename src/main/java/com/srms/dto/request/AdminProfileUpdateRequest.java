package com.srms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfileUpdateRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;
}