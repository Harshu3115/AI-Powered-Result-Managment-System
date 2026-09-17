package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.DepartmentRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.DepartmentResponse;
import com.srms.service.DepartmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentResponse>> addDepartment(
            @Valid @RequestBody DepartmentRequest request) {

        return ResponseEntity.ok(
                departmentService.addDepartment(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                departmentService.getDepartmentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {

        return ResponseEntity.ok(
                departmentService.updateDepartment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDepartment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                departmentService.deleteDepartment(id));
    }
}