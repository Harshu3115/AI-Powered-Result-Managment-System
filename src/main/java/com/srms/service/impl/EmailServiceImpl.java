package com.srms.service.impl;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.srms.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

        private final JavaMailSender mailSender;

        private final SpringTemplateEngine templateEngine;

        private static final String FROM_NAME = "Student Result Management System";

        // =====================================================
        // SIMPLE EMAIL
        // =====================================================

        @Override
        public void sendSimpleEmail(
                        String to,
                        String subject,
                        String body) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);

                mailSender.send(message);
        }

        // =====================================================
        // RESULT GENERATED
        // =====================================================

        @Override
        public void sendResultGeneratedEmail(
                        String to,
                        String studentName,
                        Long resultId) {

                try {

                        Context context = new Context();

                        context.setVariable(
                                        "studentName",
                                        studentName);

                        context.setVariable(
                                        "resultId",
                                        resultId);

                        context.setVariable(
                                        "semester",
                                        "Semester Result");

                        context.setVariable(
                                        "resultUrl",
                                        "http://localhost:5173/student/results");

                        String htmlContent = templateEngine.process(
                                        "email/result-generated",
                                        context);

                        MimeMessage message = mailSender.createMimeMessage();

                        MimeMessageHelper helper = new MimeMessageHelper(
                                        message,
                                        true,
                                        StandardCharsets.UTF_8.name());

                        helper.setTo(to);

                        helper.setSubject(
                                        "Result Generated - SRMS");

                        helper.setText(
                                        htmlContent,
                                        true);

                        mailSender.send(message);

                } catch (MessagingException e) {

                        throw new RuntimeException(
                                        "Failed to send result generated email.",
                                        e);
                }
        }

        // =====================================================
        // RECHECKING APPLIED
        // =====================================================

        @Override
        public void sendRecheckingAppliedEmail(
                        String to,
                        String studentName,
                        List<String> subjectNames) {

                try {

                        Context context = new Context();

                        context.setVariable(
                                        "studentName",
                                        studentName);

                        context.setVariable(
                                        "subjectNames",
                                        subjectNames);

                        context.setVariable(
                                        "resultUrl",
                                        "http://localhost:5173/student/rechecking");

                        String htmlContent = templateEngine.process(
                                        "email/rechecking-applied",
                                        context);

                        MimeMessage message = mailSender.createMimeMessage();

                        MimeMessageHelper helper = new MimeMessageHelper(
                                        message,
                                        true,
                                        StandardCharsets.UTF_8.name());

                        helper.setTo(to);

                        helper.setSubject(
                                        "Rechecking Request Submitted - SRMS");

                        helper.setText(
                                        htmlContent,
                                        true);

                        mailSender.send(message);

                } catch (MessagingException e) {

                        throw new RuntimeException(
                                        "Failed to send rechecking applied email.",
                                        e);
                }
        }

        // =====================================================
        // RECHECKING ASSIGNED
        // =====================================================

        @Override
        public void sendRecheckingAssignedEmail(
                        String to,
                        String teacherName,
                        String studentName,
                        String subjectName) {

                try {

                        Context context = new Context();

                        context.setVariable(
                                        "teacherName",
                                        teacherName);

                        context.setVariable(
                                        "studentName",
                                        studentName);

                        context.setVariable(
                                        "subjectName",
                                        subjectName);

                        context.setVariable(
                                        "reviewUrl",
                                        "http://localhost:5173/teacher/rechecking");

                        String htmlContent = templateEngine.process(
                                        "email/rechecking-assigned",
                                        context);

                        MimeMessage message = mailSender.createMimeMessage();

                        MimeMessageHelper helper = new MimeMessageHelper(
                                        message,
                                        true,
                                        StandardCharsets.UTF_8.name());

                        helper.setTo(to);

                        helper.setSubject(
                                        "New Rechecking Request Assigned - SRMS");

                        helper.setText(
                                        htmlContent,
                                        true);

                        mailSender.send(message);

                } catch (MessagingException e) {

                        throw new RuntimeException(
                                        "Failed to send rechecking assigned email.",
                                        e);
                }
        }

        // =====================================================
        // RECHECKING APPROVED
        // =====================================================

        @Override
        public void sendRecheckingApprovedEmail(
                        String to,
                        String studentName,
                        String subjectName) {

                try {

                        Context context = new Context();

                        context.setVariable(
                                        "studentName",
                                        studentName);

                        context.setVariable(
                                        "subjectName",
                                        subjectName);

                        context.setVariable(
                                        "statusUrl",
                                        "http://localhost:5173/student/rechecking");

                        String htmlContent = templateEngine.process(
                                        "email/rechecking-approved",
                                        context);

                        MimeMessage message = mailSender.createMimeMessage();

                        MimeMessageHelper helper = new MimeMessageHelper(
                                        message,
                                        true,
                                        StandardCharsets.UTF_8.name());

                        helper.setTo(to);

                        helper.setSubject(
                                        "Rechecking Request Approved - SRMS");

                        helper.setText(
                                        htmlContent,
                                        true);

                        mailSender.send(message);

                } catch (MessagingException e) {

                        throw new RuntimeException(
                                        "Failed to send rechecking approved email.",
                                        e);
                }
        }

        // =====================================================
        // RECHECKING REJECTED
        // =====================================================

        @Override
        public void sendRecheckingRejectedEmail(
                        String to,
                        String studentName,
                        String subjectName,
                        String reason) {

                try {

                        Context context = new Context();

                        context.setVariable(
                                        "studentName",
                                        studentName);

                        context.setVariable(
                                        "subjectName",
                                        subjectName);

                        context.setVariable(
                                        "reason",
                                        reason);

                        context.setVariable(
                                        "statusUrl",
                                        "http://localhost:5173/student/rechecking");

                        String htmlContent = templateEngine.process(
                                        "email/rechecking-rejected",
                                        context);

                        MimeMessage message = mailSender.createMimeMessage();

                        MimeMessageHelper helper = new MimeMessageHelper(
                                        message,
                                        true,
                                        StandardCharsets.UTF_8.name());

                        helper.setTo(to);

                        helper.setSubject(
                                        "Rechecking Request Rejected - SRMS");

                        helper.setText(
                                        htmlContent,
                                        true);

                        mailSender.send(message);

                } catch (MessagingException e) {

                        throw new RuntimeException(
                                        "Failed to send rechecking rejected email.",
                                        e);
                }
        }

        // =====================================================
        // RECHECKING COMPLETED - HTML EMAIL
        // =====================================================

        @Override
        public void sendRecheckingCompletedEmail(
                        String to,
                        String studentName,
                        String subjectName,
                        Integer oldMarks,
                        Integer newMarks) {

                try {

                        // Create Thymeleaf context
                        Context context = new Context();

                        // Dynamic values
                        context.setVariable(
                                        "systemName",
                                        "Student Result Management System");

                        context.setVariable(
                                        "emailTitle",
                                        "Result Notification");

                        context.setVariable(
                                        "heading",
                                        "Rechecking Completed");

                        context.setVariable(
                                        "studentName",
                                        studentName);

                        context.setVariable(
                                        "subjectName",
                                        subjectName);

                        context.setVariable(
                                        "oldMarks",
                                        oldMarks);

                        context.setVariable(
                                        "newMarks",
                                        newMarks);

                        context.setVariable(
                                        "status",
                                        "COMPLETED");

                        context.setVariable(
                                        "message",
                                        "Your external marks rechecking request "
                                                        + "has been completed successfully.");

                        context.setVariable(
                                        "resultMessage",
                                        "Your semester result has been recalculated "
                                                        + "based on the updated external marks.");

                        context.setVariable(
                                        "loginMessage",
                                        "You can now log in to the Student Result "
                                                        + "Management System to view your updated "
                                                        + "result and download your updated marksheet.");

                        context.setVariable(
                                        "resultUrl",
                                        "http://localhost:5173/student/results");

                        context.setVariable(
                                        "automatedMessage",
                                        "This is an automated email generated by "
                                                        + "the Student Result Management System. "
                                                        + "Please do not reply to this email.");

                        context.setVariable(
                                        "footerText",
                                        "© 2026 Student Result Management System");

                        context.setVariable(
                                        "universityName",
                                        "DBATU Result Management System");

                        // Process HTML template
                        String htmlContent = templateEngine.process(
                                        "email/rechecking-completed",
                                        context);

                        // Create MIME email
                        MimeMessage message = mailSender.createMimeMessage();

                        MimeMessageHelper helper = new MimeMessageHelper(
                                        message,
                                        true,
                                        StandardCharsets.UTF_8.name());

                        helper.setTo(to);

                        helper.setSubject(
                                        "Rechecking Completed - Result Updated - SRMS");

                        // true = HTML
                        helper.setText(
                                        htmlContent,
                                        true);

                        // Send email
                        mailSender.send(message);

                } catch (MessagingException e) {

                        throw new RuntimeException(
                                        "Failed to send rechecking completed email.",
                                        e);
                }
        }

        @Override
        public void sendPasswordResetEmail(
                        String to,
                        String username,
                        String token) {

                try {

                        String resetUrl = "http://localhost:5173/reset-password?token="
                                        + token;

                        Context context = new Context();

                        context.setVariable(
                                        "username",
                                        username);

                        context.setVariable(
                                        "resetUrl",
                                        resetUrl);

                        String htmlContent = templateEngine.process(
                                        "email/password-reset",
                                        context);

                        MimeMessage message = mailSender.createMimeMessage();

                        MimeMessageHelper helper = new MimeMessageHelper(
                                        message,
                                        true,
                                        "UTF-8");

                        helper.setTo(to);

                        helper.setSubject(
                                        "Reset Your Password - SRMS");

                        helper.setText(
                                        htmlContent,
                                        true);

                        mailSender.send(message);

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Failed to send password reset email.",
                                        e);
                }
        }

}