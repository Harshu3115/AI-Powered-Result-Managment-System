package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test/email")
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;

    @PostMapping("/rechecking-completed")
    public ResponseEntity<String> testRecheckingCompletedEmail(
            @RequestParam String to) {

        emailService.sendRecheckingCompletedEmail(
                to,
                "Harshad Shinde",
                "Internet of Things",
                33,
                40);

        return ResponseEntity.ok(
                "Rechecking completed test email sent successfully.");
    }

    @PostMapping("/rechecking-applied")
    public ResponseEntity<String> testRecheckingAppliedEmail(
            @RequestParam String to) {

        emailService.sendRecheckingAppliedEmail(
                to,
                "Harshad Shinde",
                List.of(
                        "Internet of Things",
                        "Consumer Behaviour"));

        return ResponseEntity.ok(
                "Rechecking applied email sent successfully.");
    }

    @PostMapping("/rechecking-assigned")
    public ResponseEntity<String> testRecheckingAssignedEmail(
            @RequestParam String to) {

        emailService.sendRecheckingAssignedEmail(
                to,
                "Tanaji Dhaigude",
                "Harshad Shinde",
                "Internet of Things");

        return ResponseEntity.ok(
                "Rechecking assigned email sent successfully.");
    }

    @PostMapping("/rechecking-approved")
    public ResponseEntity<String> testRecheckingApprovedEmail(
            @RequestParam String to) {

        emailService.sendRecheckingApprovedEmail(
                to,
                "Harshad Shinde",
                "Internet of Things");

        return ResponseEntity.ok(
                "Rechecking approved email sent successfully.");
    }

    @PostMapping("/rechecking-rejected")
    public ResponseEntity<String> testRecheckingRejectedEmail(
            @RequestParam String to) {

        emailService.sendRecheckingRejectedEmail(
                to,
                "Harshad Shinde",
                "Internet of Things",
                "The submitted rechecking request does not meet "
                        + "the eligibility criteria.");

        return ResponseEntity.ok(
                "Rechecking rejected email sent successfully.");
    }

    @PostMapping("/result-generated")
    public ResponseEntity<String> testResultGeneratedEmail(
            @RequestParam String to) {

        emailService.sendResultGeneratedEmail(
                to,
                "Harshad Shinde",
                1L);

        return ResponseEntity.ok(
                "Result generated email sent successfully.");
    }
}