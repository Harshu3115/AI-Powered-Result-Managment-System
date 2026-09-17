import React, { useEffect, useMemo, useState } from "react";

import {
    Activity,
    AlertTriangle,
    Award,
    Brain,
    CheckCircle2,
    Lightbulb,

    TrendingDown,
    TrendingUp,
    BookOpen,
    BarChart3,
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";

import studentService from "../../services/studentService";


const PerformanceAnalysis = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [performance, setPerformance] = useState(null);

    const [dashboardData, setDashboardData] = useState(null);

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadPageData();

    }, []);


    const loadPageData = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                performanceResponse,
                dashboardResponse,
                profileResponse,
            ] = await Promise.all([
                studentService.getPerformanceAnalysis(),
                studentService.getDashboard(),
                studentService.getProfile(),
            ]);


            console.log(
                "Performance Analysis API:",
                performanceResponse
            );

            console.log(
                "Performance Dashboard API:",
                dashboardResponse
            );

            console.log(
                "Performance Profile API:",
                profileResponse
            );


            // -----------------------------
            // AI PERFORMANCE
            // -----------------------------

            if (performanceResponse?.success) {

                setPerformance(
                    performanceResponse.data
                );

            }


            // -----------------------------
            // DASHBOARD
            // -----------------------------

            if (dashboardResponse?.success) {

                setDashboardData(
                    dashboardResponse.data
                );

            }


            // -----------------------------
            // PROFILE
            // -----------------------------

            if (profileResponse?.success) {

                setProfile(
                    profileResponse.data
                );

            }


            if (
                !performanceResponse?.success &&
                !dashboardResponse?.success
            ) {

                setError(
                    "Unable to load performance data."
                );

            }

        } catch (err) {

            console.error(
                "Performance Analysis Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load performance analysis."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // HELPERS
    // =====================================================

    const formatNumber = (value) => {

        const number = Number(value);

        if (Number.isNaN(number)) {

            return "0.00";

        }

        return number.toFixed(2);

    };


    const getText = (...values) => {

        for (const value of values) {

            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {

                return value;

            }

        }

        return "";

    };


    const getArray = (...values) => {

        for (const value of values) {

            if (Array.isArray(value)) {

                return value;

            }

        }

        return [];

    };


    const getItemText = (item) => {

        if (typeof item === "string") {

            return item;

        }

        if (!item) {

            return "";

        }

        return (
            item.description ||
            item.recommendation ||
            item.subject ||
            item.subjectName ||
            item.name ||
            item.message ||
            JSON.stringify(item)
        );

    };


    // =====================================================
    // REAL ACADEMIC VALUES
    // =====================================================

    const cgpa = dashboardData?.cgpa;

    const latestSgpa =
        dashboardData?.latestSgpa;

    const latestStatus =
        dashboardData?.latestResultStatus;


    // =====================================================
    // SEMESTER RESULTS
    // =====================================================

    const semesterResults = useMemo(() => {
        const data = getArray(
            dashboardData?.semesterResults,
            dashboardData?.results,
            dashboardData?.semesterPerformance
        );

        let totalSgpa = 0;
        let semesterCount = 0;

        return data
            .map((item, index) => {
                const semesterName =
                    item?.semesterName ||
                    item?.semester ||
                    item?.name ||
                    `Semester ${index + 1}`;

                const sgpa = Number(
                    item?.sgpa ??
                    item?.SGPA ??
                    item?.semesterSgpa ??
                    item?.semesterSGPA ??
                    item?.value ??
                    0
                );

                // Calculate cumulative CGPA
                if (sgpa > 0) {
                    totalSgpa += sgpa;
                    semesterCount++;
                }

                const calculatedCgpa =
                    semesterCount > 0
                        ? totalSgpa / semesterCount
                        : 0;

                return {
                    semesterName,

                    shortName: semesterName
                        .replace("Semester ", "Sem ")
                        .replace("semester ", "Sem "),

                    sgpa,

                    // Use backend CGPA if available,
                    // otherwise use calculated cumulative CGPA
                    cgpa: Number(
                        item?.cgpa ??
                        item?.CGPA ??
                        item?.cumulativeCgpa ??
                        item?.cumulativeCGPA ??
                        calculatedCgpa
                    ),

                    original: item,
                };
            })
            .filter(
                (item) =>
                    item.sgpa > 0 ||
                    item.cgpa > 0
            );
    }, [dashboardData]);


    // =====================================================
    // SUBJECT DATA
    // =====================================================

    const subjectPerformance = useMemo(() => {

        let subjects = [];


        // ---------------------------------------------
        // Try dashboard semester results
        // ---------------------------------------------

        const results =
            dashboardData?.semesterResults || [];


        results.forEach((result) => {

            const resultSubjects =
                result?.subjects ||
                result?.subjectResults ||
                result?.resultSubjects ||
                result?.marks ||
                [];


            if (Array.isArray(resultSubjects)) {

                resultSubjects.forEach((subject) => {

                    const marks = Number(
                        subject?.marks ??
                        subject?.obtainedMarks ??
                        subject?.totalMarksObtained ??
                        subject?.score ??
                        subject?.percentage ??
                        0
                    );


                    const name =
                        subject?.subjectName ||
                        subject?.subject ||
                        subject?.name ||
                        subject?.subjectCode ||
                        "Subject";


                    if (marks > 0) {

                        subjects.push({

                            subjectName: name,

                            marks,

                            grade:
                                subject?.grade ||
                                subject?.gradeName ||
                                "",

                            semester:
                                result?.semesterName ||
                                result?.semester ||
                                "",

                        });

                    }

                });

            }

        });


        // ---------------------------------------------
        // Try AI subject data if available
        // ---------------------------------------------

        if (subjects.length === 0) {

            const aiSubjects =
                performance?.subjectPerformance ||
                performance?.subjects ||
                performance?.subjectAnalysis ||
                [];


            if (Array.isArray(aiSubjects)) {

                aiSubjects.forEach((subject) => {

                    const marks = Number(
                        subject?.marks ??
                        subject?.score ??
                        subject?.percentage ??
                        0
                    );


                    if (marks > 0) {

                        subjects.push({

                            subjectName:
                                subject?.subjectName ||
                                subject?.subject ||
                                subject?.name ||
                                "Subject",

                            marks,

                            grade:
                                subject?.grade ||
                                "",

                            semester:
                                subject?.semesterName ||
                                subject?.semester ||
                                "",

                        });

                    }

                });

            }

        }


        return subjects;

    }, [dashboardData, performance]);


    // =====================================================
    // HIGHEST SUBJECTS
    // =====================================================

    const highestSubjects = useMemo(() => {

        return [...subjectPerformance]
            .sort(
                (a, b) =>
                    b.marks - a.marks
            )
            .slice(0, 5);

    }, [subjectPerformance]);


    // =====================================================
    // WEAK SUBJECTS
    // =====================================================

    const weakSubjects = useMemo(() => {

        return [...subjectPerformance]
            .sort(
                (a, b) =>
                    a.marks - b.marks
            )
            .slice(0, 5);

    }, [subjectPerformance]);


    // =====================================================
    // AI DATA
    // =====================================================

    const summary = getText(
        performance?.summary,
        performance?.analysis,
        performance?.performanceSummary,
        performance?.overallAnalysis
    );


    const strengths = getArray(
        performance?.strengths,
        performance?.keyStrengths
    );


    const weaknesses = getArray(
        performance?.weaknesses,
        performance?.areasToImprove,
        performance?.areasForImprovement
    );


    const recommendations = getArray(
        performance?.recommendations,
        performance?.aiRecommendations,
        performance?.suggestions
    );


    // =====================================================
    // CHART DATA
    // =====================================================

    const sgpaChartData = semesterResults.map(
        (item) => ({
            semester: item.shortName,
            sgpa: Number(item.sgpa.toFixed(2)),
        })
    );


    const cgpaChartData = semesterResults.map(
        (item) => ({
            semester: item.shortName,
            cgpa: Number(item.cgpa.toFixed(2)),
        })
    );


    const semesterComparisonData =
        semesterResults.map(
            (item) => ({
                semester: item.shortName,
                sgpa: Number(item.sgpa.toFixed(2)),
            })
        );


    const subjectChartData =
        subjectPerformance
            .slice()
            .sort(
                (a, b) =>
                    b.marks - a.marks
            )
            .slice(0, 10)
            .map((item) => ({

                subject:
                    item.subjectName.length > 18
                        ? `${item.subjectName.slice(0, 18)}...`
                        : item.subjectName,

                marks: Number(
                    item.marks.toFixed(2)
                ),

            }));


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

                {payload.map((entry, index) => (
                    <p
                        key={index}
                        className="mt-1 text-sm font-bold text-slate-800"
                    >
                        {entry.name}:{" "}
                        {Number(entry.value).toFixed(2)}
                    </p>
                ))}

            </div>
        );
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            <StudentSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
            />

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

                <StudentTopbar
                    title="Performance Analysis"
                    onMenuClick={() => setSidebarOpen(true)}
                    onSidebarToggle={() =>
                        setSidebarCollapsed((prev) => !prev)
                    }
                    sidebarCollapsed={sidebarCollapsed}
                    dashboardData={profile}
                />

                <main className="mx-auto max-w-[1500px] space-y-6 px-4 pb-6 pt-20 sm:px-6">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">

                                <BarChart3 className="h-5 w-5 text-indigo-600" />

                            </div>


                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">

                                    Performance Analysis

                                </h1>


                                <p className="mt-1 text-sm text-slate-500">

                                    Understand your academic performance
                                    through semester and subject-level insights.

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* SKELETON */}

                    {loading && <SkeletonLoader />}

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {!loading && error && (

                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">

                            <div className="flex items-start gap-3">

                                <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />

                                <div>

                                    <h3 className="font-semibold text-red-700">

                                        Unable to load performance

                                    </h3>


                                    <p className="mt-1 text-sm text-red-600">

                                        {error}

                                    </p>


                                    <button
                                        type="button"
                                        onClick={loadPageData}
                                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                    >

                                        Try Again

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        DATA
                    ================================================= */}

                    {!loading && !error && (

                        <>


                            {/* =================================================
                                STAT CARDS
                            ================================================= */}

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">


                                {/* CGPA */}

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-medium text-slate-400">
                                                Overall CGPA
                                            </p>

                                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                                {formatNumber(cgpa)}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Out of 10
                                            </p>

                                        </div>


                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">

                                            <Award className="h-5 w-5 text-indigo-600" />

                                        </div>

                                    </div>

                                </div>


                                {/* SGPA */}

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-medium text-slate-400">
                                                Latest SGPA
                                            </p>

                                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                                {formatNumber(latestSgpa)}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Latest semester
                                            </p>

                                        </div>


                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

                                            <TrendingUp className="h-5 w-5 text-emerald-600" />

                                        </div>

                                    </div>

                                </div>


                                {/* RESULT */}

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-medium text-slate-400">
                                                Latest Result
                                            </p>

                                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                                {latestStatus || "N/A"}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Academic status
                                            </p>

                                        </div>


                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">

                                            <CheckCircle2 className="h-5 w-5 text-violet-600" />

                                        </div>

                                    </div>

                                </div>


                                {/* SEMESTERS */}

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-medium text-slate-400">
                                                Semesters
                                            </p>

                                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                                {semesterResults.length}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Results available
                                            </p>

                                        </div>


                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

                                            <BookOpen className="h-5 w-5 text-orange-500" />

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                SGPA LINE CHART
                            ================================================= */}

                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            SGPA Progression
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Semester-wise SGPA performance
                                        </p>

                                    </div>


                                    <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5">

                                        <TrendingUp className="h-4 w-4 text-indigo-600" />

                                        <span className="text-xs font-semibold text-indigo-600">
                                            SGPA
                                        </span>

                                    </div>

                                </div>


                                <div className="mt-6 h-[320px] w-full">

                                    {sgpaChartData.length > 0 ? (

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <LineChart
                                                data={sgpaChartData}
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 0,
                                                    bottom: 10,
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="semester"
                                                    tick={{
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <YAxis
                                                    domain={[
                                                        0,
                                                        10,
                                                    ]}
                                                    tick={{
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <Tooltip
                                                    content={
                                                        <CustomTooltip />
                                                    }
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="sgpa"
                                                    name="SGPA"
                                                    stroke="#4f46e5"
                                                    strokeWidth={3}
                                                    dot={{
                                                        r: 5,
                                                    }}
                                                    activeDot={{
                                                        r: 7,
                                                    }}
                                                />

                                            </LineChart>

                                        </ResponsiveContainer>

                                    ) : (




                                        <EmptyChart
                                            text="Semester SGPA data is not available."
                                        />

                                    )}

                                </div>

                            </section>


                            {/* =================================================
                                SEMESTER COMPARISON + CGPA
                            ================================================= */}

                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


                                {/* SEMESTER COMPARISON */}

                                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            Semester Comparison
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Compare SGPA across semesters
                                        </p>

                                    </div>


                                    <div className="mt-6 h-[300px]">

                                        {semesterComparisonData.length > 0 ? (

                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >

                                                <BarChart
                                                    data={
                                                        semesterComparisonData
                                                    }
                                                >

                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        vertical={false}
                                                    />

                                                    <XAxis
                                                        dataKey="semester"
                                                        tick={{
                                                            fontSize: 11,
                                                        }}
                                                    />

                                                    <YAxis
                                                        domain={[
                                                            0,
                                                            10,
                                                        ]}
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
                                                        dataKey="sgpa"
                                                        name="SGPA"
                                                        fill="#6366f1"
                                                        radius={[
                                                            6,
                                                            6,
                                                            0,
                                                            0,
                                                        ]}
                                                    />

                                                </BarChart>

                                            </ResponsiveContainer>

                                        ) : (

                                            <EmptyChart
                                                text="Semester comparison data is not available."
                                            />

                                        )}

                                    </div>

                                </section>


                                {/* CGPA PROGRESSION */}

                                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            CGPA Progression
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Cumulative academic performance
                                        </p>

                                    </div>


                                    <div className="mt-6 h-[300px]">

                                        {cgpaChartData.length > 0 ? (

                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >

                                                <LineChart
                                                    data={cgpaChartData}
                                                >

                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        vertical={false}
                                                    />

                                                    <XAxis
                                                        dataKey="semester"
                                                        tick={{
                                                            fontSize: 11,
                                                        }}
                                                    />

                                                    <YAxis
                                                        domain={[
                                                            0,
                                                            10,
                                                        ]}
                                                        tick={{
                                                            fontSize: 11,
                                                        }}
                                                    />

                                                    <Tooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />

                                                    <Line
                                                        type="monotone"
                                                        dataKey="cgpa"
                                                        name="CGPA"
                                                        stroke="#10b981"
                                                        strokeWidth={3}
                                                        dot={{
                                                            r: 4,
                                                        }}
                                                    />

                                                </LineChart>

                                            </ResponsiveContainer>

                                        ) : (

                                            <EmptyChart
                                                text="CGPA progression data is not available."
                                            />

                                        )}

                                    </div>

                                </section>

                            </div>


                            {/* =================================================
                                SUBJECT-WISE PERFORMANCE
                            ================================================= */}

                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">

                                        <BookOpen className="h-4 w-4 text-indigo-600" />

                                    </div>


                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            Subject-wise Performance
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Performance across your subjects
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-6 h-[360px]">

                                    {subjectChartData.length > 0 ? (

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={subjectChartData}
                                                layout="vertical"
                                                margin={{
                                                    left: 20,
                                                    right: 20,
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
                                                    width={130}
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

                                        <EmptyChart
                                            text="Subject-wise marks are not available."
                                        />

                                    )}

                                </div>

                            </section>


                            {/* =================================================
                                HIGHEST + WEAK SUBJECTS
                            ================================================= */}

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


                                {/* HIGHEST */}

                                <SubjectList
                                    title="Highest-Scoring Subjects"
                                    subtitle="Your strongest subject performances"
                                    icon={
                                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    }
                                    iconBg="bg-emerald-50"
                                    subjects={highestSubjects}
                                    type="high"
                                />


                                {/* WEAK */}

                                <SubjectList
                                    title="Weak Subjects"
                                    subtitle="Subjects that need more attention"
                                    icon={
                                        <TrendingDown className="h-4 w-4 text-orange-500" />
                                    }
                                    iconBg="bg-orange-50"
                                    subjects={weakSubjects}
                                    type="weak"
                                />

                            </div>


                            {/* =================================================
                                AI SUMMARY
                            ================================================= */}

                            {summary && (

                                <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 sm:p-6">

                                    <div className="flex items-start gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">

                                            <Brain className="h-5 w-5" />

                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <h2 className="font-bold text-slate-900">
                                                AI Performance Summary
                                            </h2>


                                            <div className="mt-3 max-h-48 overflow-y-auto pr-2 text-sm leading-6 text-slate-600">

                                                {summary}

                                            </div>

                                        </div>

                                    </div>

                                </section>

                            )}


                            {/* =================================================
                                AI STRENGTHS + WEAKNESSES
                            ================================================= */}

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


                                {/* STRENGTHS */}

                                <AiListCard
                                    title="AI Identified Strengths"
                                    subtitle="Areas where you are performing well"
                                    icon={
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    }
                                    iconBg="bg-emerald-50"
                                    items={strengths}
                                    emptyText="No AI strength data available."
                                />


                                {/* WEAKNESSES */}

                                <AiListCard
                                    title="AI Areas to Improve"
                                    subtitle="Areas that require more focus"
                                    icon={
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                    }
                                    iconBg="bg-orange-50"
                                    items={weaknesses}
                                    emptyText="No AI improvement data available."
                                />

                            </div>


                            {/* =================================================
                                AI RECOMMENDATIONS
                            ================================================= */}

                            <AiListCard
                                title="AI Recommendations"
                                subtitle="Personalized recommendations based on your academic performance"
                                icon={
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                }
                                iconBg="bg-amber-50"
                                items={recommendations}
                                numbered
                                emptyText="No AI recommendations available."
                            />

                        </>

                    )}

                </main>

            </div>

        </div>

    );

};





// =====================================================
// EMPTY CHART
// =====================================================

const EmptyChart = ({ text }) => {

    return (

        <div className="flex h-full items-center justify-center rounded-xl bg-slate-50">

            <div className="text-center">

                <Activity className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-2 text-sm text-slate-400">
                    {text}
                </p>

            </div>

        </div>

    );

};


// =====================================================
// SKELETON LOADER
// =====================================================

const SkeletonLoader = () => {

    return (
        <div className="space-y-6 animate-pulse">

            {/* TOP HEADER */}
            <div className="h-28 w-full rounded-2xl bg-slate-200" />

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <div className="h-36 rounded-2xl bg-slate-200" />
                <div className="h-36 rounded-2xl bg-slate-200" />
                <div className="h-36 rounded-2xl bg-slate-200" />
                <div className="h-36 rounded-2xl bg-slate-200" />

            </div>

            {/* MAIN CHART */}
            <div className="h-[400px] w-full rounded-2xl bg-slate-200" />

            {/* TWO CHARTS */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                <div className="h-[350px] rounded-2xl bg-slate-200" />

                <div className="h-[350px] rounded-2xl bg-slate-200" />

            </div>

            {/* SUBJECT PERFORMANCE */}
            <div className="h-[400px] w-full rounded-2xl bg-slate-200" />

            {/* SUBJECT LISTS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <div className="h-80 rounded-2xl bg-slate-200" />

                <div className="h-80 rounded-2xl bg-slate-200" />

            </div>

            {/* AI SUMMARY */}
            <div className="h-40 w-full rounded-2xl bg-slate-200" />

            {/* AI CARDS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <div className="h-64 rounded-2xl bg-slate-200" />

                <div className="h-64 rounded-2xl bg-slate-200" />

            </div>

            {/* AI RECOMMENDATIONS */}
            <div className="h-72 w-full rounded-2xl bg-slate-200" />

        </div>
    );
};


// =====================================================
// SUBJECT LIST
// =====================================================

const SubjectList = ({
    title,
    subtitle,
    icon,
    iconBg,
    subjects,
    type,
}) => {

    return (

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
                >
                    {icon}
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
                        (subject, index) => (

                            <div
                                key={`${subject.subjectName}-${index}`}
                                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                            >

                                <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${type === "high"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-orange-100 text-orange-700"
                                        }`}
                                >
                                    {index + 1}
                                </div>


                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-sm font-semibold text-slate-700">
                                        {subject.subjectName}
                                    </p>


                                    {subject.grade && (

                                        <p className="mt-0.5 text-xs text-slate-400">
                                            Grade: {subject.grade}
                                        </p>

                                    )}

                                </div>


                                <div className="text-right">

                                    <p
                                        className={`text-lg font-bold ${type === "high"
                                            ? "text-emerald-600"
                                            : "text-orange-500"
                                            }`}
                                    >
                                        {formatMarks(
                                            subject.marks
                                        )}
                                    </p>

                                    <p className="text-[10px] text-slate-400">
                                        Marks
                                    </p>

                                </div>

                            </div>

                        )
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
// AI LIST CARD
// =====================================================

const AiListCard = ({
    title,
    subtitle,
    icon,
    iconBg,
    items,
    numbered = false,
    emptyText,
}) => {

    return (

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
                >
                    {icon}
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


            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">

                {items.length > 0 ? (

                    items.map(
                        (item, index) => (

                            <div
                                key={index}
                                className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"
                            >

                                {numbered ? (

                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-indigo-600">
                                        {index + 1}
                                    </span>

                                ) : (

                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

                                )}


                                <p className="text-sm leading-5 text-slate-600">

                                    {getItemTextStatic(item)}

                                </p>

                            </div>

                        )
                    )

                ) : (

                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">
                        {emptyText}
                    </p>

                )}

            </div>

        </section>

    );

};


// =====================================================
// STATIC HELPERS FOR COMPONENTS
// =====================================================

const formatMarks = (value) => {

    const number = Number(value);

    if (Number.isNaN(number)) {

        return "0";

    }

    return Number.isInteger(number)
        ? number
        : number.toFixed(2);

};


const getItemTextStatic = (item) => {

    if (typeof item === "string") {

        return item;

    }

    if (!item) {

        return "";

    }

    return (
        item.description ||
        item.recommendation ||
        item.subject ||
        item.subjectName ||
        item.name ||
        item.message ||
        JSON.stringify(item)
    );

};


export default PerformanceAnalysis;