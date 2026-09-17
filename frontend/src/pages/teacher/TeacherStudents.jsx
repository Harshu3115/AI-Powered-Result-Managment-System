import React, {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import { useNavigate } from "react-router-dom";

import {
    AlertCircle,
    Award,
    BookOpen,
    ChevronRight,
    GraduationCap,
    Mail,
    RefreshCw,
    Search,
    Users,
    X,
} from "lucide-react";

import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";

import teacherService from "../../services/teacherService";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const TeacherStudents = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [students, setStudents] = useState([]);
    const [subjectPerformance, setSubjectPerformance] = useState([]);


    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [semesterFilter, setSemesterFilter] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);


    // =====================================================
    // FETCH STUDENTS
    // =====================================================

    const fetchStudents = async (
        showToast = false
    ) => {

        try {

            setError("");

            if (showToast) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response =
                await teacherService.getStudents();

            console.log(
                "Teacher Students API:",
                response
            );

            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "Failed to load students"
                );
            }

            setStudents(
                response?.data || []
            );

            if (showToast) {

                toast.success(
                    "Students refreshed successfully"
                );

            }

        } catch (err) {

            console.error(
                "Teacher Students Error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load students";

            setError(message);

            if (showToast) {
                toast.error(message);
            }

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    const fetchSubjectPerformance = async () => {
        try {
            const response =
                await teacherService.getSubjectPerformance();

            if (response?.success) {
                setSubjectPerformance(
                    response.data || []
                );
            }

        } catch (err) {
            console.error(
                "Subject Performance Error:",
                err
            );
        }
    };

    // =====================================================
    // FETCH TEACHER DASHBOARD
    // =====================================================

    const fetchDashboard = async () => {

        try {

            const response =
                await teacherService.getDashboard();

            if (response?.success) {

                setDashboard(
                    response.data
                );

            }

        } catch (err) {

            console.error(
                "Teacher Dashboard Error:",
                err
            );

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchStudents();
        fetchDashboard();
        fetchSubjectPerformance();

    }, []);


    // =====================================================
    // SEMESTER OPTIONS
    // =====================================================

    const semesterOptions = useMemo(() => {

        const semesters = students
            .map(
                (student) =>
                    student?.semesterName
            )
            .filter(Boolean);

        return [
            "ALL",
            ...Array.from(
                new Set(semesters)
            ),
        ];

    }, [students]);


    // =====================================================
    // FILTER STUDENTS
    // =====================================================

    const filteredStudents = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase();

        return students.filter(
            (student) => {

                const name =
                    student?.studentName
                        ?.toLowerCase() || "";

                const rollNo =
                    student?.rollNo
                        ?.toLowerCase() || "";

                const enrollmentNo =
                    student?.enrollmentNo
                        ?.toLowerCase() || "";

                const email =
                    student?.email
                        ?.toLowerCase() || "";

                const matchesSearch =
                    !searchValue ||
                    name.includes(searchValue) ||
                    rollNo.includes(searchValue) ||
                    enrollmentNo.includes(searchValue) ||
                    email.includes(searchValue);


                const matchesSemester =
                    semesterFilter === "ALL" ||
                    student?.semesterName ===
                    semesterFilter;


                const studentStatus =
                    student?.resultStatus
                        ?.toUpperCase() || "";


                const matchesStatus =
                    statusFilter === "ALL" ||
                    studentStatus ===
                    statusFilter;


                return (
                    matchesSearch &&
                    matchesSemester &&
                    matchesStatus
                );

            }
        );

    }, [
        students,
        search,
        semesterFilter,
        statusFilter,
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalStudents =
        students.length;

    const studentsWithResults =
        students.filter(
            (student) =>
                student?.percentage !== null &&
                student?.percentage !== undefined
        ).length;

    const passedStudents =
        students.filter(
            (student) =>
                student?.resultStatus
                    ?.toUpperCase() ===
                "PASS"
        ).length;

    const pendingResults =
        totalStudents -
        studentsWithResults;


    // =====================================================
    // TOP 3 STUDENTS BY PERCENTAGE
    // =====================================================

    const topStudents = useMemo(() => {

        return [...students]
            .filter(
                (student) =>
                    student?.percentage !== null &&
                    student?.percentage !== undefined
            )
            .sort(
                (a, b) =>
                    Number(b.percentage) -
                    Number(a.percentage)
            )
            .slice(0, 3);

    }, [students]);


    // =====================================================
    // CHART DATA
    // =====================================================

    // Students by semester
    const studentsBySemester = useMemo(() => {

        const counts = {};

        students.forEach((student) => {

            const semester =
                student?.semesterName || "Unknown";

            counts[semester] =
                (counts[semester] || 0) + 1;

        });

        return Object.entries(counts).map(
            ([semester, count]) => ({
                semester,
                students: count,
            })
        );

    }, [students]);


    const subjectAverageData = useMemo(() => {

        return subjectPerformance.map((subject) => ({
            subjectName:
                subject?.subjectName || "Unknown",

            averageMarks:
                Number(subject?.averageMarks || 0),
        }));

    }, [subjectPerformance]);


    // Result status
    const resultStatusData = useMemo(() => {

        return [
            {
                name: "Passed",
                value: passedStudents,
            },
            {
                name: "Failed",
                value: students.filter(
                    (student) =>
                        student?.resultStatus
                            ?.toUpperCase() === "FAIL"
                ).length,
            },
            {
                name: "Pending",
                value: pendingResults,
            },
        ].filter(
            (item) => item.value > 0
        );

    }, [
        students,
        passedStudents,
        pendingResults,
    ]);




    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <TeacherSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
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
                            dashboard
                        }

                    />

                    <main className="w-full px-6 pt-[96px] pb-6 sm:px-8 lg:px-8">

                        <div className="mx-auto max-w-7xl">

                            <div className="animate-pulse">

                                <div className="h-9 w-56 rounded-lg bg-slate-200" />

                                <div className="mt-3 h-4 w-80 rounded bg-slate-200" />

                                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

                                    {[1, 2, 3].map(
                                        (item) => (

                                            <div
                                                key={item}
                                                className="h-32 rounded-2xl bg-white"
                                            />

                                        )
                                    )}

                                </div>


                                <div className="mt-6 h-20 rounded-2xl bg-white" />


                                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                                    {[1, 2, 3, 4, 5, 6].map(
                                        (item) => (

                                            <div
                                                key={item}
                                                className="h-64 rounded-2xl bg-white"
                                            />

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    </main>

                </div>

            </div>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        error &&
        students.length === 0
    ) {

        return (

            <div className="min-h-screen bg-slate-50">

                <TeacherSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
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
                            dashboard
                        }

                    />

                    <main className="flex min-h-[70vh] items-center justify-center px-6">

                        <div className="max-w-md text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">

                                <AlertCircle
                                    size={30}
                                />

                            </div>

                            <h2 className="mt-5 text-xl font-bold text-slate-900">
                                Unable to Load Students
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {error}
                            </p>

                            <button
                                onClick={() =>
                                    fetchStudents()
                                }
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >

                                <RefreshCw
                                    size={17}
                                />

                                Try Again

                            </button>

                        </div>

                    </main>

                </div>

            </div>

        );
    }


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}

            <TeacherSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
                collapsed={
                    sidebarCollapsed
                }
            />


            {/* CONTENT */}

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

                {/* TOPBAR */}

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
                        dashboard
                    }

                />


                {/* MAIN */}

                <main className="w-full px-6 pt-[96px] pb-7 sm:px-8 lg:px-10">

                    <div className="mx-auto max-w-7xl">


                        {/* =====================================================
                            PAGE HEADER
                        ===================================================== */}

                        <section className="mb-7">

                            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                                <div>

                                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                        Teacher Portal
                                    </p>

                                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                        Students
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                        View students assigned to your subjects
                                        and check their academic performance.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchStudents(true)
                                    }
                                    disabled={
                                        refreshing
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    <RefreshCw
                                        size={17}
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    {refreshing
                                        ? "Refreshing..."
                                        : "Refresh"}

                                </button>

                            </div>

                        </section>


                        {/* =====================================================
                            STAT CARDS
                        ===================================================== */}

                        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">

                            <StatCard
                                icon={Users}
                                title="Total Students"
                                value={
                                    totalStudents
                                }
                                description="Students assigned to you"
                                iconStyle="bg-indigo-100 text-indigo-600"
                            />


                            <StatCard
                                icon={Award}
                                title="Results Available"
                                value={
                                    studentsWithResults
                                }
                                description="Students with results"
                                iconStyle="bg-emerald-100 text-emerald-600"
                            />


                            <StatCard
                                icon={GraduationCap}
                                title="Passed Students"
                                value={
                                    passedStudents
                                }
                                description={
                                    pendingResults > 0
                                        ? `${pendingResults} result${pendingResults === 1
                                            ? ""
                                            : "s"
                                        } pending`
                                        : "All results available"
                                }
                                iconStyle="bg-blue-100 text-blue-600"
                            />

                        </section>

                        <StudentAnalytics
                            subjectAverageData={subjectAverageData}
                            resultStatusData={resultStatusData}
                        />

                        {/* =====================================================
    TOP 3 STUDENTS
===================================================== */}

                        <section className="mt-7">

                            <div className="mb-4">

                                <h2 className="text-lg font-bold text-slate-900">
                                    Top 3 Students
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Students ranked by overall percentage
                                </p>

                            </div>


                            {topStudents.length > 0 ? (

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                                    {topStudents.map((student, index) => (

                                        <TopStudentCard
                                            key={student.studentId}
                                            student={student}
                                            rank={index + 1}
                                            onView={() =>
                                                navigate(
                                                    `/teacher/students/${student.studentId}`
                                                )
                                            }
                                        />

                                    ))}

                                </div>

                            ) : (

                                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">

                                    <p className="text-sm text-slate-500">
                                        No student results available for ranking.
                                    </p>

                                </div>

                            )}

                        </section>



                        {/* =====================================================
                            FOOTER
                        ===================================================== */}

                        <footer className="mt-10 border-t border-slate-200 py-7 text-center">

                            <p className="text-sm text-slate-500">
                                AI Powered Student Result Management System
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                © 2026 SRMS • Teacher Portal
                            </p>

                        </footer>

                    </div>

                </main>

            </div>


            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />

        </div>
    );
};

