package com.srms.dto.response;

import com.srms.enums.Role;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String username;

    private String email;

    private Role role;

    private Boolean enabled;
}