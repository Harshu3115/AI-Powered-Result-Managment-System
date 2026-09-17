package com.srms.ai.service;

import com.srms.ai.dto.response.TeacherAiStatisticsResponse;

public interface TeacherAiStatisticsService {

    TeacherAiStatisticsResponse generateStatistics(
            String username);
}