package com.srms.service;

import com.srms.dto.response.ApiResponse;
import java.util.Map;

public interface AdminPerformanceService {

    ApiResponse<Map<String, Object>> getPerformance();
}