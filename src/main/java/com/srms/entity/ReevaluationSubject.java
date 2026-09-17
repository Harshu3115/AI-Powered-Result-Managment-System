package com.srms.entity;

import java.time.LocalDateTime;

import com.srms.enums.ReevaluationResult;
import com.srms.enums.ReevaluationStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reevaluation_subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReevaluationSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // PARENT REEVALUATION REQUEST
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reevaluation_request_id", nullable = false)
    private ReevaluationRequest reevaluationRequest;

    // =========================================================
    // EXISTING RESULT SUBJECT
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_subject_id", nullable = false)
    private ResultSubject resultSubject;

    // =========================================================
    // TEACHER ASSIGNED
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    // =========================================================
    // ORIGINAL MARKS
    // =========================================================

    @Column(nullable = false)
    private Integer oldMarks;

    // =========================================================
    // MARKS AFTER REEVALUATION
    // =========================================================

    private Integer newMarks;

    // =========================================================
    // INDIVIDUAL SUBJECT STATUS
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReevaluationStatus status = ReevaluationStatus.PENDING;

    // =========================================================
    // TEACHER REVIEW RESULT
    // =========================================================

    @Enumerated(EnumType.STRING)
    private ReevaluationResult reviewResult;

    // =========================================================
    // TEACHER MESSAGE
    // =========================================================

    @Column(length = 1000)
    private String teacherMessage;

    // =========================================================
    // REVIEW DATE
    // =========================================================

    private LocalDateTime reviewedAt;
}