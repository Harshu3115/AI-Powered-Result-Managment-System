package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.SemesterRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.SemesterResponse;
import com.srms.service.SemesterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/semesters")
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterService semesterService;

    @PostMapping
    public ResponseEntity<ApiResponse<SemesterResponse>> addSemester(
            @Valid @RequestBody SemesterRequest request) {

        return ResponseEntity.ok(semesterService.addSemester(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SemesterResponse>>> getAllSemesters() {

        return ResponseEntity.ok(semesterService.getAllSemesters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SemesterResponse>> getSemesterById(
            @PathVariable Long id) {

        return ResponseEntity.ok(semesterService.getSemesterById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SemesterResponse>> updateSemester(
            @PathVariable Long id,
            @Valid @RequestBody SemesterRequest request) {

        return ResponseEntity.ok(
                semesterService.updateSemester(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSemester(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                semesterService.deleteSemester(id));
    }
}