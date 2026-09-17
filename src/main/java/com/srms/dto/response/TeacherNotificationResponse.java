package com.srms.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherNotificationResponse {

    private Long id;

    private String title;

    private String message;

    private String type;

    private boolean isRead;

    private LocalDateTime createdAt;
}