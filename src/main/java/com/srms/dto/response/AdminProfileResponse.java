package com.srms.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfileResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String username;

    private String email;

    private String mobile;

    private String role;
}