package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.DepartmentResponse;
import com.srms.service.DepartmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentPublicController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments());
    }
}