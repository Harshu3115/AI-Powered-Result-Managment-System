package com.srms.service;

import com.srms.enums.DBATUGrade;

public interface GradeCalculationService {

    DBATUGrade calculateGrade(int totalMarks);

    double getGradePoint(DBATUGrade grade);
}