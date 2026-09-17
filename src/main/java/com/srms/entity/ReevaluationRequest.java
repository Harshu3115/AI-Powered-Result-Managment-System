package com.srms.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.srms.enums.ExamType;
import com.srms.enums.ReevaluationStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reevaluation_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReevaluationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student who submitted the request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Exam type
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamType examType;

    // Reason provided by student
    @Column(nullable = false, length = 500)
    private String reason;

    // Overall request status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReevaluationStatus status = ReevaluationStatus.PENDING;

    // Application date/time
    private LocalDateTime appliedAt;

    // Review completion date/time
    private LocalDateTime reviewedAt;

    // Subjects included in this request
    @OneToMany(mappedBy = "reevaluationRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReevaluationSubject> subjects = new ArrayList<>();
}