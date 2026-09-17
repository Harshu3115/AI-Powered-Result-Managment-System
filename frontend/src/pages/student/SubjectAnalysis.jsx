import React, { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Award,
    BookOpen,
    CheckCircle2,
    Loader2,
    TrendingDown,
    TrendingUp,
    BarChart3,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";
import studentService from "../../services/studentService";

const SubjectAnalysis = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [subjects, setSubjects] = useState([]);
    const [profile, setProfile] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedSemester, setSelectedSemester] = useState("all");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                profileResponse,
                dashboardResponse,
            ] = await Promise.all([

                studentService.getProfile(),

                studentService.getDashboard(),

            ]);


            // =================================================
            // PROFILE
            // =================================================

            if (profileResponse?.success) {

                setProfile(
                    profileResponse.data
                );

            }


            // =================================================
            // DASHBOARD
            // =================================================

            if (dashboardResponse?.success) {

                const dashboard =
                    dashboardResponse.data;

                console.log(
                    "Dashboard API:",
                    dashboard
                );

                setDashboardData(
                    dashboard
                );


                // =================================================
                // BUILD SEMESTER-WISE SUBJECT LIST
                // =================================================

                const semesterWiseSubjects =
                    (dashboard?.semesterResults || [])
                        .flatMap(
                            (semesterResult) => {

                                return (
                                    semesterResult?.subjects || []
                                ).map(
                                    (subject) => ({

                                        ...subject,

                                        // Add semester information
                                        semesterName:
                                            semesterResult?.semesterName ||
                                            `Semester ${semesterResult?.semesterId}`,

                                        semesterId:
                                            semesterResult?.semesterId,

                                    })
                                );

                            }
                        );


                console.log(
                    "Semester Wise Subjects:",
                    semesterWiseSubjects
                );


                setSubjects(
                    semesterWiseSubjects
                );

            } else {

                setSubjects([]);

            }

        } catch (err) {

            console.error(
                "Subject Analysis Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load subject analysis."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // HELPERS
    // =====================================================

    const getSubjectName = (subject) => {

        return (
            subject?.subjectName ||
            subject?.subject ||
            subject?.name ||
            subject?.subjectCode ||
            "Subject"
        );

    };


    const getMarks = (subject) => {

        const value =
            subject?.marks ??
            subject?.obtainedMarks ??
            subject?.totalMarksObtained ??
            subject?.score ??
            subject?.percentage ??
            0;

        return Number(value) || 0;

    };


    const getGrade = (subject) => {

        return (
            subject?.grade ||
            subject?.gradeName ||
            "-"
        );

    };


    const getSemester = (subject) => {

        return (
            subject?.semesterName ||
            subject?.semester ||
            subject?.semesterNumber ||
            "Unknown"
        );

    };


    const formatMarks = (value) => {

        const number = Number(value);

        if (Number.isNaN(number)) {
            return "0";
        }

        return Number.isInteger(number)
            ? number
            : number.toFixed(2);

    };


    // =====================================================
    // SEMESTERS
    // =====================================================

    const semesters = useMemo(() => {

        const values = subjects
            .map((subject) =>
                getSemester(subject)
            )
            .filter(Boolean);

        return [
            ...new Set(values)
        ];

    }, [subjects]);


    // =====================================================
    // FILTERED SUBJECTS
    // =====================================================

    const filteredSubjects = useMemo(() => {

        if (selectedSemester === "all") {

            return subjects;

        }

        return subjects.filter(
            (subject) =>
                String(
                    getSemester(subject)
                ) === String(selectedSemester)
        );

    }, [subjects, selectedSemester]);


    // =====================================================
    // SORTED SUBJECTS
    // =====================================================

    const sortedSubjects = useMemo(() => {

        return [...filteredSubjects].sort(
            (a, b) =>
                getMarks(b) - getMarks(a)
        );

    }, [filteredSubjects]);


    // =====================================================
    // HIGHEST SUBJECTS
    // =====================================================

    const highestSubjects = useMemo(() => {

        return sortedSubjects.slice(0, 5);

    }, [sortedSubjects]);


    // =====================================================
    // WEAK SUBJECTS
    // =====================================================

    const weakSubjects = useMemo(() => {

        return [...filteredSubjects]
            .sort(
                (a, b) =>
                    getMarks(a) - getMarks(b)
            )
            .slice(0, 5);

    }, [filteredSubjects]);


    // =====================================================
    // AVERAGE
    // =====================================================

    const averageMarks = useMemo(() => {

        if (!filteredSubjects.length) {
            return 0;
        }

        const total =
            filteredSubjects.reduce(
                (sum, subject) =>
                    sum + getMarks(subject),
                0
            );

        return total /
            filteredSubjects.length;

    }, [filteredSubjects]);


    // =====================================================
    // PASSED SUBJECTS
    // =====================================================

    const passedSubjects = useMemo(() => {

        return filteredSubjects.filter(
            (subject) => {

                const status =
                    String(
                        subject?.status ||
                        subject?.resultStatus ||
                        ""
                    ).toUpperCase();

                const marks =
                    getMarks(subject);

                if (
                    status === "PASS" ||
                    status === "PASSED"
                ) {
                    return true;
                }

                return marks >= 40;

            }
        );

    }, [filteredSubjects]);


    // =====================================================
    // CHART DATA
    // =====================================================

    const chartData = useMemo(() => {

        return sortedSubjects
            .slice(0, 12)
            .map((subject) => ({

                subject:
                    getSubjectName(subject)
                        .length > 18
                        ? `${getSubjectName(subject).slice(
                            0,
                            18
                        )}...`
                        : getSubjectName(subject),

                marks:
                    Number(
                        getMarks(subject).toFixed(2)
                    ),

            }));

    }, [sortedSubjects]);


    // =====================================================
    // TOOLTIP
    // =====================================================

    const CustomTooltip = ({
        active,
        payload,
        label,
    }) => {

        if (
            !active ||
            !payload ||
            !payload.length
        ) {
            return null;
        }

        return (

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">

                <p className="text-xs font-semibold text-slate-500">
                    {label}
                </p>

                <p className="mt-1 text-sm font-bold text-indigo-600">
                    Marks: {payload[0].value}
                </p>

            </div>

        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">

                {/* SIDEBAR */}
                <StudentSidebar
                    open={sidebarOpen}
                    collapsed={sidebarCollapsed}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* MAIN AREA */}
                <div
                    className={`
                    min-h-screen
                    min-w-0
                    transition-all
                    duration-300
                    ${sidebarCollapsed
                            ? "lg:ml-20"
                            : "lg:ml-70"
                        }
                `}
                >

                    {/* TOPBAR */}
                    <StudentTopbar
                        onMenuClick={() => setSidebarOpen(true)}
                        onSidebarToggle={() =>
                            setSidebarCollapsed((prev) => !prev)
                        }
                        sidebarCollapsed={sidebarCollapsed}
                        dashboardData={dashboardData}
                        profile={profile}
                        title="Subject Analysis"
                    />

                    {/* LOADING CONTENT */}
                    <div className="flex min-h-screen items-center justify-center pt-16">
                        <div className="text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />

                            <p className="mt-3 text-sm text-slate-500">
                                Loading subject analysis...
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        );
    }


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =====================================================
            SIDEBAR
        ===================================================== */}

            <StudentSidebar
                open={sidebarOpen}
                collapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
            />

            {/* =====================================================
            MAIN CONTENT AREA
        ===================================================== */}

            <div
                className={`
                min-h-screen
                min-w-0
                transition-all
                duration-300
                ${sidebarCollapsed
                        ? "lg:ml-20"
                        : "lg:ml-70"
                    }
            `}
            >

                {/* =================================================
                TOPBAR
            ================================================= */}

                <StudentTopbar
                    title="Subject Analysis"
                    onMenuClick={() => setSidebarOpen(true)}
                    onSidebarToggle={() =>
                        setSidebarCollapsed((prev) => !prev)
                    }
                    sidebarCollapsed={sidebarCollapsed}
                    dashboardData={dashboardData}
                    profile={profile}
                />

                {/* =================================================
                PAGE CONTENT
            ================================================= */}

                <main
                    className="
        mx-auto
        w-full
        max-w-[1500px]
        min-w-0
        flex
        flex-col
        gap-6
        px-4
        pb-10
        pt-20
        sm:px-6
        lg:px-8
    "
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">

                                    <BookOpen className="h-5 w-5 text-indigo-600" />

                                </div>

                                <div>

                                    <h1 className="text-2xl font-bold text-slate-900">
                                        Subject Analysis
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Analyze your performance subject by subject.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* SEMESTER SELECTOR */}

                        <div className="relative">

                            <select
                                value={selectedSemester}
                                onChange={(e) => {
                                    setSelectedSemester(e.target.value);
                                }}
                                className="
            appearance-none
            min-w-[190px]
            rounded-xl
            border border-slate-200
            bg-white
            px-4
            py-2.5
            pr-10
            text-sm
            font-semibold
            text-slate-700
            shadow-sm
            outline-none
            transition
            hover:border-indigo-300
            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-100
        "
                            >

                                {/* ALL */}
                                <option value="all">
                                    All Semesters
                                </option>

                                {/* SEMESTERS */}
                                {semesters.map((semester) => (
                                    <option
                                        key={semester}
                                        value={semester}
                                    >
                                        {semester}
                                    </option>
                                ))}

                            </select>

                            {/* CUSTOM ARROW */}

                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">

                                <svg
                                    className="h-4 w-4 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m6 9 6 6 6-6"
                                    />
                                </svg>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">

                            <div className="flex items-center gap-3">

                                <AlertTriangle className="h-5 w-5 text-red-500" />

                                <p className="text-sm text-red-600">
                                    {error}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">


                        {/* TOTAL */}

                        <StatCard
                            label="Total Subjects"
                            value={
                                filteredSubjects.length
                            }
                            sub={
                                selectedSemester === "all"
                                    ? "All Semesters"
                                    : selectedSemester
                            }
                            icon={BookOpen}
                            iconBg="bg-indigo-50"
                            iconColor="text-indigo-600"
                        />


                        {/* AVERAGE */}

                        <StatCard
                            label="Average Marks"
                            value={
                                formatMarks(
                                    averageMarks
                                )
                            }
                            sub="Out of 100"
                            icon={BarChart3}
                            iconBg="bg-violet-50"
                            iconColor="text-violet-600"
                        />


                        {/* PASSED */}

                        <StatCard
                            label="Passed Subjects"
                            value={
                                passedSubjects.length
                            }
                            sub={
                                filteredSubjects.length
                                    ? `${(
                                        (passedSubjects.length /
                                            filteredSubjects.length) *
                                        100
                                    ).toFixed(1)}% Pass Rate`
                                    : "No data"
                            }
                            icon={CheckCircle2}
                            iconBg="bg-emerald-50"
                            iconColor="text-emerald-600"
                        />


                        {/* BEST */}

                        <StatCard
                            label="Highest Score"
                            value={
                                highestSubjects.length
                                    ? formatMarks(
                                        getMarks(
                                            highestSubjects[0]
                                        )
                                    )
                                    : "0"
                            }
                            sub={
                                highestSubjects.length
                                    ? getSubjectName(
                                        highestSubjects[0]
                                    )
                                    : "No data"
                            }
                            icon={Award}
                            iconBg="bg-amber-50"
                            iconColor="text-amber-500"
                        />

                    </div>


                    {/* =================================================
                        SUBJECT PERFORMANCE CHART
                    ================================================= */}

                    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Subject-wise Performance
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Marks obtained in each subject
                                </p>

                            </div>

                            <BarChart3 className="h-5 w-5 text-indigo-500" />

                        </div>


                        <div className="mt-6 h-[380px]">

                            {chartData.length > 0 ? (

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <BarChart
                                        data={chartData}
                                        layout="vertical"
                                        margin={{
                                            top: 5,
                                            right: 20,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                        />

                                        <XAxis
                                            type="number"
                                            domain={[
                                                0,
                                                100,
                                            ]}
                                        />

                                        <YAxis
                                            type="category"
                                            dataKey="subject"
                                            width={140}
                                            tick={{
                                                fontSize: 11,
                                            }}
                                        />

                                        <Tooltip
                                            content={
                                                <CustomTooltip />
                                            }
                                        />

                                        <Bar
                                            dataKey="marks"
                                            name="Marks"
                                            fill="#6366f1"
                                            radius={[
                                                0,
                                                6,
                                                6,
                                                0,
                                            ]}
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            ) : (

                                <EmptyState
                                    text="No subject performance data available."
                                />

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        HIGHEST + WEAK
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


                        {/* HIGHEST */}

                        <SubjectList
                            title="Highest-Scoring Subjects"
                            subtitle="Your strongest subjects"
                            subjects={
                                highestSubjects
                            }
                            high
                        />


                        {/* WEAK */}

                        <SubjectList
                            title="Weak Subjects"
                            subtitle="Subjects that need more attention"
                            subjects={
                                weakSubjects
                            }
                        />

                    </div>


                    {/* =================================================
    ALL SUBJECTS - SEMESTER WISE
================================================= */}

                    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* HEADER */}

                        <div className="border-b border-slate-100 p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">

                                    <BookOpen className="h-4 w-4 text-indigo-600" />

                                </div>

                                <div>

                                    <h2 className="font-bold text-slate-900">
                                        All Subjects
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Semester-wise subject performance
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* SEMESTER WISE */}

                        {filteredSubjects.length > 0 ? (

                            <div className="space-y-6 p-5">

                                {[...new Set(
                                    filteredSubjects.map((subject) =>
                                        getSemester(subject)
                                    )
                                )].map((semester) => {

                                    const semesterSubjects =
                                        filteredSubjects.filter(
                                            (subject) =>
                                                String(getSemester(subject)) ===
                                                String(semester)
                                        );

                                    if (!semesterSubjects.length) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={semester}
                                            className="overflow-hidden rounded-2xl border border-slate-200"
                                        >

                                            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">

                                                <div>

                                                    <h3 className="font-bold text-slate-800">
                                                        {semester}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {semesterSubjects.length} subjects
                                                    </p>

                                                </div>

                                                <div className="text-right">

                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                        Average
                                                    </p>

                                                    <p className="text-lg font-bold text-indigo-600">

                                                        {(
                                                            semesterSubjects.reduce(
                                                                (sum, subject) =>
                                                                    sum + getMarks(subject),
                                                                0
                                                            ) /
                                                            semesterSubjects.length
                                                        ).toFixed(2)}

                                                    </p>

                                                </div>

                                            </div>

                                            {/* TABLE */}

                                            <div className="overflow-x-auto">

                                                <table className="w-full min-w-[650px]">

                                                    <thead>
                                                        <tr className="border-b border-slate-100">

                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                                #
                                                            </th>

                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                                SUBJECT
                                                            </th>

                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                                SUBJECT CODE
                                                            </th>

                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                                MARKS
                                                            </th>

                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                                GRADE
                                                            </th>

                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                                PERFORMANCE
                                                            </th>

                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {semesterSubjects
                                                            .sort(
                                                                (a, b) =>
                                                                    getMarks(b) -
                                                                    getMarks(a)
                                                            )
                                                            .map(
                                                                (subject, index) => {

                                                                    const marks =
                                                                        getMarks(subject);

                                                                    const performance =
                                                                        marks >= 85
                                                                            ? "Excellent"
                                                                            : marks >= 70
                                                                                ? "Good"
                                                                                : marks >= 50
                                                                                    ? "Average"
                                                                                    : "Needs Focus";

                                                                    return (

                                                                        <tr
                                                                            key={`${getSubjectName(subject)}-${index}`}
                                                                            className="border-b border-slate-100 hover:bg-slate-50"
                                                                        >

                                                                            <td className="px-5 py-4 text-sm text-slate-400">
                                                                                {index + 1}
                                                                            </td>

                                                                            <td className="px-5 py-4">

                                                                                <p className="font-semibold text-slate-700">
                                                                                    {getSubjectName(subject)}
                                                                                </p>

                                                                            </td>

                                                                            <td className="px-5 py-4">

                                                                                <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                                                    {subject?.subjectCode || "-"}
                                                                                </span>

                                                                            </td>

                                                                            <td className="px-5 py-4">

                                                                                <span className="font-bold text-slate-800">
                                                                                    {formatMarks(marks)}
                                                                                </span>

                                                                                <span className="ml-1 text-xs text-slate-400">
                                                                                    /100
                                                                                </span>

                                                                            </td>

                                                                            <td className="px-5 py-4">

                                                                                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                                                                                    {getGrade(subject)}
                                                                                </span>

                                                                            </td>

                                                                            <td className="px-5 py-4">

                                                                                <span
                                                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${marks >= 85
                                                                                        ? "bg-emerald-50 text-emerald-600"
                                                                                        : marks >= 70
                                                                                            ? "bg-blue-50 text-blue-600"
                                                                                            : marks >= 50
                                                                                                ? "bg-amber-50 text-amber-600"
                                                                                                : "bg-red-50 text-red-600"
                                                                                        }`}
                                                                                >
                                                                                    {performance}
                                                                                </span>

                                                                            </td>

                                                                        </tr>

                                                                    );

                                                                }
                                                            )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>
                                    );

                                })}

                            </div>

                        ) : (

                            <EmptyState text="No subject data available." />

                        )}

                    </section>


                    {/* =================================================
                        ACADEMIC TIPS
                    ================================================= */}

                    <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-5">

                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">

                                <TrendingUp className="h-4 w-4" />

                            </div>

                            <div>

                                <h3 className="font-bold text-slate-800">
                                    Subject Performance Insight
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">

                                    {filteredSubjects.length > 0
                                        ? averageMarks >= 75
                                            ? "Your overall subject performance is strong. Continue maintaining consistency and focus on pushing your weaker subjects higher."
                                            : averageMarks >= 50
                                                ? "Your performance is moderate. Focus on your weaker subjects and maintain regular revision to improve your overall average."
                                                : "You should give additional attention to your subjects. Create a consistent study schedule and focus on the subjects with the lowest marks."
                                        : "Subject performance insights will appear when subject result data is available."
                                    }

                                </p>

                            </div>

                        </div>

                    </section>

                </main>

            </div>

        </div>

    );

};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
    label,
    value,
    sub,
    icon: Icon,
    iconBg,
    iconColor,
}) => {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-xs font-medium text-slate-400">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                        {sub}
                    </p>

                </div>


                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >

                    <Icon
                        className={`h-5 w-5 ${iconColor}`}
                    />

                </div>

            </div>

        </div>

    );

};


// =====================================================
// SUBJECT LIST
// =====================================================

const SubjectList = ({
    title,
    subtitle,
    subjects,
    high = false,
}) => {

    return (

        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${high
                        ? "bg-emerald-50"
                        : "bg-orange-50"
                        }`}
                >

                    {high ? (

                        <TrendingUp className="h-4 w-4 text-emerald-600" />

                    ) : (

                        <TrendingDown className="h-4 w-4 text-orange-500" />

                    )}

                </div>


                <div>

                    <h2 className="font-bold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        {subtitle}
                    </p>

                </div>

            </div>


            <div className="mt-5 space-y-3">

                {subjects.length > 0 ? (

                    subjects.map(
                        (subject, index) => {

                            const marks =
                                getMarksStatic(
                                    subject
                                );


                            return (

                                <div
                                    key={`${getSubjectNameStatic(
                                        subject
                                    )}-${index}`}
                                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                                >

                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${high
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-orange-100 text-orange-700"
                                            }`}
                                    >

                                        {index + 1}

                                    </div>


                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-sm font-semibold text-slate-700">

                                            {getSubjectNameStatic(
                                                subject
                                            )}

                                        </p>


                                        <p className="mt-0.5 text-xs text-slate-400">

                                            {getSemesterStatic(
                                                subject
                                            )}

                                        </p>

                                    </div>


                                    <div className="text-right">

                                        <p
                                            className={`text-lg font-bold ${high
                                                ? "text-emerald-600"
                                                : "text-orange-500"
                                                }`}
                                        >

                                            {formatMarksStatic(
                                                marks
                                            )}

                                        </p>


                                        <p className="text-[10px] text-slate-400">
                                            Marks
                                        </p>

                                    </div>

                                </div>

                            );

                        }
                    )

                ) : (

                    <div className="rounded-xl bg-slate-50 p-6 text-center">

                        <BookOpen className="mx-auto h-7 w-7 text-slate-300" />

                        <p className="mt-2 text-sm text-slate-400">
                            No subject data available.
                        </p>

                    </div>

                )}

            </div>

        </section>

    );

};


// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({ text }) => {

    return (

        <div className="flex min-h-[180px] items-center justify-center">

            <div className="text-center">

                <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-2 text-sm text-slate-400">
                    {text}
                </p>

            </div>

        </div>

    );

};


// =====================================================
// STATIC HELPERS
// =====================================================

const getMarksStatic = (subject) => {

    return Number(
        subject?.marks ??
        subject?.obtainedMarks ??
        subject?.totalMarksObtained ??
        subject?.score ??
        subject?.percentage ??
        0
    ) || 0;

};


const getSubjectNameStatic = (subject) => {

    return (
        subject?.subjectName ||
        subject?.subject ||
        subject?.name ||
        subject?.subjectCode ||
        "Subject"
    );

};


const getSemesterStatic = (subject) => {

    return (
        subject?.semesterName ||
        subject?.semester ||
        subject?.semesterNumber ||
        "Semester"
    );

};


const formatMarksStatic = (value) => {

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "0";
    }

    return Number.isInteger(number)
        ? number
        : number.toFixed(2);

};


export default SubjectAnalysis;