package com.srms.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srms.entity.PasswordResetToken;
import com.srms.entity.User;
import com.srms.exception.ResourceNotFoundException;
import com.srms.repository.PasswordResetTokenRepository;
import com.srms.repository.UserRepository;
import com.srms.service.EmailService;
import com.srms.service.PasswordResetService;
import java.util.Optional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl
                implements PasswordResetService {

        private final UserRepository userRepository;

        private final PasswordResetTokenRepository passwordResetTokenRepository;

        private final PasswordEncoder passwordEncoder;

        private final EmailService emailService;

        // Token validity: 15 minutes
        private static final long TOKEN_VALIDITY_MINUTES = 15;

        @Override
        @Transactional
        public String forgotPassword(String email) {

                // 1. Find user
                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "No account found with this email."));

                // 2. Check existing token
                Optional<PasswordResetToken> existingToken = passwordResetTokenRepository.findByUser(user);

                if (existingToken.isPresent()) {

                        PasswordResetToken resetToken = existingToken.get();

                        // 3. If active token already exists,
                        // do not send another email
                        if (!Boolean.TRUE.equals(resetToken.getUsed())
                                        && resetToken.getExpiryDate()
                                                        .isAfter(LocalDateTime.now())) {

                                return "Password reset link has already been sent. "
                                                + "Please check your email.";
                        }

                        // 4. Existing token is expired or used
                        // Reuse the same database row

                        String newToken = UUID.randomUUID().toString();

                        LocalDateTime expiryDate = LocalDateTime.now()
                                        .plusMinutes(
                                                        TOKEN_VALIDITY_MINUTES);

                        resetToken.setToken(newToken);
                        resetToken.setExpiryDate(expiryDate);
                        resetToken.setUsed(false);

                        passwordResetTokenRepository.save(
                                        resetToken);

                        emailService.sendPasswordResetEmail(
                                        user.getEmail(),
                                        user.getUsername(),
                                        newToken);

                        return "Password reset link sent successfully.";
                }

                // 5. No existing token - create first token

                String token = UUID.randomUUID().toString();

                LocalDateTime expiryDate = LocalDateTime.now()
                                .plusMinutes(
                                                TOKEN_VALIDITY_MINUTES);

                PasswordResetToken resetToken = PasswordResetToken.builder()
                                .user(user)
                                .token(token)
                                .expiryDate(expiryDate)
                                .used(false)
                                .build();

                passwordResetTokenRepository.save(
                                resetToken);

                // 6. Send email
                emailService.sendPasswordResetEmail(
                                user.getEmail(),
                                user.getUsername(),
                                token);

                return "Password reset link sent successfully.";
        }

        @Override
        @Transactional
        public void resetPassword(
                        String token,
                        String newPassword) {

                // 1. Find token
                PasswordResetToken resetToken = passwordResetTokenRepository
                                .findByToken(token)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid password reset token."));

                // 2. Check if already used
                if (Boolean.TRUE.equals(
                                resetToken.getUsed())) {

                        throw new IllegalArgumentException(
                                        "Password reset token has already been used.");
                }

                // 3. Check expiry
                if (resetToken.getExpiryDate()
                                .isBefore(LocalDateTime.now())) {

                        throw new IllegalArgumentException(
                                        "Password reset token has expired.");
                }

                // 4. Get user
                User user = resetToken.getUser();

                // 5. Encode new password
                user.setPassword(
                                passwordEncoder.encode(
                                                newPassword));

                // 6. Save updated user
                userRepository.save(user);

                // 7. Invalidate token
                resetToken.setUsed(true);

                passwordResetTokenRepository.save(
                                resetToken);
        }
}