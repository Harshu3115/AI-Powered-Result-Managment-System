package com.srms.entity;

import java.time.LocalDateTime;

import com.srms.enums.RecheckingResult;
import com.srms.enums.RecheckingStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rechecking_subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecheckingSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Parent application
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rechecking_request_id", nullable = false)
    private RecheckingRequest recheckingRequest;

    // Existing result subject
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_subject_id", nullable = false)
    private ResultSubject resultSubject;

    // Teacher assigned to this subject
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    // Marks before rechecking
    @Column(nullable = false)
    private Integer oldMarks;

    // Marks after teacher checks
    private Integer newMarks;

    // Individual subject status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RecheckingStatus status = RecheckingStatus.PENDING;

    // Result of teacher's checking
    @Enumerated(EnumType.STRING)
    private RecheckingResult reviewResult;

    // Message written by teacher
    @Column(length = 1000)
    private String teacherMessage;

    private LocalDateTime reviewedAt;
}