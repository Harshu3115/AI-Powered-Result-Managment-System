import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Download,
    FileText,
    ChevronDown,
    Trophy,
    Users,
} from "lucide-react";

import teacherService from "../../services/teacherService";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";

export default function TeacherResults() {

    const [students, setStudents] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchResults();
        fetchDashboard();
    }, []);


    const fetchDashboard = async () => {
        try {

            const response =
                await teacherService.getDashboard();

            console.log(
                "Teacher Dashboard Response:",
                response
            );

            setDashboardData(
                response?.data || null
            );

        } catch (error) {

            console.error(
                "Teacher Dashboard Error:",
                error
            );

        }
    };

    const fetchResults = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await teacherService.getResults();

            console.log(
                "Teacher Results API:",
                response
            );

            const data = response?.data || [];

            setStudents(data);

            // Get unique semesters
            const uniqueSemesters = [
                ...new Map(
                    data
                        .filter(
                            student =>
                                student.semesterId != null
                        )
                        .map(student => [
                            student.semesterId,
                            {
                                id: student.semesterId,
                                name:
                                    student.semesterName ||
                                    `Semester ${student.semesterId}`,
                            },
                        ])
                ).values(),
            ];

            setSemesters(uniqueSemesters);

            if (uniqueSemesters.length > 0) {
                setSelectedSemester(
                    String(uniqueSemesters[0].id)
                );
            }

        } catch (err) {

            console.error(
                "Teacher Results Error:",
                err
            );

            setError(
                "Unable to load student results."
            );

        } finally {

            setLoading(false);

        }
    };

    const filteredStudents = useMemo(() => {

        return students.filter(student => {

            const matchesSemester =
                !selectedSemester ||
                String(student.semesterId) ===
                String(selectedSemester);

            const studentName =
                `${student.firstName || ""} ${student.lastName || ""
                    }`.toLowerCase();

            const matchesSearch =
                !search ||
                studentName.includes(
                    search.toLowerCase()
                ) ||
                String(
                    student.prnNo || ""
                ).includes(search);

            return (
                matchesSemester &&
                matchesSearch
            );
        });

    }, [
        students,
        selectedSemester,
        search,
    ]);

    /*
     * Get subjects for selected semester
     */
    const subjects = useMemo(() => {

        const subjectMap = new Map();

        filteredStudents.forEach(student => {

            (student.subjects || []).forEach(subject => {

                if (!subjectMap.has(subject.subjectId)) {

                    subjectMap.set(
                        subject.subjectId,
                        {
                            id: subject.subjectId,
                            name:
                                subject.subjectName ||
                                "Subject",
                            code:
                                subject.subjectCode ||
                                "",
                        }
                    );

                }

            });

        });

        return Array.from(
            subjectMap.values()
        );

    }, [filteredStudents]);

    const getStudentName = (student) => {
        return student?.studentName || "Unknown Student";
    };

    const getSubjectMarks = (
        student,
        subjectId
    ) => {

        const subject =
            student.subjects?.find(
                item =>
                    String(item.subjectId) ===
                    String(subjectId)
            );

        return subject?.obtainedMarks ?? "-";
    };

    const getPercentage = (student) => {

        if (student?.percentage != null) {
            return Number(student.percentage).toFixed(2);
        }

        return "-";
    };

    const getSGPA = student => {

        if (student.sgpa != null) {
            return Number(
                student.sgpa
            ).toFixed(2);
        }

        return "-";
    };

    const getCGPA = student => {

        if (student.cgpa != null) {
            return Number(
                student.cgpa
            ).toFixed(2);
        }

        return "-";
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ============================= */}
            {/* TEACHER SIDEBAR */}
            {/* ============================= */}

            <TeacherSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
            />


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

                {/* ============================= */}
                {/* MAIN CONTENT */}
                {/* ============================= */}

                <main className="min-h-screen pt-[72px]">

                    <div className="sm:p-6 lg:px-5 lg:py-8">

                        {/* ============================= */}
                        {/* HEADER */}
                        {/* ============================= */}

                        <div className="mb-6">

                            <div className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    ">

                                <div>

                                    <h1 className="
                                text-2xl
                                font-bold
                                text-slate-900
                            ">
                                        Student Results
                                    </h1>

                                    <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                        View student marks and academic performance
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-indigo-600
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-indigo-700
                            "
                                >
                                    <Download className="h-4 w-4" />
                                    Export Results
                                </button>

                            </div>

                        </div>



                        {/* Stats */}
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-indigo-50 p-3">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Students
                                        </p>

                                        <p className="text-2xl font-bold text-slate-900">
                                            {filteredStudents.length}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-amber-50 p-3">
                                        <FileText className="h-5 w-5 text-amber-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Subjects
                                        </p>

                                        <p className="text-2xl font-bold text-slate-900">
                                            {subjects.length}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-emerald-50 p-3">
                                        <Trophy className="h-5 w-5 text-emerald-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Result Status
                                        </p>

                                        <p className="text-lg font-bold text-emerald-600">
                                            Published
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Filters */}
                        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                            <div className="flex flex-col gap-4 md:flex-row">

                                {/* Semester */}
                                <div className="relative w-full md:w-64">

                                    <select
                                        value={selectedSemester}
                                        onChange={e =>
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
                                px-4
                                py-2.5
                                pr-10
                                text-sm
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                            "
                                    >

                                        {semesters.length === 0 ? (
                                            <option value="">
                                                Select Semester
                                            </option>
                                        ) : (
                                            semesters.map(
                                                semester => (
                                                    <option
                                                        key={
                                                            semester.id
                                                        }
                                                        value={
                                                            semester.id
                                                        }
                                                    >
                                                        {
                                                            semester.name
                                                        }
                                                    </option>
                                                )
                                            )
                                        )}

                                    </select>

                                    <ChevronDown
                                        className="
                                pointer-events-none
                                absolute
                                right-3
                                top-3
                                h-4
                                w-4
                                text-slate-400
                            "
                                    />

                                </div>

                                {/* Search */}
                                <div className="relative flex-1">

                                    <Search
                                        className="
                                absolute
                                left-3
                                top-3
                                h-4
                                w-4
                                text-slate-400
                            "
                                    />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search by PRN or student name..."
                                        className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                py-2.5
                                pl-10
                                pr-4
                                text-sm
                                outline-none
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                            "
                                    />

                                </div>

                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Table */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-5 py-4">

                                <h2 className="font-bold text-slate-900">
                                    Semester Results
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Showing{" "}
                                    <span className="font-semibold text-slate-700">
                                        {filteredStudents.length}
                                    </span>{" "}
                                    students
                                </p>

                            </div>

                            {loading ? (

                                <div className="flex h-64 items-center justify-center">

                                    <div className="
                            h-8
                            w-8
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-indigo-600
                        " />

                                </div>

                            ) : filteredStudents.length === 0 ? (

                                <div className="flex h-64 flex-col items-center justify-center">

                                    <FileText className="mb-3 h-10 w-10 text-slate-300" />

                                    <p className="font-semibold text-slate-600">
                                        No results found
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Try another semester or search term.
                                    </p>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="min-w-max w-full text-left">

                                        <thead className="bg-slate-50">

                                            <tr>

                                                <th className="sticky left-0 z-20 whitespace-nowrap border-b border-r border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    PRN No
                                                </th>

                                                <th className="sticky left-[110px] z-20 whitespace-nowrap border-b border-r border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    Student Name
                                                </th>

                                                {subjects.map(
                                                    subject => (
                                                        <th
                                                            key={
                                                                subject.id
                                                            }
                                                            className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500"
                                                        >
                                                            <div>
                                                                {
                                                                    subject.name
                                                                }
                                                            </div>

                                                            {subject.code && (
                                                                <div className="mt-1 text-[10px] font-medium text-slate-400">
                                                                    {
                                                                        subject.code
                                                                    }
                                                                </div>
                                                            )}
                                                        </th>
                                                    )
                                                )}

                                                <th className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    Overall %
                                                </th>

                                                <th className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    SGPA
                                                </th>

                                                <th className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    CGPA
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {filteredStudents.map(
                                                (student, index) => (

                                                    <tr
                                                        key={
                                                            student.id ||
                                                            student.prnNo ||
                                                            index
                                                        }
                                                        className="
                                                transition
                                                hover:bg-slate-50
                                            "
                                                    >

                                                        <td className="sticky left-0 z-10 whitespace-nowrap border-b border-r border-slate-100 bg-white px-5 py-4 text-sm font-semibold text-slate-800">
                                                            {
                                                                student.prnNo ||
                                                                "-"
                                                            }
                                                        </td>

                                                        <td className="sticky left-[110px] z-10 whitespace-nowrap border-b border-r border-slate-100 bg-white px-5 py-4">

                                                            <div className="flex items-center gap-3">

                                                                <div className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-indigo-100
                                                        text-xs
                                                        font-bold
                                                        text-indigo-700
                                                    ">
                                                                    {getStudentName(
                                                                        student
                                                                    )
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div>

                                                                    <p className="text-sm font-semibold text-slate-800">
                                                                        {getStudentName(
                                                                            student
                                                                        )}
                                                                    </p>

                                                                    <p className="text-xs text-slate-400">
                                                                        {student.rollNo ||
                                                                            "—"}
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </td>

                                                        {subjects.map(
                                                            subject => {

                                                                const marks =
                                                                    getSubjectMarks(
                                                                        student,
                                                                        subject.id
                                                                    );

                                                                return (
                                                                    <td
                                                                        key={
                                                                            subject.id
                                                                        }
                                                                        className="border-b border-slate-100 px-5 py-4 text-center text-sm font-semibold text-slate-700"
                                                                    >
                                                                        {marks}
                                                                    </td>
                                                                );

                                                            }
                                                        )}

                                                        <td className="border-b border-slate-100 px-5 py-4 text-center">

                                                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-sm font-bold text-indigo-700">
                                                                {getPercentage(
                                                                    student
                                                                )}
                                                                %
                                                            </span>

                                                        </td>

                                                        <td className="border-b border-slate-100 px-5 py-4 text-center text-sm font-bold text-slate-800">
                                                            {getSGPA(
                                                                student
                                                            )}
                                                        </td>

                                                        <td className="border-b border-slate-100 px-5 py-4 text-center text-sm font-bold text-emerald-600">
                                                            {getCGPA(
                                                                student
                                                            )}
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>


                </main>
            </div>
        </div>
    );
}
