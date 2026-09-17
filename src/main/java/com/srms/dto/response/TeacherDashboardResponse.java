package com.srms.dto.response;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherDashboardResponse {

    private Long teacherId;

    private String teacherName;

    private String email;

    private String departmentName;

    private Integer totalSubjects;

    private Integer pendingRechecking;

    private Integer completedRechecking;

    private List<AssignedSubjectResponse> assignedSubjects;

    private List<RecheckingSubjectResponse> recheckingRequests;
}