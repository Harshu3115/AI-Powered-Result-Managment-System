package com.srms.service;

import com.srms.dto.request.AdminProfileUpdateRequest;
import com.srms.dto.response.AdminProfileResponse;
import com.srms.dto.response.ApiResponse;

public interface AdminProfileService {

    ApiResponse<AdminProfileResponse> getProfile(
            String username);

    ApiResponse<AdminProfileResponse> updateProfile(
            String username,
            AdminProfileUpdateRequest request);
}