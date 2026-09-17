package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.TeacherSubjectRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.TeacherSubjectResponse;
import com.srms.service.TeacherSubjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/teacher-subjects")
@RequiredArgsConstructor
public class TeacherSubjectController {

        private final TeacherSubjectService teacherSubjectService;

        @PostMapping
        public ResponseEntity<ApiResponse<TeacherSubjectResponse>> assignSubject(
                        @Valid @RequestBody TeacherSubjectRequest request) {

                return ResponseEntity.ok(
                                teacherSubjectService.assignSubject(request));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<TeacherSubjectResponse>>> getAllAssignments() {

                return ResponseEntity.ok(
                                teacherSubjectService.getAllAssignments());
        }

        @GetMapping("/teacher/{teacherId}")
        public ResponseEntity<ApiResponse<List<TeacherSubjectResponse>>> getSubjectsByTeacher(
                        @PathVariable Long teacherId) {

                return ResponseEntity.ok(
                                teacherSubjectService.getSubjectsByTeacher(teacherId));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<String>> deleteAssignment(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                teacherSubjectService.deleteAssignment(id));
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<TeacherSubjectResponse>> updateAssignment(
                        @PathVariable Long id,
                        @Valid @RequestBody TeacherSubjectRequest request) {

                return ResponseEntity.ok(
                                teacherSubjectService.updateAssignment(id, request));
        }
}