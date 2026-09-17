package com.srms.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.srms.enums.ExamType;
import com.srms.enums.RecheckingStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rechecking_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecheckingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student who submitted the application
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

    // Overall application status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RecheckingStatus status = RecheckingStatus.PENDING;

    private LocalDateTime appliedAt;

    private LocalDateTime reviewedAt;

    // Multiple subjects in one application
    @OneToMany(mappedBy = "recheckingRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RecheckingSubject> subjects = new ArrayList<>();

}