package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.srms.dto.request.TeacherResultRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.AssignedSubjectResponse;
import com.srms.dto.response.SubjectPerformanceResponse;
import com.srms.dto.response.TeacherDashboardResponse;
import com.srms.dto.response.TeacherRecheckingResponse;
import com.srms.dto.response.TeacherResultResponse;
import com.srms.dto.response.TeacherStudentResponse;
import com.srms.service.TeacherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherDashboardController {

        private final TeacherService teacherService;

        @GetMapping("/dashboard")
        public ResponseEntity<ApiResponse<TeacherDashboardResponse>> getDashboard(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                teacherService.getTeacherDashboard(
                                                authentication.getName()));
        }

        @GetMapping("/students")
        public ResponseEntity<ApiResponse<List<TeacherStudentResponse>>> getStudents(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                teacherService.getStudents(
                                                authentication.getName()));
        }

        @GetMapping("/subjects")
        public ResponseEntity<ApiResponse<List<AssignedSubjectResponse>>> getSubjects(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                teacherService.getAssignedSubjects(
                                                authentication.getName()));
        }

        @GetMapping("/subject-performance")
        public ResponseEntity<ApiResponse<List<SubjectPerformanceResponse>>> getSubjectPerformance(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                teacherService.getSubjectPerformance(
                                                authentication.getName()));
        }

        @GetMapping("/results")
        public ResponseEntity<ApiResponse<List<TeacherResultResponse>>> getResults(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                teacherService.getResults(
                                                authentication.getName()));
        }

        // =========================================================
        // SAVE / UPDATE RESULTS
        // =========================================================

        // =========================================================
        // SAVE / UPDATE RESULTS
        // =========================================================

        @PostMapping("/enter-results")
        public ResponseEntity<ApiResponse<String>> saveResults(
                        Authentication authentication,
                        @RequestBody List<TeacherResultRequest> requests) {

                return ResponseEntity.ok(
                                teacherService.saveResults(
                                                authentication.getName(),
                                                requests));
        }

}