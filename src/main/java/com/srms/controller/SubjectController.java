package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.SubjectRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.SubjectResponse;
import com.srms.service.SubjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> addSubject(
            @Valid @RequestBody SubjectRequest request) {

        return ResponseEntity.ok(subjectService.addSubject(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {

        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectById(
            @PathVariable Long id) {

        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request) {

        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSubject(
            @PathVariable Long id) {

        return ResponseEntity.ok(subjectService.deleteSubject(id));
    }
}