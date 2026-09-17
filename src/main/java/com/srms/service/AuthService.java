package com.srms.service;

import com.srms.dto.request.LoginRequest;
import com.srms.dto.request.RegisterRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.LoginResponse;

public interface AuthService {

    ApiResponse<String> register(RegisterRequest request);

    ApiResponse<LoginResponse> login(LoginRequest request);

}