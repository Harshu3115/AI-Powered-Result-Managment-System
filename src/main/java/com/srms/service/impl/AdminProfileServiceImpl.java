package com.srms.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srms.dto.request.AdminProfileUpdateRequest;
import com.srms.dto.response.AdminProfileResponse;
import com.srms.dto.response.ApiResponse;
import com.srms.entity.User;
import com.srms.enums.Role;
import com.srms.repository.UserRepository;
import com.srms.service.AdminProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminProfileServiceImpl implements AdminProfileService {

    private final UserRepository userRepository;

    // =====================================================
    // GET ADMIN PROFILE
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<AdminProfileResponse> getProfile(
            String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(
                        "Admin user not found."));

        // Check ADMIN role
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException(
                    "Only administrators can access this profile.");
        }

        return ApiResponse.<AdminProfileResponse>builder()
                .success(true)
                .message("Admin profile fetched successfully")
                .data(mapToResponse(user))
                .build();
    }

    // =====================================================
    // UPDATE ADMIN PROFILE
    // =====================================================

    @Override
    public ApiResponse<AdminProfileResponse> updateProfile(
            String username,
            AdminProfileUpdateRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(
                        "Admin user not found."));

        // Check ADMIN role
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException(
                    "Only administrators can update this profile.");
        }

        // -------------------------------------------------
        // Update email
        // -------------------------------------------------

        if (request.getEmail() != null &&
                !request.getEmail().trim().isEmpty()) {

            user.setEmail(
                    request.getEmail().trim());
        }

        // -------------------------------------------------
        // Save to database
        // -------------------------------------------------

        User savedUser = userRepository.save(user);

        return ApiResponse.<AdminProfileResponse>builder()
                .success(true)
                .message("Admin profile updated successfully")
                .data(mapToResponse(savedUser))
                .build();
    }

    // =====================================================
    // MAP USER → RESPONSE
    // =====================================================

    private AdminProfileResponse mapToResponse(User user) {

        return AdminProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(
                        user.getRole() != null
                                ? user.getRole().name()
                                : null)
                .build();
    }
}