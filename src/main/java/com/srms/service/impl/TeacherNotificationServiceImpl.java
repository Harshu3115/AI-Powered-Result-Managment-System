package com.srms.service.impl;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.TeacherNotificationResponse;
import com.srms.service.TeacherNotificationService;

@Service
public class TeacherNotificationServiceImpl
        implements TeacherNotificationService {

    @Override
    public ApiResponse<List<TeacherNotificationResponse>> getNotifications(
            String username) {

        return ApiResponse
                .<List<TeacherNotificationResponse>>builder()
                .success(true)
                .message("Notifications fetched successfully")
                .data(Collections.emptyList())
                .build();
    }
}