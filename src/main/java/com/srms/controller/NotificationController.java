package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.NotificationResponse;
import com.srms.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

        private final NotificationService notificationService;

        @GetMapping
        public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                notificationService.getMyNotifications(
                                                authentication.getName()));
        }

        @GetMapping("/unread-count")
        public ResponseEntity<ApiResponse<Long>> getUnreadCount(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                notificationService.getUnreadCount(
                                                authentication.getName()));
        }

        @PutMapping("/{id}/read")
        public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
                        @PathVariable Long id,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                notificationService.markAsRead(
                                                authentication.getName(),
                                                id));
        }

        @PutMapping("/read-all")
        public ResponseEntity<ApiResponse<String>> markAllAsRead(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                notificationService.markAllAsRead(
                                                authentication.getName()));
        }
}