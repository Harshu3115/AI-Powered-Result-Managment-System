package com.srms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.PasswordResetToken;
import com.srms.entity.User;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);
}