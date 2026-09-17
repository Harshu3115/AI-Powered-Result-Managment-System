package com.srms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Department;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    boolean existsByDepartmentCode(String departmentCode);

    Optional<Department> findByDepartmentCode(String departmentCode);

    Optional<Department> findByDepartmentName(String departmentName);
}