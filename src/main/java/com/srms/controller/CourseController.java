package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.CourseRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.CourseResponse;
import com.srms.service.CourseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> addCourse(
            @Valid @RequestBody CourseRequest request) {

        return ResponseEntity.ok(courseService.addCourse(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses() {

        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseById(
            @PathVariable Long id) {

        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request) {

        return ResponseEntity.ok(courseService.updateCourse(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCourse(
            @PathVariable Long id) {

        return ResponseEntity.ok(courseService.deleteCourse(id));
    }
}