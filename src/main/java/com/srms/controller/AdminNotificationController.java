package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.response.AdminNotificationResponse;
import com.srms.dto.response.ApiResponse;
import com.srms.service.AdminNotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/notifications")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final AdminNotificationService adminNotificationService;

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminNotificationResponse>>> getNotifications() {

        return ResponseEntity.ok(
                adminNotificationService.getAdminNotifications());
    }

    // =========================================================
    // UNREAD COUNT
    // =========================================================

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {

        return ResponseEntity.ok(
                adminNotificationService.getUnreadCount());
    }

    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<AdminNotificationResponse>> markAsRead(@PathVariable Long id) {

        return ResponseEntity.ok(
                adminNotificationService.markAsRead(id));
    }

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead() {

        return ResponseEntity.ok(
                adminNotificationService.markAllAsRead());
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Long id) {

        return ResponseEntity.ok(
                adminNotificationService.deleteNotification(id));
    }
}