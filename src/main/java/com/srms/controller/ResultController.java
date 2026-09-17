package com.srms.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.ResultRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.CGPAResponse;
import com.srms.dto.response.ResultResponse;
import com.srms.service.ResultService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/results")
@RequiredArgsConstructor
public class ResultController {

        private final ResultService resultService;

        // Generate semester result
        @PostMapping("/generate")
        public ResponseEntity<ApiResponse<ResultResponse>> generateResult(
                        @Valid @RequestBody ResultRequest request) {

                return ResponseEntity.ok(
                                resultService.generateResult(request));
        }

        // Get all results
        @GetMapping
        public ResponseEntity<ApiResponse<List<ResultResponse>>> getAllResults() {

                return ResponseEntity.ok(
                                resultService.getAllResults());
        }

        // Get result by ID
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<ResultResponse>> getResultById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                resultService.getResultById(id));
        }

        // Get particular student's semester result
        @GetMapping("/student/{studentId}/semester/{semesterId}")
        public ResponseEntity<ApiResponse<ResultResponse>> getStudentSemesterResult(
                        @PathVariable Long studentId,
                        @PathVariable Long semesterId) {

                return ResponseEntity.ok(
                                resultService.getStudentSemesterResult(
                                                studentId,
                                                semesterId));
        }

        // Get all results of a student
        @GetMapping("/student/{studentId}")
        public ResponseEntity<ApiResponse<List<ResultResponse>>> getStudentResults(
                        @PathVariable Long studentId) {

                return ResponseEntity.ok(
                                resultService.getStudentResults(studentId));
        }

        // Delete result
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<String>> deleteResult(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                resultService.deleteResult(id));
        }

        @GetMapping("/student/{studentId}/cgpa")
        public ResponseEntity<ApiResponse<CGPAResponse>> getStudentCGPA(
                        @PathVariable Long studentId) {

                return ResponseEntity.ok(
                                resultService.getStudentCGPA(studentId));
        }

        @GetMapping(value = "/{id}/marksheet", produces = MediaType.APPLICATION_PDF_VALUE)
        public ResponseEntity<byte[]> generateMarksheet(
                        @PathVariable Long id) {

                byte[] pdf = resultService.generateMarksheet(id);

                return ResponseEntity.ok()
                                .contentType(MediaType.APPLICATION_PDF)
                                .header(
                                                "Content-Disposition",
                                                "inline; filename=marksheet-" + id + ".pdf")
                                .body(pdf);
        }
}