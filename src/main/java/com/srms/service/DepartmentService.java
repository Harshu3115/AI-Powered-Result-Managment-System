package com.srms.service;

import java.util.List;

import com.srms.dto.request.DepartmentRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.DepartmentResponse;

public interface DepartmentService {

    ApiResponse<DepartmentResponse> addDepartment(
            DepartmentRequest request);

    ApiResponse<List<DepartmentResponse>> getAllDepartments();

    ApiResponse<DepartmentResponse> getDepartmentById(
            Long id);

    ApiResponse<DepartmentResponse> updateDepartment(
            Long id,
            DepartmentRequest request);

    ApiResponse<String> deleteDepartment(
            Long id);
}