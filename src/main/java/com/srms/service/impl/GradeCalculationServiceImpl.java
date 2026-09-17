package com.srms.service.impl;

import org.springframework.stereotype.Service;

import com.srms.enums.DBATUGrade;
import com.srms.service.GradeCalculationService;

@Service
public class GradeCalculationServiceImpl
        implements GradeCalculationService {

    @Override
    public DBATUGrade calculateGrade(int totalMarks) {

        if (totalMarks >= 91) {
            return DBATUGrade.EX;

        } else if (totalMarks >= 86) {
            return DBATUGrade.AA;

        } else if (totalMarks >= 81) {
            return DBATUGrade.AB;

        } else if (totalMarks >= 76) {
            return DBATUGrade.BB;

        } else if (totalMarks >= 71) {
            return DBATUGrade.BC;

        } else if (totalMarks >= 66) {
            return DBATUGrade.CC;

        } else if (totalMarks >= 61) {
            return DBATUGrade.CD;

        } else if (totalMarks >= 56) {
            return DBATUGrade.DD;

        } else if (totalMarks >= 51) {
            return DBATUGrade.DE;

        } else if (totalMarks >= 40) {
            return DBATUGrade.EE;

        } else {
            return DBATUGrade.EF;
        }
    }

    @Override
    public double getGradePoint(DBATUGrade grade) {

        if (grade == null) {
            return 0.0;
        }

        return switch (grade) {

            case EX -> 10.0;
            case AA -> 9.0;
            case AB -> 8.5;
            case BB -> 8.0;
            case BC -> 7.5;
            case CC -> 7.0;
            case CD -> 6.5;
            case DD -> 6.0;
            case DE -> 5.5;
            case EE -> 5.0;
            case EF -> 0.0;
        };
    }
}