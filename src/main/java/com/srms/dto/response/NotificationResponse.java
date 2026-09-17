package com.srms.dto.response;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;

    private String title;

    private String message;

    private Boolean isRead;

    private String type;

    private LocalDateTime createdAt;
}