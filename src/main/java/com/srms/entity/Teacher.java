package com.srms.entity;

import com.srms.enums.Gender;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String teacherCode;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String firstName;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String lastName;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Size(min = 10, max = 10)
    private String mobile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(length = 100)
    private String qualification;

    @Column(length = 100)
    private String designation;

    private Integer experience;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "profile_image")
    private String profileImage;

}