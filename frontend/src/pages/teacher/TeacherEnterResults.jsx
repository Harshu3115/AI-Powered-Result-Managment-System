import React, { useEffect, useMemo, useState } from "react";
import {
    Save,
    Search,
    ClipboardList,
    BookOpen,
    Users,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";

import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";
import teacherService from "../../services/teacherService";

const TeacherEnterResults = () => {

    // =========================================================
    // SIDEBAR
    // =========================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // =========================================================
    // DATA
    // =========================================================

    const [dashboardData, setDashboardData] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    const [semesters, setSemesters] = useState([]);

    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response =
                    await teacherService.getDashboard();

                console.log(
                    "Teacher Dashboard:",
                    response
                );

                if (response?.data) {
                    setDashboardData(response.data);
                }

            } catch (err) {
                console.error(
                    "Teacher Dashboard Error:",
                    err
                );
            }
        };

        loadDashboard();
    }, []);

    // =========================================================
    // LOAD SUBJECTS
    // =========================================================

    useEffect(() => {
        const loadSubjects = async () => {

            try {

                const response =
                    await teacherService.getSubjects();

                console.log(
                    "Teacher Subjects:",
                    response
                );

                console.table(response?.data);

                const subjectData =
                    response?.data || [];

                setSubjects(subjectData);

                const semesterMap = new Map();

                subjectData.forEach((subject) => {
                    const semesterName = subject.semesterName;

                    if (semesterName) {
                        semesterMap.set(
                            semesterName,
                            {
                                id: semesterName,
                                name: semesterName,
                            }
                        );
                    }
                });

                setSemesters(
                    Array.from(semesterMap.values())
                );

            } catch (err) {

                console.error(
                    "Teacher Subjects Error:",
                    err
                );

                setError(
                    "Unable to load subjects."
                );
            }
        };

        loadSubjects();

    }, []);

    // =========================================================
    // FILTER SUBJECTS BY SEMESTER
    // =========================================================

    const filteredSubjects = useMemo(() => {

        if (!selectedSemester) {
            return subjects;
        }

        return subjects.filter(
            (subject) =>
                subject.semesterName === selectedSemester
        );

    }, [
        subjects,
        selectedSemester,
    ]);

    // =========================================================
    // LOAD STUDENTS
    // =========================================================

    useEffect(() => {
        const loadStudents = async () => {

            if (!selectedSemester) {
                setStudents([]);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await teacherService.getStudents();

                console.log("Teacher Students API:", response);

                const studentData =
                    response?.data || [];

                console.table(studentData);

                // Normalize selected semester
                const selectedSemesterNormalized =
                    String(selectedSemester)
                        .trim()
                        .toLowerCase();

                const semesterStudents =
                    studentData.filter((student) => {

                        const studentSemester =
                            String(
                                student.semesterName ??
                                student.semester ??
                                ""
                            )
                                .trim()
                                .toLowerCase();

                        const studentSemesterId =
                            String(
                                student.semesterId ??
                                ""
                            );

                        console.log(
                            "Student:",
                            student.studentName,
                            "Semester:",
                            studentSemester,
                            "Semester ID:",
                            studentSemesterId
                        );

                        return (
                            studentSemester ===
                            selectedSemesterNormalized
                        );
                    });

                console.log(
                    "Filtered Students:",
                    semesterStudents
                );

                setStudents(
                    semesterStudents.map((student) => ({
                        ...student,

                        internalMarks:
                            student.internalMarks ?? "",

                        externalMarks:
                            student.externalMarks ?? "",

                        totalMarks:
                            student.totalMarks ?? "",

                        grade:
                            student.grade ?? "",

                        resultStatus:
                            student.resultStatus ?? "",
                    }))
                );

            } catch (err) {

                console.error(
                    "Teacher Students Error:",
                    err
                );

                setError(
                    "Unable to load students."
                );

            } finally {
                setLoading(false);
            }
        };

        loadStudents();

    }, [selectedSemester]);

    // =========================================================
    // SELECT DEFAULT SUBJECT
    // =========================================================

    useEffect(() => {

        if (filteredSubjects.length > 0) {

            const exists =
                filteredSubjects.some(
                    (subject) =>
                        String(subject.subjectId) ===
                        String(selectedSubject)
                );

            if (!exists) {
                setSelectedSubject(
                    String(filteredSubjects[0].subjectId)
                );
            }

        } else {
            setSelectedSubject("");
        }

    }, [
        filteredSubjects,
        selectedSubject,
    ]);

    // =========================================================
    // MARKS CALCULATION
    // =========================================================

    const calculateResult = (internal, external) => {
        const internalMarks = Number(internal) || 0;
        const externalMarks = Number(external) || 0;

        const total = internalMarks + externalMarks;

        let grade;
        let gradePoint;

        if (total >= 91) {
            grade = "EX";
            gradePoint = 10.0;
        } else if (total >= 86) {
            grade = "AA";
            gradePoint = 9.0;
        } else if (total >= 81) {
            grade = "AB";
            gradePoint = 8.5;
        } else if (total >= 76) {
            grade = "BB";
            gradePoint = 8.0;
        } else if (total >= 71) {
            grade = "BC";
            gradePoint = 7.5;
        } else if (total >= 66) {
            grade = "CC";
            gradePoint = 7.0;
        } else if (total >= 61) {
            grade = "CD";
            gradePoint = 6.5;
        } else if (total >= 56) {
            grade = "DD";
            gradePoint = 6.0;
        } else if (total >= 51) {
            grade = "DE";
            gradePoint = 5.5;
        } else if (total >= 40) {
            grade = "EE";
            gradePoint = 5.0;
        } else {
            grade = "EF";
            gradePoint = 0.0;
        }

        const resultStatus =
            total >= 40
                ? "PASS"
                : "FAIL";

        return {
            total,
            grade,
            gradePoint,
            resultStatus,
        };
    };

    // =========================================================
    // UPDATE MARKS
    // =========================================================

    // =========================================================
    // UPDATE MARKS
    // =========================================================

    const handleMarksChange = (
        studentId,
        field,
        value
    ) => {

        // Allow only numbers
        if (
            value !== "" &&
            !/^\d*$/.test(value)
        ) {
            return;
        }

        // Get selected subject
        const subjectType =
            selectedSubjectData?.subjectType;

        // Practical = 60 Internal + 40 External
        // Theory   = 40 Internal + 60 External
        const maxMarks =
            subjectType === "PRACTICAL"
                ? field === "internalMarks"
                    ? 60
                    : 40
                : field === "internalMarks"
                    ? 40
                    : 60;

        // Prevent marks greater than maximum
        if (
            value !== "" &&
            Number(value) > maxMarks
        ) {
            return;
        }

        const numericValue =
            value === ""
                ? ""
                : Number(value);

        setStudents((prev) =>
            prev.map((student) => {

                if (
                    student.studentId !== studentId
                ) {
                    return student;
                }

                const updated = {
                    ...student,
                    [field]: numericValue,
                };

                const result =
                    calculateResult(
                        updated.internalMarks,
                        updated.externalMarks
                    );

                return {
                    ...updated,

                    totalMarks:
                        updated.internalMarks === "" &&
                            updated.externalMarks === ""
                            ? ""
                            : result.total,

                    grade:
                        updated.internalMarks === "" &&
                            updated.externalMarks === ""
                            ? ""
                            : result.grade,

                    resultStatus:
                        updated.internalMarks === "" &&
                            updated.externalMarks === ""
                            ? ""
                            : result.resultStatus,
                };
            })
        );
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredStudents =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return students;
            }

            return students.filter(
                (student) =>
                    String(
                        student.prnNo ?? ""
                    )
                        .toLowerCase()
                        .includes(query) ||

                    String(
                        student.rollNo ?? ""
                    )
                        .toLowerCase()
                        .includes(query) ||

                    String(
                        student.studentName ?? ""
                    )
                        .toLowerCase()
                        .includes(query)
            );

        }, [
            students,
            search,
        ]);

    // =========================================================
    // SAVE RESULTS
    // =========================================================

    const handleSaveResults = async () => {

        if (!selectedSemester) {
            setError(
                "Please select a semester."
            );
            return;
        }

        if (!selectedSubject) {
            setError(
                "Please select a subject."
            );
            return;
        }

        if (students.length === 0) {
            setError(
                "No students found."
            );
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const payload =
                students.map((student) => {

                    const result =
                        calculateResult(
                            student.internalMarks,
                            student.externalMarks
                        );

                    return {
                        studentId:
                            student.studentId,

                        subjectId:
                            selectedSubject,

                        internalMarks:
                            Number(
                                student.internalMarks || 0
                            ),

                        externalMarks:
                            Number(
                                student.externalMarks || 0
                            ),

                        subjectType: selectedSubjectData?.subjectType,
                        totalMarks:
                            result.total,

                        grade:
                            result.grade,

                        resultStatus:
                            result.resultStatus,
                    };
                });

            console.log(
                "Saving Results:",
                payload
            );

            await teacherService.saveResults(
                payload
            );

            setSuccess(
                "Results saved successfully."
            );

        } catch (err) {

            console.error(
                "Save Results Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to save results."
            );

        } finally {

            setSaving(false);
        }
    };

    // =========================================================
    // SELECTED SUBJECT
    // =========================================================

    const selectedSubjectData =
        filteredSubjects.find(
            (subject) =>
                String(subject.subjectId) ===
                String(selectedSubject)
        );

    // =========================================================
    // UI
    // =========================================================

    return (
        <>

            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <TeacherSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
                collapsed={
                    sidebarCollapsed
                }
            />

            {/* ================================================= */}
            {/* MAIN WRAPPER */}
            {/* ================================================= */}

            <div
                className={`
                    min-h-screen
                    transition-all
                    duration-300
                    ${sidebarCollapsed
                        ? "lg:pl-20"
                        : "lg:pl-72"
                    }
                `}
            >

                {/* ================================================= */}
                {/* TOPBAR */}
                {/* ================================================= */}

                <TeacherTopbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    onSidebarToggle={() =>
                        setSidebarCollapsed(
                            (prev) => !prev
                        )
                    }
                    sidebarCollapsed={
                        sidebarCollapsed
                    }
                    dashboardData={
                        dashboardData
                    }

                />

                {/* ================================================= */}
                {/* PAGE */}
                {/* ================================================= */}

                <main className="min-h-screen pt-[72px]">

                    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">

                        {/* HEADER */}

                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Enter Results
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter and manage student marks
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleSaveResults
                                }
                                disabled={
                                    saving ||
                                    !selectedSubject ||
                                    students.length === 0
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-indigo-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-indigo-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {saving ? (
                                    <>
                                        <Loader2
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />

                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save
                                            className="h-4 w-4"
                                        />

                                        Save Results
                                    </>
                                )}

                            </button>

                        </div>

                        {/* SUCCESS */}

                        {success && (
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-emerald-200
                                    bg-emerald-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-emerald-700
                                "
                            >

                                <CheckCircle
                                    className="h-5 w-5"
                                />

                                {success}

                            </div>
                        )}

                        {/* ERROR */}

                        {error && (
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-red-700
                                "
                            >

                                <AlertCircle
                                    className="h-5 w-5"
                                />

                                {error}

                            </div>
                        )}

                        {/* ================================================= */}
                        {/* FILTER CARD */}
                        {/* ================================================= */}

                        <div
                            className="
                                mb-6
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <div className="grid gap-5 md:grid-cols-3">

                                {/* SEMESTER */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Semester
                                    </label>

                                    <div className="relative">

                                        <ClipboardList
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                h-5
                                                w-5
                                                -translate-y-1/2
                                                text-slate-400
                                            "
                                        />

                                        <select
                                            value={
                                                selectedSemester
                                            }
                                            onChange={(e) =>
                                                setSelectedSemester(
                                                    e.target.value
                                                )
                                            }
                                            className="
                                                w-full
                                                appearance-none
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-white
                                                py-3
                                                pl-11
                                                pr-4
                                                text-sm
                                                text-slate-700
                                                outline-none
                                                focus:border-indigo-500
                                                focus:ring-2
                                                focus:ring-indigo-100
                                            "
                                        >

                                            <option value="">
                                                Select Semester
                                            </option>

                                            {semesters.map((semester, index) => (
                                                <option
                                                    key={`semester-${semester.id ?? index}`}
                                                    value={semester.id}
                                                >
                                                    {semester.name}
                                                </option>
                                            ))}

                                        </select>

                                    </div>

                                </div>

                                {/* SUBJECT */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Subject
                                    </label>

                                    <div className="relative">

                                        <BookOpen
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                h-5
                                                w-5
                                                -translate-y-1/2
                                                text-slate-400
                                            "
                                        />

                                        <select
                                            value={
                                                selectedSubject
                                            }
                                            onChange={(e) =>
                                                setSelectedSubject(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                !selectedSemester
                                            }
                                            className="
                                                w-full
                                                appearance-none
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-white
                                                py-3
                                                pl-11
                                                pr-4
                                                text-sm
                                                text-slate-700
                                                outline-none
                                                focus:border-indigo-500
                                                focus:ring-2
                                                focus:ring-indigo-100
                                                disabled:bg-slate-50
                                                disabled:text-slate-400
                                            "
                                        >

                                            <option value="">
                                                Select Subject
                                            </option>

                                            {filteredSubjects.map((subject) => (
                                                <option
                                                    key={`subject-${subject.subjectId}`}
                                                    value={subject.subjectId}
                                                >
                                                    {subject.subjectName}
                                                </option>
                                            ))}

                                        </select>

                                    </div>

                                </div>

                                {/* SEARCH */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Search Student
                                    </label>

                                    <div className="relative">

                                        <Search
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                h-5
                                                w-5
                                                -translate-y-1/2
                                                text-slate-400
                                            "
                                        />

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="PRN, roll no or student name..."
                                            className="
                                                w-full
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-white
                                                py-3
                                                pl-11
                                                pr-4
                                                text-sm
                                                outline-none
                                                placeholder:text-slate-400
                                                focus:border-indigo-500
                                                focus:ring-2
                                                focus:ring-indigo-100
                                            "
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ================================================= */}
                        {/* SUBJECT INFORMATION */}
                        {/* ================================================= */}

                        {selectedSubjectData && (
                            <div
                                className="
                                    mb-6
                                    flex
                                    flex-col
                                    gap-4
                                    rounded-2xl
                                    border
                                    border-indigo-100
                                    bg-indigo-50
                                    p-5
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                                        Selected Subject
                                    </p>

                                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                                        {
                                            selectedSubjectData.subjectName
                                        }
                                    </h2>

                                    {selectedSubjectData.code && (
                                        <p className="mt-1 text-sm text-slate-500">
                                            Code:{" "}
                                            {
                                                selectedSubjectData.subjectCode
                                            }
                                        </p>
                                    )}

                                </div>

                                <div className="flex items-center gap-2">

                                    <Users className="h-5 w-5 text-indigo-500" />

                                    <span className="text-sm font-semibold text-slate-700">
                                        {
                                            students.length
                                        }{" "}
                                        Students
                                    </span>

                                </div>

                            </div>
                        )}

                        {/* ================================================= */}
                        {/* RESULTS TABLE */}
                        {/* ================================================= */}

                        <div
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-2
                                    border-b
                                    border-slate-200
                                    px-5
                                    py-5
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Student Marks
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Showing{" "}
                                        <span className="font-semibold text-slate-700">
                                            {
                                                filteredStudents.length
                                            }
                                        </span>{" "}
                                        students
                                    </p>

                                </div>

                            </div>

                            {loading ? (

                                <div className="flex min-h-[300px] items-center justify-center">

                                    <div className="flex items-center gap-3 text-sm text-slate-500">

                                        <Loader2
                                            className="
                                                h-5
                                                w-5
                                                animate-spin
                                                text-indigo-600
                                            "
                                        />

                                        Loading students...

                                    </div>

                                </div>

                            ) : filteredStudents.length === 0 ? (

                                <div
                                    className="
                                        flex
                                        min-h-[300px]
                                        flex-col
                                        items-center
                                        justify-center
                                        px-6
                                        text-center
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-slate-100
                                        "
                                    >

                                        <Users
                                            className="
                                                h-7
                                                w-7
                                                text-slate-400
                                            "
                                        />

                                    </div>

                                    <h3 className="mt-4 font-semibold text-slate-800">
                                        No students found
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Select a semester and subject to enter marks.
                                    </p>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="min-w-[1100px] w-full text-left">

                                        <thead>

                                            <tr
                                                className="
                                                    border-b
                                                    border-slate-200
                                                    bg-slate-50
                                                "
                                            >

                                                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    PRN No
                                                </th>

                                                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    Student
                                                </th>

                                                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    Internal
                                                    <span className="mt-1 block text-[10px] font-normal normal-case">
                                                        / {selectedSubjectData?.subjectType === "PRACTICAL" ? 60 : 40}
                                                    </span>
                                                </th>

                                                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    External
                                                    <span className="mt-1 block text-[10px] font-normal normal-case">
                                                        / {selectedSubjectData?.subjectType === "PRACTICAL" ? 40 : 60}
                                                    </span>
                                                </th>

                                                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    Total
                                                    <span className="mt-1 block text-[10px] font-normal normal-case">
                                                        / 100
                                                    </span>
                                                </th>

                                                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    Grade
                                                </th>

                                                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {filteredStudents.map(
                                                (student) => {

                                                    const currentStudent =
                                                        students.find(
                                                            (item) =>
                                                                item.studentId ===
                                                                student.studentId
                                                        );

                                                    return (
                                                        <tr
                                                            key={
                                                                student.studentId
                                                            }
                                                            className="
                                                                border-b
                                                                border-slate-100
                                                                last:border-0
                                                                hover:bg-slate-50
                                                            "
                                                        >

                                                            {/* PRN */}

                                                            <td className="px-5 py-4">

                                                                <span className="font-semibold text-slate-700">
                                                                    {
                                                                        student.prnNo ||
                                                                        "-"
                                                                    }
                                                                </span>

                                                            </td>

                                                            {/* STUDENT */}

                                                            <td className="px-5 py-4">

                                                                <div className="flex items-center gap-3">

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-10
                                                                            w-10
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-full
                                                                            bg-indigo-100
                                                                            text-sm
                                                                            font-bold
                                                                            text-indigo-600
                                                                        "
                                                                    >
                                                                        {(
                                                                            student.studentName ||
                                                                            "S"
                                                                        )
                                                                            .charAt(0)
                                                                            .toUpperCase()}
                                                                    </div>

                                                                    <div>

                                                                        <p className="font-semibold text-slate-800">
                                                                            {
                                                                                student.studentName ||
                                                                                "Unknown Student"
                                                                            }
                                                                        </p>

                                                                        <p className="text-xs text-slate-400">
                                                                            Roll No:{" "}
                                                                            {
                                                                                student.rollNo ||
                                                                                "-"
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </td>

                                                            {/* INTERNAL */}

                                                            <td className="px-5 py-4 text-center">

                                                                <input
                                                                    type="number"
                                                                    inputMode="numeric"
                                                                    min="0"
                                                                    max={selectedSubjectData?.subjectType === "PRACTICAL" ? 60 : 40}
                                                                    value={currentStudent?.internalMarks ?? ""}
                                                                    onChange={(e) =>
                                                                        handleMarksChange(
                                                                            student.studentId,
                                                                            "internalMarks",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="
        w-20
        rounded-lg
        border
        border-slate-200
        px-3
        py-2
        text-center
        text-sm
        font-semibold
        text-slate-700
        outline-none
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-100
    "
                                                                    placeholder="0"
                                                                />

                                                            </td>

                                                            {/* EXTERNAL */}

                                                            <td className="px-5 py-4 text-center">

                                                                <input
                                                                    type="number"
                                                                    inputMode="numeric"
                                                                    min="0"
                                                                    max={
                                                                        selectedSubjectData?.subjectType === "PRACTICAL"
                                                                            ? 40
                                                                            : 60
                                                                    }
                                                                    value={currentStudent?.externalMarks ?? ""}
                                                                    onChange={(e) =>
                                                                        handleMarksChange(
                                                                            student.studentId,
                                                                            "externalMarks",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="
        w-20
        rounded-lg
        border
        border-slate-200
        px-3
        py-2
        text-center
        text-sm
        font-semibold
        text-slate-700
        outline-none
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-100
    "
                                                                    placeholder="0"
                                                                />

                                                            </td>

                                                            {/* TOTAL */}

                                                            <td className="px-5 py-4 text-center">

                                                                <span className="font-bold text-slate-800">
                                                                    {
                                                                        student.totalMarks ||
                                                                        "-"
                                                                    }
                                                                </span>

                                                            </td>

                                                            {/* GRADE */}

                                                            <td className="px-5 py-4 text-center">

                                                                <span
                                                                    className={`
                                                                        inline-flex
                                                                        min-w-12
                                                                        justify-center
                                                                        rounded-lg
                                                                        px-3
                                                                        py-1.5
                                                                        text-sm
                                                                        font-bold
                                                                        ${student.grade ===
                                                                            "F"
                                                                            ? "bg-red-100 text-red-600"
                                                                            : student.grade
                                                                                ? "bg-indigo-100 text-indigo-700"
                                                                                : "bg-slate-100 text-slate-400"
                                                                        }
                                                                    `}
                                                                >
                                                                    {
                                                                        student.grade ||
                                                                        "-"
                                                                    }
                                                                </span>

                                                            </td>

                                                            {/* STATUS */}

                                                            <td className="px-5 py-4 text-center">

                                                                <span
                                                                    className={`
                                                                        inline-flex
                                                                        rounded-full
                                                                        px-3
                                                                        py-1.5
                                                                        text-xs
                                                                        font-bold
                                                                        ${student.resultStatus ===
                                                                            "PASS"
                                                                            ? "bg-emerald-100 text-emerald-700"
                                                                            : student.resultStatus ===
                                                                                "FAIL"
                                                                                ? "bg-red-100 text-red-700"
                                                                                : "bg-slate-100 text-slate-400"
                                                                        }
                                                                    `}
                                                                >
                                                                    {
                                                                        student.resultStatus ||
                                                                        "Pending"
                                                                    }
                                                                </span>

                                                            </td>

                                                        </tr>
                                                    );
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>

                    </div>

                </main>

            </div>
        </>
    );
};

export default TeacherEnterResults;