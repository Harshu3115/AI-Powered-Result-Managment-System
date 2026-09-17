package com.srms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.TeacherRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.PageResponse;
import com.srms.dto.response.TeacherResponse;
import com.srms.service.TeacherService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
public class TeacherController {

        private final TeacherService teacherService;

        // =========================================================
        // ADD TEACHER
        // =========================================================

        @PostMapping
        public ResponseEntity<ApiResponse<TeacherResponse>> addTeacher(
                        @Valid @RequestBody TeacherRequest request) {

                return ResponseEntity.ok(
                                teacherService.addTeacher(request));
        }

        // =========================================================
        // GET ALL TEACHERS - PAGINATION
        // =========================================================

        @GetMapping
        public ResponseEntity<ApiResponse<PageResponse<TeacherResponse>>> getAllTeachers(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

                return ResponseEntity.ok(
                                teacherService.getAllTeachers(page, size));
        }

        // =========================================================
        // GET TEACHER BY ID
        // =========================================================

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<TeacherResponse>> getTeacherById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                teacherService.getTeacherById(id));
        }

        // =========================================================
        // UPDATE TEACHER
        // =========================================================

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<TeacherResponse>> updateTeacher(
                        @PathVariable Long id,
                        @Valid @RequestBody TeacherRequest request) {

                return ResponseEntity.ok(
                                teacherService.updateTeacher(id, request));
        }

        // =========================================================
        // DELETE TEACHER
        // =========================================================

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<String>> deleteTeacher(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                teacherService.deleteTeacher(id));
        }
}