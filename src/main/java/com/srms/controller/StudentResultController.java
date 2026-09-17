package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.CGPAResponse;
import com.srms.dto.response.ResultResponse;
import com.srms.dto.response.StudentDashboardResponse;
import com.srms.service.ResultPdfService;
import com.srms.service.ResultService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/student/results")
@RequiredArgsConstructor
public class StudentResultController {

        private final ResultService resultService;
        private final ResultPdfService resultPdfService;

        @GetMapping
        public ResponseEntity<ApiResponse<List<ResultResponse>>> getMyResults(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                resultService.getStudentResultsByUsername(
                                                authentication.getName()));
        }

        @GetMapping("/{semesterId}")
        public ResponseEntity<ApiResponse<ResultResponse>> getMySemesterResult(
                        @PathVariable Long semesterId,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                resultService.getMySemesterResult(
                                                authentication.getName(),
                                                semesterId));
        }

        @GetMapping("/cgpa")
        public ResponseEntity<ApiResponse<CGPAResponse>> getMyCGPA(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                resultService.getStudentCGPAByUsername(
                                                authentication.getName()));
        }

        @GetMapping("/dashboard")
        public ResponseEntity<ApiResponse<StudentDashboardResponse>> getDashboard(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                resultService.getStudentDashboard(
                                                authentication.getName()));
        }

        @GetMapping("/{resultId}/pdf")
        public ResponseEntity<byte[]> downloadMarksheet(
                        @PathVariable Long resultId,
                        Authentication authentication) {

                byte[] pdf = resultPdfService.generateMarksheet(
                                resultId,
                                authentication.getName());

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=marksheet.pdf")
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(pdf);
        }

}