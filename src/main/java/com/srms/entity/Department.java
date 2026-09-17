package com.srms.entity;

import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Department code is required")
    @Column(unique = true, nullable = false, length = 20)
    private String departmentCode;

    @NotBlank(message = "Department name is required")
    @Column(nullable = false, length = 100)
    private String departmentName;

    @Column(length = 255)
    private String description;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Course> courses;
}