// =====================================================
// STUDENT ANALYTICS
// =====================================================

const StudentAnalytics = ({
    subjectAverageData,
    resultStatusData,
}) => {

    return (

        <section className="mt-7">

            <div className="mb-4">

                <h2 className="text-lg font-bold text-slate-900">
                    Student Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Overview of student distribution and result status.
                </p>

            </div>


            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                {/* =================================================
    SUBJECT-WISE AVERAGE MARKS
================================================= */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-5">
                        <h3 className="text-base font-bold text-slate-900">
                            Subject-wise Average Marks
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            Average marks obtained in each subject
                        </p>
                    </div>

                    {subjectAverageData.length > 0 ? (

                        <div className="h-[300px] w-full">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={subjectAverageData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -10,
                                        bottom: 10,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="subjectName"
                                        tick={{
                                            fontSize: 11,
                                        }}
                                        interval={0}
                                        angle={-20}
                                        textAnchor="end"
                                        height={60}
                                    />

                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{
                                            fontSize: 12,
                                        }}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            `${Number(value).toFixed(2)}`,
                                            "Average Marks",
                                        ]}
                                    />

                                    <Bar
                                        dataKey="averageMarks"
                                        name="Average Marks"
                                        fill="#4f46e5"
                                        radius={[
                                            6,
                                            6,
                                            0,
                                            0,
                                        ]}
                                        barSize={40}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    ) : (

                        <div className="flex h-[300px] items-center justify-center">

                            <p className="text-sm text-slate-400">
                                No subject performance data available.
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    RESULT STATUS
                ================================================= */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-5">

                        <h3 className="text-base font-bold text-slate-900">
                            Result Status
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            Student result distribution
                        </p>

                    </div>


                    {resultStatusData.length > 0 ? (

                        <div className="h-[300px] w-full">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <PieChart>

                                    <Pie
                                        data={resultStatusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="45%"
                                        outerRadius={95}
                                        innerRadius={55}
                                        paddingAngle={3}
                                    >

                                        {resultStatusData.map(
                                            (entry, index) => (

                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        [
                                                            "#10b981",
                                                            "#ef4444",
                                                            "#f59e0b",
                                                        ][index]
                                                    }
                                                />

                                            )
                                        )}

                                    </Pie>

                                    <Tooltip
                                        formatter={(value) => [
                                            value,
                                            "Students",
                                        ]}
                                    />

                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                    />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                    ) : (

                        <div className="flex h-[300px] items-center justify-center">

                            <p className="text-sm text-slate-400">
                                No result data available.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </section>
    );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
    iconStyle,
}) => {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>

                </div>


                <div
                    className={`
                        flex h-12 w-12
                        items-center justify-center
                        rounded-xl
                        ${iconStyle}
                    `}
                >

                    <Icon size={23} />

                </div>

            </div>

        </div>
    );
};


// =====================================================
// TOP STUDENT CARD
// =====================================================

const TopStudentCard = ({
    student,
    rank,
    onView,
}) => {

    const getInitials = (name) => {

        if (!name) return "ST";

        const parts =
            name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0]
                .charAt(0)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };


    const rankLabel = {
        1: "1st",
        2: "2nd",
        3: "3rd",
    };


    return (

        <article
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:-translate-y-1
                hover:shadow-md
            "
        >

            {/* TOP ROW */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-100
                            text-sm
                            font-bold
                            text-indigo-600
                        "
                    >
                        {getInitials(
                            student?.studentName
                        )}
                    </div>


                    <div className="min-w-0">

                        <h3 className="truncate text-sm font-bold text-slate-900">
                            {student?.studentName ||
                                "Student"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            Roll No:{" "}
                            {student?.rollNo || "N/A"}
                        </p>

                    </div>

                </div>


                {/* RANK */}

                <span
                    className="
                        rounded-lg
                        bg-indigo-50
                        px-3
                        py-1.5
                        text-sm
                        font-bold
                        text-indigo-600
                    "
                >
                    {rankLabel[rank]}
                </span>

            </div>


            {/* SEMESTER */}

            <div className="mt-4 flex items-center justify-between">

                <span className="text-sm text-slate-500">
                    Semester
                </span>

                <span className="text-sm font-semibold text-slate-700">
                    {student?.semesterName || "N/A"}
                </span>

            </div>


            {/* PERCENTAGE */}

            <div className="mt-4 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-medium text-slate-400">
                    Percentage
                </p>

                <p className="mt-1 text-2xl font-bold text-indigo-600">
                    {Number(
                        student?.percentage || 0
                    ).toFixed(2)}
                    %
                </p>

            </div>


            {/* VIEW */}

            <button
                type="button"
                onClick={onView}
                className="
                    mt-4
                    flex
                    w-full
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
                    transition
                    hover:bg-indigo-700
                "
            >
                View Result

                <ChevronRight size={16} />

            </button>

        </article>

    );
};

// =====================================================
// STUDENT CARD
// =====================================================

const StudentCard = ({
    student,
    onView,
}) => {

    const percentage =
        student?.percentage;

    const status =
        student?.resultStatus
            ?.toUpperCase();


    const getInitials = (
        name
    ) => {

        if (!name) {
            return "ST";
        }

        const parts =
            name
                .trim()
                .split(/\s+/);

        if (
            parts.length === 1
        ) {

            return parts[0]
                .charAt(0)
                .toUpperCase();

        }

        return (
            parts[0]
                .charAt(0) +
            parts[
                parts.length - 1
            ].charAt(0)
        ).toUpperCase();

    };


    return (

        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">


            {/* TOP */}

            <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600">

                            {getInitials(
                                student?.studentName
                            )}

                        </div>


                        <div className="min-w-0">

                            <h3 className="truncate text-base font-bold text-slate-900">
                                {student?.studentName ||
                                    "Student"}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                Roll No:{" "}
                                {student?.rollNo ||
                                    "N/A"}
                            </p>

                        </div>

                    </div>


                    <span className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">

                        {student?.semesterName ||
                            "N/A"}

                    </span>

                </div>


                {/* CONTACT */}

                {/* CONTACT + SUBJECTS */}

                <div className="mt-5 border-t border-slate-100 pt-4">

                    {/* EMAIL */}
                    <div className="flex items-center gap-2 text-sm text-slate-500">

                        <Mail
                            size={16}
                            className="shrink-0 text-slate-400"
                        />

                        <span className="truncate">
                            {student?.email || "Email not available"}
                        </span>

                    </div>


                </div>


                {/* RESULT */}

                <div className="mt-5 rounded-xl bg-slate-50 p-4">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-xs font-medium text-slate-400">
                                Current Result
                            </p>

                            <p className="mt-1 text-xl font-bold text-slate-900">

                                {percentage !==
                                    null &&
                                    percentage !==
                                    undefined
                                    ? `${Number(
                                        percentage
                                    ).toFixed(
                                        2
                                    )}%`
                                    : "N/A"}

                            </p>

                        </div>


                        <div className="text-right">

                            <p className="text-xs font-medium text-slate-400">
                                Status
                            </p>


                            {status ? (

                                <span
                                    className={`
                                        mt-1 inline-flex
                                        rounded-lg
                                        px-2.5 py-1
                                        text-xs
                                        font-bold
                                        ${status ===
                                            "PASS"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-red-100 text-red-700"
                                        }
                                    `}
                                >

                                    {status}

                                </span>

                            ) : (

                                <span className="mt-1 block text-sm font-semibold text-slate-400">
                                    Pending
                                </span>

                            )}

                        </div>

                    </div>


                    {student?.sgpa !==
                        null &&
                        student?.sgpa !==
                        undefined && (

                            <div className="mt-3 border-t border-slate-200 pt-3">

                                <div className="flex items-center justify-between">

                                    <span className="text-xs text-slate-400">
                                        SGPA
                                    </span>

                                    <span className="text-sm font-bold text-indigo-600">
                                        {Number(
                                            student.sgpa
                                        ).toFixed(
                                            2
                                        )}
                                    </span>

                                </div>

                            </div>

                        )}

                </div>


                {/* VIEW RESULT */}

                <button
                    type="button"
                    onClick={onView}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 group-hover:bg-indigo-700"
                >

                    View Student Result

                    <ChevronRight
                        size={17}
                    />

                </button>

            </div>

        </article>

    );
};


export default TeacherStudents;