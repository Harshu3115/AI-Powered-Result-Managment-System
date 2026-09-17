package com.srms.service;

import java.util.List;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.internet.MimeMessage;

public interface EmailService {

        void sendSimpleEmail(
                        String to,
                        String subject,
                        String body);

        void sendResultGeneratedEmail(
                        String to,
                        String studentName,
                        Long resultId);

        void sendRecheckingAppliedEmail(
                        String to,
                        String studentName,
                        List<String> subjectNames);

        void sendRecheckingAssignedEmail(
                        String to,
                        String teacherName,
                        String studentName,
                        String subjectName);

        void sendRecheckingApprovedEmail(
                        String to,
                        String studentName,
                        String subjectName);

        void sendRecheckingRejectedEmail(
                        String to,
                        String studentName,
                        String subjectName,
                        String reason);

        void sendRecheckingCompletedEmail(
                        String to,
                        String studentName,
                        String subjectName,
                        Integer oldMarks,
                        Integer newMarks);

        void sendPasswordResetEmail(
                        String to,
                        String username,
                        String token);
}