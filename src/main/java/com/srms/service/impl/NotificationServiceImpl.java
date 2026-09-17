package com.srms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.NotificationResponse;
import com.srms.entity.Notification;
import com.srms.entity.User;
import com.srms.repository.NotificationRepository;
import com.srms.repository.UserRepository;
import com.srms.service.NotificationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

        private final NotificationRepository notificationRepository;
        private final UserRepository userRepository;
        private final SimpMessagingTemplate messagingTemplate;

        // =========================================================
        // GET MY NOTIFICATIONS
        // =========================================================

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<List<NotificationResponse>> getMyNotifications(
                        String username) {

                User user = getUserByUsername(username);

                List<NotificationResponse> notifications = notificationRepository
                                .findByUserOrderByCreatedAtDesc(user)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<NotificationResponse>>builder()
                                .success(true)
                                .message("Notifications fetched successfully")
                                .data(notifications)
                                .build();
        }

        // =========================================================
        // GET UNREAD COUNT
        // =========================================================

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<Long> getUnreadCount(String username) {

                User user = getUserByUsername(username);

                long unreadCount = notificationRepository
                                .countByUserAndIsReadFalse(user);

                return ApiResponse.<Long>builder()
                                .success(true)
                                .message("Unread notification count fetched successfully")
                                .data(unreadCount)
                                .build();
        }

        // =========================================================
        // MARK ONE NOTIFICATION AS READ
        // =========================================================

        @Override
        public ApiResponse<NotificationResponse> markAsRead(
                        String username,
                        Long notificationId) {

                User user = getUserByUsername(username);

                Notification notification = notificationRepository.findById(notificationId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Notification not found"));

                // Make sure this notification belongs
                // to the currently logged-in user.
                if (!notification.getUser().getId()
                                .equals(user.getId())) {

                        throw new RuntimeException(
                                        "You are not authorized to access this notification");
                }

                notification.setIsRead(true);

                Notification saved = notificationRepository.save(notification);

                return ApiResponse.<NotificationResponse>builder()
                                .success(true)
                                .message("Notification marked as read")
                                .data(mapToResponse(saved))
                                .build();
        }

        // =========================================================
        // MARK ALL NOTIFICATIONS AS READ
        // =========================================================

        @Override
        public ApiResponse<String> markAllAsRead(String username) {

                User user = getUserByUsername(username);

                List<Notification> notifications = notificationRepository
                                .findByUserAndIsReadFalseOrderByCreatedAtDesc(user);

                notifications.forEach(
                                notification -> notification.setIsRead(true));

                notificationRepository.saveAll(notifications);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("All notifications marked as read")
                                .data("SUCCESS")
                                .build();
        }

        // =========================================================
        // GET USER BY USERNAME
        // =========================================================

        private User getUserByUsername(String username) {

                return userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found: " + username));
        }

        // =========================================================
        // MAP ENTITY TO RESPONSE DTO
        // =========================================================

        private NotificationResponse mapToResponse(
                        Notification notification) {

                return NotificationResponse.builder()
                                .id(notification.getId())
                                .title(notification.getTitle())
                                .message(notification.getMessage())
                                .isRead(notification.getIsRead())
                                .type(notification.getType())
                                .createdAt(notification.getCreatedAt())
                                .build();
        }

        // =========================================================
        // CREATE NOTIFICATION
        // =========================================================

        @Override
        public void createNotification(
                        User user,
                        String title,
                        String message,
                        String type) {

                Notification notification = Notification.builder()
                                .user(user)
                                .title(title)
                                .message(message)
                                .isRead(false)
                                .createdAt(
                                                java.time.LocalDateTime.now())
                                .type(type)
                                .build();

                Notification saved = notificationRepository.save(notification);

                NotificationResponse response = mapToResponse(saved);

                // Send notification immediately through WebSocket
                messagingTemplate.convertAndSendToUser(
                                user.getUsername(),
                                "/queue/notifications",
                                response);
        }
}