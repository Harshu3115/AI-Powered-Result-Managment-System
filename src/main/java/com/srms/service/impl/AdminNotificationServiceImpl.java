package com.srms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srms.dto.response.AdminNotificationResponse;
import com.srms.dto.response.ApiResponse;
import com.srms.entity.AdminNotification;
import com.srms.exception.ResourceNotFoundException;
import com.srms.repository.AdminNotificationRepository;
import com.srms.service.AdminNotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminNotificationServiceImpl
        implements AdminNotificationService {

    private final AdminNotificationRepository adminNotificationRepository;

    // =========================================================
    // GET ALL ADMIN NOTIFICATIONS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<AdminNotificationResponse>> getAdminNotifications() {

        List<AdminNotificationResponse> notifications = adminNotificationRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ApiResponse.<List<AdminNotificationResponse>>builder()
                .success(true)
                .message("Admin notifications fetched successfully")
                .data(notifications)
                .build();
    }

    // =========================================================
    // UNREAD COUNT
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Long> getUnreadCount() {

        long count = adminNotificationRepository.countByIsReadFalse();

        return ApiResponse.<Long>builder()
                .success(true)
                .message("Unread notification count fetched successfully")
                .data(count)
                .build();
    }

    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    @Override
    public ApiResponse<AdminNotificationResponse> markAsRead(Long id) {

        AdminNotification notification = adminNotificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Admin notification not found."));

        notification.setIsRead(true);

        AdminNotification saved = adminNotificationRepository.save(notification);

        return ApiResponse.<AdminNotificationResponse>builder()
                .success(true)
                .message("Notification marked as read")
                .data(mapToResponse(saved))
                .build();
    }

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @Override
    public ApiResponse<String> markAllAsRead() {

        List<AdminNotification> notifications = adminNotificationRepository
                .findByIsReadFalseOrderByCreatedAtDesc();

        notifications.forEach(
                notification -> notification.setIsRead(true));

        adminNotificationRepository.saveAll(notifications);

        return ApiResponse.<String>builder()
                .success(true)
                .message("All notifications marked as read")
                .data("SUCCESS")
                .build();
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public ApiResponse<String> deleteNotification(Long id) {

        AdminNotification notification = adminNotificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Admin notification not found."));

        adminNotificationRepository.delete(notification);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Notification deleted successfully")
                .data("SUCCESS")
                .build();
    }

    // =========================================================
    // MAPPER
    // =========================================================

    private AdminNotificationResponse mapToResponse(
            AdminNotification notification) {

        return AdminNotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .type(notification.getType())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}