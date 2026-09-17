package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.StudentProfileRequest;
import com.srms.dto.request.StudentRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.StudentProfileResponse;
import com.srms.dto.response.StudentResponse;
import com.srms.service.StudentService;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> addStudent(
            @Valid @RequestBody StudentRequest request) {

        return ResponseEntity.ok(studentService.addStudent(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {

        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {

        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteStudent(
            @PathVariable Long id) {

        return ResponseEntity.ok(studentService.deleteStudent(id));
    }

}