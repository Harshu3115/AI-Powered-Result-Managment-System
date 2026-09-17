package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.response.UserResponse;
import com.srms.entity.User;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .build();
    }
}