package com.srms.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.UserResponse;
import com.srms.entity.User;
import com.srms.mapper.UserMapper;
import com.srms.repository.UserRepository;
import com.srms.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    // =====================================================
    // GET ALL USERS
    // =====================================================

    @Override
    public ApiResponse<List<UserResponse>> getAllUsers() {

        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();

        return ApiResponse.<List<UserResponse>>builder()
                .success(true)
                .message("Users fetched successfully.")
                .data(users)
                .build();
    }

    // =====================================================
    // GET USER BY ID
    // =====================================================

    @Override
    public ApiResponse<UserResponse> getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User fetched successfully.")
                .data(userMapper.toResponse(user))
                .build();
    }

    // =====================================================
    // ADD USER
    // =====================================================

    @Override
    @Transactional
    public ApiResponse<UserResponse> addUser(User user) {

        if (user.getUsername() == null
                || user.getUsername().isBlank()) {

            throw new RuntimeException(
                    "Username is required.");
        }

        if (user.getEmail() == null
                || user.getEmail().isBlank()) {

            throw new RuntimeException(
                    "Email is required.");
        }

        if (userRepository.existsByUsername(
                user.getUsername())) {

            throw new RuntimeException(
                    "Username already exists.");
        }

        if (userRepository.existsByEmail(
                user.getEmail())) {

            throw new RuntimeException(
                    "Email already exists.");
        }

        if (user.getPassword() == null
                || user.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Password is required.");
        }

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()));

        if (user.getEnabled() == null) {
            user.setEnabled(true);
        }

        User savedUser = userRepository.save(user);

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User added successfully.")
                .data(userMapper.toResponse(savedUser))
                .build();
    }

    // =====================================================
    // UPDATE USER
    // =====================================================

    @Override
    @Transactional
    public ApiResponse<UserResponse> updateUser(
            Long id,
            User request) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        // Username
        if (request.getUsername() != null
                && !request.getUsername().isBlank()) {

            String username = request.getUsername().trim();

            if (!username.equals(
                    existingUser.getUsername())) {

                if (userRepository.existsByUsername(
                        username)) {

                    throw new RuntimeException(
                            "Username already exists.");
                }

                existingUser.setUsername(username);
            }
        }

        // Email
        if (request.getEmail() != null
                && !request.getEmail().isBlank()) {

            String email = request.getEmail().trim();

            if (!email.equals(
                    existingUser.getEmail())) {

                if (userRepository.existsByEmail(
                        email)) {

                    throw new RuntimeException(
                            "Email already exists.");
                }

                existingUser.setEmail(email);
            }
        }

        // Role
        if (request.getRole() != null) {
            existingUser.setRole(
                    request.getRole());
        }

        // Enabled
        if (request.getEnabled() != null) {
            existingUser.setEnabled(
                    request.getEnabled());
        }

        // Password
        if (request.getPassword() != null
                && !request.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()));
        }

        User savedUser = userRepository.save(existingUser);

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User updated successfully.")
                .data(userMapper.toResponse(savedUser))
                .build();
    }

    // =====================================================
    // DELETE USER
    // =====================================================

    @Override
    @Transactional
    public ApiResponse<String> deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        userRepository.delete(user);

        return ApiResponse.<String>builder()
                .success(true)
                .message("User deleted successfully.")
                .data("User deleted successfully.")
                .build();
    }

    // =====================================================
    // ENABLE / DISABLE
    // =====================================================

    @Override
    @Transactional
    public ApiResponse<UserResponse> toggleUserStatus(
            Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        user.setEnabled(
                !Boolean.TRUE.equals(
                        user.getEnabled()));

        User savedUser = userRepository.save(user);

        String message = Boolean.TRUE.equals(
                savedUser.getEnabled())
                        ? "User enabled successfully."
                        : "User disabled successfully.";

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message(message)
                .data(
                        userMapper.toResponse(
                                savedUser))
                .build();
    }
}