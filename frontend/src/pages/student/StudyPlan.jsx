import React, { useEffect, useMemo, useState } from "react";
import {
    BookOpen,
    Brain,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Target,
    TrendingUp,
    AlertTriangle,
    Sparkles,
    ChevronDown,
    Flame,
} from "lucide-react";

import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";
import studentService from "../../services/studentService";


const StudyPlan = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [dashboardData, setDashboardData] = useState(null);

    const [studyPlan, setStudyPlan] = useState(null);

    const [selectedSemester, setSelectedSemester] =
        useState();

    const [profile, setProfile] = useState(null);


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                dashboardResponse,
                studyPlanResponse,
                profileResponse,
            ] = await Promise.all([
                studentService.getDashboard(),
                studentService.getStudyPlan(),
                studentService.getProfile(),
            ]);


            // =================================================
            // DASHBOARD
            // =================================================

            if (dashboardResponse?.success) {
                const data = dashboardResponse.data;

                setDashboardData(data);

                const results = data?.semesterResults || [];

                if (results.length > 0) {
                    setSelectedSemester(
                        results[results.length - 1]?.semesterName || ""
                    );
                }

                console.log("Study Plan Dashboard API:", dashboardResponse);
            }

            if (profileResponse?.success) {
                setProfile(profileResponse.data);

                console.log(
                    "Study Plan Profile API:",
                    profileResponse
                );
            } else {
                setProfile(
                    profileResponse?.data ||
                    profileResponse ||
                    null
                );
            }


            // =================================================
            // AI STUDY PLAN
            // =================================================

            if (studyPlanResponse?.success) {

                setStudyPlan(
                    studyPlanResponse.data
                );

                console.log(
                    "Study Plan API:",
                    studyPlanResponse
                );

            } else {

                setStudyPlan(
                    studyPlanResponse?.data ||
                    studyPlanResponse ||
                    null
                );

            }

        } catch (err) {

            console.error(
                "Study Plan API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load study plan."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // SEMESTERS
    // =========================================================

    const semesters = useMemo(() => {

        return (
            dashboardData?.semesterResults
                ?.map(
                    (result) =>
                        result?.semesterName
                )
                .filter(Boolean)
                .filter(
                    (value, index, array) =>
                        array.indexOf(value) === index
                ) || []
        );

    }, [dashboardData]);


    // =========================================================
    // CURRENT SEMESTER
    // =========================================================

    const currentSemester =
        dashboardData?.currentSemester ||
        semesters[semesters.length - 1] ||
        "Current Semester";


    // =========================================================
    // SELECTED SEMESTER RESULT
    // =========================================================

    const selectedSemesterResult = useMemo(() => {
        const results = dashboardData?.semesterResults || [];

        if (!results.length) {
            return null;
        }

        if (!selectedSemester) {
            return results[results.length - 1];
        }

        return (
            results.find(
                (result) =>
                    String(result?.semesterName) ===
                    String(selectedSemester)
            ) || results[results.length - 1]
        );
    }, [dashboardData, selectedSemester]);


    // =========================================================
    // SUBJECTS
    // =========================================================

    const subjects =
        selectedSemesterResult?.subjects || [];


    // =========================================================
    // SUBJECT HELPERS
    // =========================================================

    const getSubjectName = (subject) => {

        return (
            subject?.subjectName ||
            subject?.name ||
            subject?.subject ||
            "Unknown Subject"
        );

    };


    const getMarks = (subject) => {

        const value =
            subject?.obtainedMarks ??
            subject?.marks ??
            subject?.percentage ??
            0;

        return Number(value) || 0;

    };


    const getGrade = (subject) => {

        return (
            subject?.grade ||
            "-"
        );

    };


    // =========================================================
    // SORT SUBJECTS BY PERFORMANCE
    // =========================================================

    const sortedSubjects = useMemo(() => {

        return [...subjects].sort(
            (a, b) =>
                getMarks(a) -
                getMarks(b)
        );

    }, [subjects]);


    const weakSubjects =
        sortedSubjects.slice(0, 3);


    const strongSubjects =
        [...subjects]
            .sort(
                (a, b) =>
                    getMarks(b) -
                    getMarks(a)
            )
            .slice(0, 3);


    // =========================================================
    // STUDY PLAN DATA HELPERS
    // =========================================================

    const getPlanArray = (...keys) => {

        if (!studyPlan) {
            return [];
        }

        for (const key of keys) {

            if (
                Array.isArray(
                    studyPlan?.[key]
                )
            ) {

                return studyPlan[key];

            }

        }

        return [];

    };


    const recommendations =
        getPlanArray(
            "recommendations",
            "studyRecommendations",
            "recommendation"
        );


    const weeklyPlan =
        getPlanArray(
            "weeklyPlan",
            "weeklySchedule",
            "schedule",
            "dailyPlan",
            "studySchedule"
        );


    const priorities =
        getPlanArray(
            "priorities",
            "studyPriorities",
            "prioritySubjects"
        );


    // =========================================================
    // DISPLAY VALUE HELPERS
    // =========================================================

    const getValue = (
        object,
        keys,
        fallback = ""
    ) => {

        if (!object) {
            return fallback;
        }

        for (const key of keys) {

            if (
                object[key] !== undefined &&
                object[key] !== null &&
                object[key] !== ""
            ) {

                return object[key];

            }

        }

        return fallback;

    };


    // =========================================================
    // STUDY HOURS
    // =========================================================

    const recommendedHours =
        getValue(
            studyPlan,
            [
                "recommendedHours",
                "dailyStudyHours",
                "studyHours",
                "hoursPerDay",
            ],
            "2"
        );


    // =========================================================
    // TARGET
    // =========================================================

    const target =
        getValue(
            studyPlan,
            [
                "target",
                "targetPercentage",
                "targetScore",
                "targetCgpa",
            ],
            null
        );


    // =========================================================
    // AI SUMMARY
    // =========================================================

    const aiSummary = getValue(
        studyPlan,
        [
            "summary",
            "studySummary",
            "message",
            "overview",
            "description"
        ],
        ""
    );


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <StudentSidebar
                    open={sidebarOpen}
                    collapsed={sidebarCollapsed}
                    onClose={() => setSidebarOpen(false)}
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
                        onMenuClick={() => setSidebarOpen(true)}
                        onSidebarToggle={() =>
                            setSidebarCollapsed((prev) => !prev)
                        }
                        sidebarCollapsed={sidebarCollapsed}
                        dashboardData={dashboardData}
                        profile={profile}
                        title="Study Plan"
                    />

                    <main className="min-w-0 px-4 pb-10 pt-20 sm:px-6 lg:px-8">

                        <div className="mx-auto w-full max-w-[1500px]">

                            <div className="animate-pulse space-y-6">

                                <div className="h-32 rounded-2xl bg-slate-200" />

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                                    <div className="h-32 rounded-2xl bg-slate-200" />
                                    <div className="h-32 rounded-2xl bg-slate-200" />
                                    <div className="h-32 rounded-2xl bg-slate-200" />

                                </div>

                                <div className="h-80 rounded-2xl bg-slate-200" />

                            </div>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}
            <StudentSidebar
                open={sidebarOpen}
                collapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
            />

            {/* CONTENT AREA */}
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
                    title="Study Plan"
                />

                {/* PAGE CONTENT */}
                <main
                    className="
                        min-w-0
                        px-4
                        pb-10
                        pt-20
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[1500px]
                            min-w-0
                            flex
                            flex-col
                            gap-6
                        "
                    >


                        {/* =================================================
                                HEADER
                            ================================================= */}

                        <section className="rounded-2xl bg-gradient-to-r from-rose-500 to-rose-500 p-6 text-white shadow-lg">

                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                <div>

                                    <div className="mb-2 flex items-center gap-2">

                                        <Sparkles className="h-5 w-5" />

                                        <span className="text-sm font-semibold text-indigo-100">
                                            AI Powered Study Planner
                                        </span>

                                    </div>

                                    <h1 className="text-2xl font-extrabold sm:text-3xl">
                                        Your Personalized Study Plan
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
                                        Build better study habits by focusing on your weak subjects,
                                        improving consistency and maintaining your strong performance.
                                    </p>

                                </div>


                                {/* SEMESTER */}

                                <div className="relative shrink-0">

                                    <select
                                        value={
                                            selectedSemester
                                        }
                                        onChange={(e) =>
                                            setSelectedSemester(
                                                e.target.value
                                            )
                                        }
                                        className="appearance-none rounded-xl border border-white/20 bg-white/15 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none backdrop-blur-sm"
                                    >

                                        <option
                                            value="all"
                                            className="text-slate-800"
                                        >
                                            Current Semester
                                        </option>

                                        {semesters.map(
                                            (semester) => (

                                                <option
                                                    key={
                                                        semester
                                                    }
                                                    value={
                                                        semester
                                                    }
                                                    className="text-slate-800"
                                                >
                                                    {semester}
                                                </option>

                                            )
                                        )}

                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                                ERROR
                            ================================================= */}

                        {error && (

                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                                {error}

                            </div>

                        )}


                        {/* =================================================
                                QUICK STATS
                            ================================================= */}

                        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">


                            {/* CURRENT SGPA */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">

                                        <TrendingUp className="h-5 w-5 text-indigo-600" />

                                    </div>

                                    <span className="text-xs font-semibold text-slate-400">
                                        {selectedSemesterResult?.semesterName ||
                                            currentSemester}
                                    </span>

                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-500">
                                    SGPA
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-slate-900">

                                    {selectedSemesterResult?.sgpa ??
                                        dashboardData?.latestSgpa ??
                                        "—"}

                                </p>

                            </div>


                            {/* CGPA */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">

                                    <Target className="h-5 w-5 text-violet-600" />

                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-500">
                                    Current CGPA
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-slate-900">

                                    {dashboardData?.cgpa?.toFixed
                                        ? dashboardData.cgpa.toFixed(2)
                                        : "—"}

                                </p>

                            </div>


                            {/* STUDY HOURS */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

                                    <Clock3 className="h-5 w-5 text-emerald-600" />

                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-500">
                                    Recommended Daily
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-slate-900">

                                    {recommendedHours}

                                    <span className="ml-1 text-sm font-medium text-slate-400">
                                        hrs
                                    </span>

                                </p>

                            </div>


                            {/* TARGET */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">

                                    <Flame className="h-5 w-5 text-amber-600" />

                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-500">
                                    Target
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-slate-900">

                                    {target || "Improve"}

                                </p>

                            </div>

                        </div>


                        {/* =================================================
                                AI SUMMARY
                            ================================================= */}

                        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">

                            <div className="flex items-start gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">

                                    <Brain className="h-5 w-5" />

                                </div>

                                <div className="min-w-0">



                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-indigo-900">
                                            AI Recommendation
                                        </p>

                                        {aiSummary ? (
                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                {aiSummary}
                                            </p>
                                        ) : (
                                            <p className="mt-1 text-sm text-slate-400">
                                                No AI recommendation available.
                                            </p>
                                        )}
                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                                MAIN GRID
                            ================================================= */}

                        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-3">


                            {/* =================================================
                                    STUDY PRIORITY
                                ================================================= */}

                            <section className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

                                <div className="flex items-center justify-between border-b border-slate-100 p-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">

                                            <AlertTriangle className="h-4 w-4 text-red-500" />

                                        </div>

                                        <div>

                                            <h2 className="font-bold text-slate-900">
                                                Study Priority
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Subjects that need more attention
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="divide-y divide-slate-100">

                                    {priorities.length > 0 ? (

                                        priorities.map(
                                            (item, index) => {

                                                const name =
                                                    getValue(
                                                        item,
                                                        [
                                                            "subjectName",
                                                            "subject",
                                                            "name"
                                                        ],
                                                        `Subject ${index + 1}`
                                                    );

                                                const itemMarks =
                                                    Number(
                                                        getValue(
                                                            item,
                                                            [
                                                                "marks",
                                                                "percentage",
                                                                "score"
                                                            ],
                                                            0
                                                        )
                                                    );

                                                const priority =
                                                    getValue(
                                                        item,
                                                        [
                                                            "priority",
                                                            "level"
                                                        ],
                                                        index === 0
                                                            ? "HIGH"
                                                            : "MEDIUM"
                                                    );


                                                return (

                                                    <div
                                                        key={index}
                                                        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                                                    >

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">

                                                                <BookOpen className="h-4 w-4 text-indigo-500" />

                                                            </div>

                                                            <div>

                                                                <p className="font-semibold text-slate-800">
                                                                    {name}
                                                                </p>

                                                                <p className="mt-1 text-xs text-slate-400">

                                                                    Current Score:
                                                                    {" "}
                                                                    {itemMarks || "—"}

                                                                </p>

                                                            </div>

                                                        </div>


                                                        <span
                                                            className={`w-fit rounded-full px-3 py-1 text-[11px] font-bold ${String(priority).toUpperCase() ===
                                                                "HIGH"
                                                                ? "bg-red-50 text-red-600"
                                                                : String(priority).toUpperCase() ===
                                                                    "MEDIUM"
                                                                    ? "bg-amber-50 text-amber-600"
                                                                    : "bg-emerald-50 text-emerald-600"
                                                                }`}
                                                        >
                                                            {String(
                                                                priority
                                                            ).toUpperCase()}
                                                        </span>

                                                    </div>

                                                );

                                            }
                                        )

                                    ) : (

                                        weakSubjects.length > 0 ? (

                                            weakSubjects.map(
                                                (
                                                    subject,
                                                    index
                                                ) => (

                                                    <div
                                                        key={
                                                            getSubjectName(
                                                                subject
                                                            )
                                                        }
                                                        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                                                    >

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">

                                                                <AlertTriangle className="h-4 w-4 text-red-500" />

                                                            </div>

                                                            <div>

                                                                <p className="font-semibold text-slate-800">
                                                                    {getSubjectName(
                                                                        subject
                                                                    )}
                                                                </p>

                                                                <p className="mt-1 text-xs text-slate-400">

                                                                    Current:
                                                                    {" "}
                                                                    {getMarks(
                                                                        subject
                                                                    )}
                                                                    /100

                                                                </p>

                                                            </div>

                                                        </div>


                                                        <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600">

                                                            {index === 0
                                                                ? "HIGH"
                                                                : "MEDIUM"}

                                                        </span>

                                                    </div>

                                                )
                                            )

                                        ) : (

                                            <div className="p-6 text-sm text-slate-400">
                                                No priority subjects available.
                                            </div>

                                        )

                                    )}

                                </div>

                            </section>


                            {/* =================================================
                                    STRONG SUBJECTS
                                ================================================= */}

                            <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <div className="border-b border-slate-100 p-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">

                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                                        </div>

                                        <div>

                                            <h2 className="font-bold text-slate-900">
                                                Strong Subjects
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Keep maintaining these
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="space-y-3 p-5">

                                    {strongSubjects.length > 0 ? (

                                        strongSubjects.map(
                                            (subject) => (

                                                <div
                                                    key={getSubjectName(
                                                        subject
                                                    )}
                                                    className="flex items-center justify-between rounded-xl bg-emerald-50/60 p-3"
                                                >

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                                                        <p className="truncate text-sm font-semibold text-slate-700">
                                                            {getSubjectName(
                                                                subject
                                                            )}
                                                        </p>

                                                    </div>

                                                    <span className="ml-2 text-sm font-bold text-emerald-600">
                                                        {getMarks(
                                                            subject
                                                        )}
                                                    </span>

                                                </div>

                                            )

                                        )

                                    ) : (

                                        <p className="text-sm text-slate-400">
                                            No subject data available.
                                        </p>

                                    )}

                                </div>

                            </section>

                        </div>


                        {/* =================================================
                                WEEKLY PLAN
                            ================================================= */}

                        <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">

                                        <CalendarDays className="h-4 w-4 text-indigo-600" />

                                    </div>

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            Weekly Study Plan
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Follow this schedule consistently
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="p-5">

                                {weeklyPlan.length > 0 ? (

                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

                                        {weeklyPlan.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const day =
                                                    getValue(
                                                        item,
                                                        [
                                                            "day",
                                                            "date",
                                                            "dayName"
                                                        ],
                                                        `Day ${index + 1}`
                                                    );

                                                const subject =
                                                    getValue(
                                                        item,
                                                        [
                                                            "subjectName",
                                                            "subject",
                                                            "topic"
                                                        ],
                                                        "Study Session"
                                                    );

                                                const hours =
                                                    getValue(
                                                        item,
                                                        [
                                                            "hours",
                                                            "duration",
                                                            "studyHours"
                                                        ],
                                                        recommendedHours
                                                    );


                                                return (

                                                    <div
                                                        key={index}
                                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30"
                                                    >

                                                        <div className="flex items-center justify-between">

                                                            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                                                                {day}
                                                            </p>

                                                            <Clock3 className="h-4 w-4 text-slate-300" />

                                                        </div>

                                                        <p className="mt-3 font-semibold text-slate-800">
                                                            {subject}
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-400">

                                                            Recommended:
                                                            {" "}
                                                            {hours}
                                                            {" "}
                                                            hrs

                                                        </p>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                ) : (

                                    /* FALLBACK WEEKLY PLAN */

                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

                                        {weakSubjects.map(
                                            (
                                                subject,
                                                index
                                            ) => (

                                                <div
                                                    key={getSubjectName(
                                                        subject
                                                    )}
                                                    className="rounded-xl border border-slate-200 p-4"
                                                >

                                                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                                                        Priority {index + 1}
                                                    </p>

                                                    <p className="mt-3 font-semibold text-slate-800">
                                                        {getSubjectName(
                                                            subject
                                                        )}
                                                    </p>

                                                    <p className="mt-2 text-xs text-slate-400">
                                                        Suggested:
                                                        {" "}
                                                        {recommendedHours}
                                                        {" "}
                                                        hrs
                                                    </p>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* =================================================
                                AI RECOMMENDATIONS
                            ================================================= */}

                        <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">

                                        <Brain className="h-4 w-4 text-violet-600" />

                                    </div>

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            AI Study Recommendations
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Personalized suggestions based on your performance
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="p-5">

                                {recommendations.length > 0 ? (

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                        {recommendations.map(
                                            (
                                                recommendation,
                                                index
                                            ) => {

                                                const text =
                                                    typeof recommendation ===
                                                        "string"
                                                        ? recommendation
                                                        : getValue(
                                                            recommendation,
                                                            [
                                                                "recommendation",
                                                                "message",
                                                                "text",
                                                                "description"
                                                            ],
                                                            "Review this area regularly."
                                                        );


                                                return (

                                                    <div
                                                        key={index}
                                                        className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                                                    >

                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">

                                                            <Sparkles className="h-4 w-4" />

                                                        </div>

                                                        <p className="text-sm leading-6 text-slate-600">
                                                            {text}
                                                        </p>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                ) : (

                                    <div className="space-y-3">

                                        {weakSubjects.length > 0 && (

                                            <div className="flex gap-3 rounded-xl bg-amber-50 p-4">

                                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                                                <p className="text-sm leading-6 text-slate-600">

                                                    Give additional practice time to{" "}

                                                    <span className="font-semibold text-slate-800">

                                                        {weakSubjects
                                                            .map(
                                                                (
                                                                    subject
                                                                ) =>
                                                                    getSubjectName(
                                                                        subject
                                                                    )
                                                            )
                                                            .join(
                                                                ", "
                                                            )}

                                                    </span>

                                                    .

                                                </p>

                                            </div>

                                        )}


                                        <div className="flex gap-3 rounded-xl bg-indigo-50 p-4">

                                            <Target className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

                                            <p className="text-sm leading-6 text-slate-600">

                                                Study for at least{" "}

                                                <span className="font-semibold text-slate-800">
                                                    {recommendedHours} hours
                                                </span>

                                                {" "}daily and revise previous topics regularly.

                                            </p>

                                        </div>


                                        <div className="flex gap-3 rounded-xl bg-emerald-50 p-4">

                                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                                            <p className="text-sm leading-6 text-slate-600">

                                                Continue maintaining your performance in your strongest subjects.

                                            </p>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </section>


                    </div>

                </main>

            </div>

        </div>

    );

};


export default StudyPlan;