package com.srms.entity;

import java.time.LocalDate;

import com.srms.enums.Gender;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String rollNo;

    @Column(nullable = false, unique = true)
    private String enrollmentNo;

    @Column(name = "prnNo", unique = true, nullable = false)
    private Long prnNo;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "^[0-9]{10}$")
    private String mobile;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate dateOfBirth;

    private Integer admissionYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

}