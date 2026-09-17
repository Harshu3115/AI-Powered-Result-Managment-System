package com.srms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 500)
    private String message;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 50)
    private String type;
}