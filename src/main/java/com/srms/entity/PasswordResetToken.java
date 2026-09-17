package com.srms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User requesting password reset
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Secure random token
    @Column(nullable = false, unique = true, length = 255)
    private String token;

    // Token expiration time
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // Whether token has already been used
    @Column(nullable = false)
    @Builder.Default
    private Boolean used = false;
}