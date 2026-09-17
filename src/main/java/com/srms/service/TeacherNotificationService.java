package com.srms.service;

import java.util.Collections;
import java.util.List;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.TeacherNotificationResponse;

public interface TeacherNotificationService {

    ApiResponse<List<TeacherNotificationResponse>> getNotifications(
            String username);
}