package com.srms.service;

import java.util.List;

import com.srms.dto.response.AdminNotificationResponse;
import com.srms.dto.response.ApiResponse;

public interface AdminNotificationService {

    ApiResponse<List<AdminNotificationResponse>> getAdminNotifications();

    ApiResponse<Long> getUnreadCount();

    ApiResponse<AdminNotificationResponse> markAsRead(Long id);

    ApiResponse<String> markAllAsRead();

    ApiResponse<String> deleteNotification(Long id);
}