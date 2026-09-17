package com.srms.service;

public interface PasswordResetService {

    String forgotPassword(String email);

    void resetPassword(
            String token,
            String newPassword);
}