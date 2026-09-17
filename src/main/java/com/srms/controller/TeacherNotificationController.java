package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.TeacherNotificationResponse;
import com.srms.service.TeacherNotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/notifications")
@RequiredArgsConstructor
public class TeacherNotificationController {

    private final TeacherNotificationService teacherNotificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherNotificationResponse>>> getNotifications(
            Authentication authentication) {

        return ResponseEntity.ok(
                teacherNotificationService.getNotifications(
                        authentication.getName()));
    }
}