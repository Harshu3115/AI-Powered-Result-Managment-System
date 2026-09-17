package com.srms.service;

import java.util.List;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.UserResponse;
import com.srms.entity.User;

public interface UserService {

    ApiResponse<List<UserResponse>> getAllUsers();

    ApiResponse<UserResponse> getUserById(Long id);

    ApiResponse<UserResponse> addUser(User user);

    ApiResponse<UserResponse> updateUser(
            Long id,
            User user);

    ApiResponse<String> deleteUser(Long id);

    ApiResponse<UserResponse> toggleUserStatus(Long id);
}