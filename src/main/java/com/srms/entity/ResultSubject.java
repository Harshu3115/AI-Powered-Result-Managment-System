package com.srms.entity;

import com.srms.enums.DBATUGrade;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "result_subjects", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "result_id", "subject_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    private Result result;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false)
    private Integer credits;

    @Column(nullable = false)
    private Integer totalMarks;

    @Column(nullable = false)
    private Integer obtainedMarks;

    @Column(nullable = false)
    private Double percentage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DBATUGrade grade;

    @Column(nullable = false)
    private Double gradePoint;
}