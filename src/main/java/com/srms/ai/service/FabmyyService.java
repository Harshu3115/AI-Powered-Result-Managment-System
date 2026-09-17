package com.srms.ai.service;

import com.srms.ai.dto.response.AiChatResponse;
import com.srms.dto.response.ApiResponse;

public interface FabmyyService {

    ApiResponse<AiChatResponse> chat(
            String username,
            String question);
}