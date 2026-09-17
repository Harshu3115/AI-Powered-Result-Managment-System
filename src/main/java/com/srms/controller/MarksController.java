package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.MarksRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.MarksResponse;
import com.srms.service.MarksService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/marks")
@RequiredArgsConstructor
public class MarksController {

        private final MarksService marksService;

        @PostMapping
        public ResponseEntity<ApiResponse<MarksResponse>> addMarks(
                        @Valid @RequestBody MarksRequest request) {

                return ResponseEntity.ok(
                                marksService.addMarks(request));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<MarksResponse>>> getAllMarks() {

                return ResponseEntity.ok(
                                marksService.getAllMarks());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<MarksResponse>> getMarksById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                marksService.getMarksById(id));
        }

        @GetMapping("/student/{studentId}")
        public ResponseEntity<ApiResponse<List<MarksResponse>>> getMarksByStudent(
                        @PathVariable Long studentId) {

                return ResponseEntity.ok(
                                marksService.getMarksByStudent(studentId));
        }

        @GetMapping("/my")
        public ResponseEntity<ApiResponse<List<MarksResponse>>> getMyMarks() {

                return ResponseEntity.ok(
                                marksService.getMarksByTeacher());
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<MarksResponse>> updateMarks(
                        @PathVariable Long id,
                        @Valid @RequestBody MarksRequest request) {

                return ResponseEntity.ok(
                                marksService.updateMarks(id, request));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<String>> deleteMarks(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                marksService.deleteMarks(id));
        }

        // ==========================================
        // ADD MARKS FOR MULTIPLE STUDENTS
        // ==========================================
        @PostMapping("/bulk")
        public ResponseEntity<ApiResponse<List<MarksResponse>>> addBulkMarks(
                        @Valid @RequestBody List<MarksRequest> requests) {

                return ResponseEntity.ok(
                                marksService.addBulkMarks(requests));
        }
}