package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.request.DepartmentRequest;
import com.srms.dto.response.DepartmentResponse;
import com.srms.entity.Department;

@Component
public class DepartmentMapper {

    public Department toEntity(DepartmentRequest request) {

        return Department.builder()
                .departmentCode(request.getDepartmentCode())
                .departmentName(request.getDepartmentName())
                .description(request.getDescription())
                .build();
    }

    public DepartmentResponse toResponse(Department department) {

        return DepartmentResponse.builder()
                .id(department.getId())
                .departmentCode(department.getDepartmentCode())
                .departmentName(department.getDepartmentName())
                .description(department.getDescription())
                .build();
    }

}