package com.srms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.request.DepartmentRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.DepartmentResponse;
import com.srms.entity.Department;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.DepartmentMapper;
import com.srms.repository.DepartmentRepository;
import com.srms.service.DepartmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

        private final DepartmentRepository departmentRepository;
        private final DepartmentMapper departmentMapper;

        // =====================================================
        // ADD DEPARTMENT
        // =====================================================

        @Override
        public ApiResponse<DepartmentResponse> addDepartment(
                        DepartmentRequest request) {

                if (departmentRepository.existsByDepartmentCode(
                                request.getDepartmentCode())) {

                        throw new BadRequestException(
                                        "Department Code already exists.");
                }

                Department department = departmentMapper.toEntity(request);

                department = departmentRepository.save(department);

                return ApiResponse.<DepartmentResponse>builder()
                                .success(true)
                                .message("Department Added Successfully")
                                .data(
                                                departmentMapper.toResponse(
                                                                department))
                                .build();
        }

        // =====================================================
        // GET ALL DEPARTMENTS
        // =====================================================

        @Override
        public ApiResponse<List<DepartmentResponse>> getAllDepartments() {

                List<DepartmentResponse> departments = departmentRepository.findAll()
                                .stream()
                                .map(departmentMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<DepartmentResponse>>builder()
                                .success(true)
                                .message("Department List")
                                .data(departments)
                                .build();
        }

        // =====================================================
        // GET DEPARTMENT BY ID
        // =====================================================

        @Override
        public ApiResponse<DepartmentResponse> getDepartmentById(Long id) {

                Department department = departmentRepository.findById(id)
                                .orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Department not found."));

                return ApiResponse.<DepartmentResponse>builder()
                                .success(true)
                                .message("Department Found")
                                .data(
                                                departmentMapper.toResponse(
                                                                department))
                                .build();
        }

        // =====================================================
        // UPDATE DEPARTMENT
        // =====================================================

        @Override
        public ApiResponse<DepartmentResponse> updateDepartment(
                        Long id,
                        DepartmentRequest request) {

                Department department = departmentRepository.findById(id)
                                .orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Department not found."));

                // Check code only if it was changed
                if (!department.getDepartmentCode()
                                .equals(request.getDepartmentCode())
                                && departmentRepository.existsByDepartmentCode(
                                                request.getDepartmentCode())) {

                        throw new BadRequestException(
                                        "Department Code already exists.");
                }

                department.setDepartmentCode(
                                request.getDepartmentCode());

                department.setDepartmentName(
                                request.getDepartmentName());

                department.setDescription(
                                request.getDescription());

                department = departmentRepository.save(department);

                return ApiResponse.<DepartmentResponse>builder()
                                .success(true)
                                .message("Department Updated Successfully")
                                .data(
                                                departmentMapper.toResponse(
                                                                department))
                                .build();
        }

        // =====================================================
        // DELETE DEPARTMENT
        // =====================================================

        @Override
        public ApiResponse<String> deleteDepartment(
                        Long id) {

                Department department = departmentRepository.findById(id)
                                .orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Department not found."));

                departmentRepository.delete(department);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Department Deleted Successfully")
                                .data(null)
                                .build();
        }
}