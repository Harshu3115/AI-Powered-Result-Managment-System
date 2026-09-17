package com.srms.entity;

import java.util.ArrayList;
import java.util.List;

import com.srms.enums.ExamMode;
import com.srms.enums.ResultStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "results", uniqueConstraints = {
                @UniqueConstraint(columnNames = {
                                "student_id",
                                "semester_id"
                })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result {

        // =========================================================
        // PRIMARY KEY
        // =========================================================
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        // =========================================================
        // STUDENT
        // =========================================================
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "student_id", nullable = false)
        private Student student;

        // =========================================================
        // SEMESTER
        // =========================================================
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "semester_id", nullable = false)
        private Semester semester;

        // =========================================================
        // TOTAL MARKS
        // =========================================================
        @Column(nullable = false)
        private Integer totalMarks;

        // =========================================================
        // OBTAINED MARKS
        // =========================================================
        @Column(nullable = false)
        private Integer obtainedMarks;

        // =========================================================
        // PERCENTAGE
        // =========================================================
        @Column(nullable = false)
        private Double percentage;

        // =========================================================
        // SGPA
        // =========================================================
        @Column(nullable = false)
        private Double sgpa;

        @Column(name = "cgpa_percentage")
        private Double cgpaPercentage;

        // =========================================================
        // RESULT STATUS
        // =========================================================
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private ResultStatus resultStatus;

        // =========================================================
        // RESULT SUBJECTS
        // =========================================================
        @OneToMany(mappedBy = "result", cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        private List<ResultSubject> resultSubjects = new ArrayList<>();

        @Enumerated(EnumType.STRING)
        @Column(name = "exam_mode", nullable = false)
        private ExamMode examMode;
}