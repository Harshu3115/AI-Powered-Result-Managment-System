package com.srms.service;

import java.util.List;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.NotificationResponse;
import com.srms.entity.User;

public interface NotificationService {

        ApiResponse<List<NotificationResponse>> getMyNotifications(
                        String username);

        ApiResponse<Long> getUnreadCount(
                        String username);

        ApiResponse<NotificationResponse> markAsRead(
                        String username,
                        Long notificationId);

        ApiResponse<String> markAllAsRead(
                        String username);

        void createNotification(
                        User user,
                        String title,
                        String message,
                        String type);
}