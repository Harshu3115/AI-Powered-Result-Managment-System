import { useEffect, useState } from "react";

import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";

import { useNavigate } from "react-router-dom";

import {
    BookOpen,
    RefreshCw,
    CheckCircle2,
    Clock3,
    UserCircle,
    Mail,
    Building2,
    GraduationCap,
    ArrowRight,
    AlertCircle,
    Bot,
    LogOut,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import teacherService from "../../services/teacherService";

const TeacherDashboard = () => {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // =====================================================
    // FETCH DASHBOARD
    // =====================================================

    const fetchDashboard = async (showToast = false) => {

        try {

            setError("");

            if (showToast) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await teacherService.getDashboard();

            console.log("Teacher Dashboard Response:", response);

            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "Failed to load teacher dashboard"
                );
            }

            setDashboard(response.data);

            if (showToast) {
                toast.success("Dashboard refreshed");
            }

        } catch (err) {

            console.error("Teacher Dashboard Error:", err);

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load dashboard";

            setError(message);

            toast.error(message);

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {
        fetchDashboard();
    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged out successfully");

        setTimeout(() => {
            navigate("/login");
        }, 500);
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50 p-6">

                <div className="mx-auto max-w-7xl animate-pulse">

                    {/* Header */}

                    <div className="mb-8">

                        <div className="h-8 w-72 rounded bg-slate-200" />

                        <div className="mt-3 h-4 w-96 rounded bg-slate-200" />

                    </div>


                    {/* Statistics */}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-32 rounded-2xl bg-white shadow-sm"
                            />

                        ))}

                    </div>


                    {/* Main */}

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                        <div className="h-80 rounded-2xl bg-white lg:col-span-2" />

                        <div className="h-80 rounded-2xl bg-white" />

                    </div>

                </div>

            </div>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && !dashboard) {

        return (

            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">

                        <AlertCircle size={32} />

                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-800">
                        Unable to Load Dashboard
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={() => fetchDashboard()}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                    >

                        <RefreshCw size={18} />

                        Try Again

                    </button>

                </div>

            </div>

        );
    }


    // =====================================================
    // DATA
    // =====================================================

    const {
        teacherId,
        teacherName,
        email,
        departmentName,

        totalSubjects = 0,
        pendingRechecking = 0,
        completedRechecking = 0,

        assignedSubjects = [],

        recheckingRequests = [],
        reevaluationRequests = [],

        pendingReevaluation = 0,
        completedReevaluation = 0,

    } = dashboard || {};


    return (
        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}
            <TeacherSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
            />

            {/* MAIN AREA */}
            <div
                className={`
                min-h-screen
                w-full
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
                    onMenuClick={() => setSidebarOpen(true)}
                    onSidebarToggle={() =>
                        setSidebarCollapsed((prev) => !prev)
                    }
                    sidebarCollapsed={sidebarCollapsed}
                    dashboardData={dashboard}
                    title="Teacher Dashboard"
                />

                {/* =================================================
                MAIN CONTAINER
            ================================================= */}

                <main className="w-full px-6 pt-[96px] pb-6 sm:px-8 lg:px-8">


                    {/* =================================================
                    HEADER
                ================================================= */}

                    <section className="mb-8">

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div>

                                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                    Teacher Dashboard
                                </p>

                                <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
                                    Welcome back, {teacherName || "Teacher"} 👋
                                </h1>

                                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">

                                    <span className="flex items-center gap-2">
                                        <Building2 size={16} />
                                        {departmentName || "Department not available"}
                                    </span>

                                    <span className="hidden text-slate-300 sm:block">
                                        •
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <Mail size={16} />
                                        {email || "Email not available"}
                                    </span>

                                </div>

                            </div>


                            {/* Header Actions */}

                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() => fetchDashboard(true)}
                                    disabled={refreshing}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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

                        </div>

                    </section>


                    {/* =================================================
                    STATISTICS
                ================================================= */}

                    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {/* Total Subjects */}

                        <StatCard
                            title="Total Subjects"
                            value={totalSubjects}
                            icon={BookOpen}
                            description="Assigned subjects"
                            iconClass="bg-indigo-100 text-indigo-600"
                        />


                        {/* Pending Rechecking */}

                        <StatCard
                            title="Pending Rechecking"
                            value={pendingRechecking}
                            icon={Clock3}
                            description="Requests awaiting review"
                            iconClass="bg-amber-100 text-amber-600"
                        />


                        {/* Completed Rechecking */}

                        <StatCard
                            title="Completed Rechecking"
                            value={completedRechecking}
                            icon={CheckCircle2}
                            description="Successfully reviewed"
                            iconClass="bg-emerald-100 text-emerald-600"
                        />

                    </section>


                    {/* =================================================
                    MAIN GRID
                ================================================= */}

                    <section className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

                        {/* ASSIGNED SUBJECTS */}

                        {/* =================================================
    ASSIGNED SUBJECTS
================================================= */}

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

                            {/* HEADER */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        My Assigned Subjects
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Your recently assigned subjects
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">

                                    {/* SEE ALL */}
                                    {assignedSubjects.length > 3 && (
                                        <button
                                            type="button"
                                            onClick={() => navigate("/teacher/subjects")}
                                            className="
                        hidden
                        items-center
                        gap-1.5
                        text-sm
                        font-semibold
                        text-indigo-600
                        transition
                        hover:text-indigo-700
                        sm:flex
                    "
                                        >
                                            See All Subjects
                                            <ArrowRight size={16} />
                                        </button>
                                    )}

                                    {/* ICON */}
                                    <div className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
            ">
                                        <BookOpen size={20} />
                                    </div>

                                </div>

                            </div>


                            {/* SUBJECTS */}
                            <div className="p-6">

                                {assignedSubjects.length === 0 ? (

                                    <EmptyState
                                        icon={BookOpen}
                                        title="No subjects assigned"
                                        message="You currently don't have any assigned subjects."
                                    />

                                ) : (

                                    <>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                            {assignedSubjects
                                                .slice(0, 3)
                                                .map((subject) => (
                                                    <SubjectCard
                                                        key={subject.subjectId}
                                                        subject={subject}
                                                    />
                                                ))}

                                        </div>


                                        {/* MOBILE SEE ALL */}
                                        {assignedSubjects.length > 3 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate("/teacher/subjects")
                                                }
                                                className="
                            mt-5
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-indigo-100
                            bg-indigo-50
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-indigo-600
                            transition
                            hover:bg-indigo-100
                        "
                                            >
                                                See All Subjects
                                                <ArrowRight size={16} />
                                            </button>
                                        )}

                                    </>

                                )}

                            </div>

                        </div>

                        {/* TEACHER PROFILE */}
                        <div className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 px-6 py-5">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Teacher Profile
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Your account information
                                        </p>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <UserCircle size={21} />
                                    </div>

                                </div>

                            </div>


                            <div className="p-6">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <GraduationCap size={28} />
                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="truncate text-lg font-bold text-slate-900">
                                            {teacherName || "Teacher"}
                                        </h3>

                                        <p className="truncate text-sm text-slate-500">
                                            Teacher ID: {teacherId ?? "N/A"}
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-6 space-y-4">

                                    <ProfileRow
                                        icon={Mail}
                                        label="Email"
                                        value={email || "Not available"}
                                    />

                                    <ProfileRow
                                        icon={Building2}
                                        label="Department"
                                        value={departmentName || "Not available"}
                                    />

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
    RECHECKING REQUESTS
================================================= */}

                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* HEADER */}
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Latest Rechecking Requests
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Recently submitted student rechecking requests
                                </p>

                            </div>


                            <div className="flex items-center gap-3">

                                {/* SEE ALL */}
                                <button
                                    type="button"
                                    onClick={() => navigate("/teacher/rechecking")}
                                    className="
                    hidden
                    items-center
                    gap-1.5
                    text-sm
                    font-semibold
                    text-indigo-600
                    transition
                    hover:text-indigo-700
                    sm:flex
                "
                                >
                                    See All Requests
                                    <ArrowRight size={16} />
                                </button>


                                <div className="flex items-center gap-2">

                                    <StatusBadge
                                        status="PENDING"
                                        count={pendingRechecking}
                                    />

                                    <StatusBadge
                                        status="COMPLETED"
                                        count={completedRechecking}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* REQUESTS */}
                        <div className="p-6">

                            {recheckingRequests.length === 0 ? (

                                <EmptyState
                                    icon={RefreshCw}
                                    title="No rechecking requests"
                                    message="There are currently no rechecking requests assigned to you."
                                />

                            ) : (

                                <>

                                    <div className="space-y-4">

                                        {recheckingRequests
                                            .slice(0, 3)
                                            .map((request) => (

                                                <RecheckingCard
                                                    key={request.id}
                                                    request={request}
                                                />

                                            ))}

                                    </div>


                                    {/* MOBILE */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/teacher/rechecking")
                                        }
                                        className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-indigo-100
                        bg-indigo-50
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-indigo-600
                        transition
                        hover:bg-indigo-100
                        sm:hidden
                    "
                                    >
                                        See All Requests
                                        <ArrowRight size={16} />
                                    </button>

                                </>

                            )}

                        </div>

                    </section>

                    {/* =================================================
    RE-EVALUATION REQUESTS
================================================= */}

                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* HEADER */}
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    bg-violet-50
                    text-violet-600
                ">
                                        <RefreshCw size={19} />
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Latest Re-evaluation Requests
                                    </h2>

                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Recently submitted student re-evaluation requests
                                </p>

                            </div>


                            <div className="flex items-center gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/teacher/reevaluation")
                                    }
                                    className="
                    hidden
                    items-center
                    gap-1.5
                    text-sm
                    font-semibold
                    text-violet-600
                    transition
                    hover:text-violet-700
                    sm:flex
                "
                                >
                                    See All
                                    <ArrowRight size={16} />
                                </button>


                                <StatusBadge
                                    status="PENDING"
                                    count={pendingReevaluation}
                                />

                            </div>

                        </div>


                        {/* REQUEST LIST */}
                        <div className="p-6">

                            {reevaluationRequests.length === 0 ? (

                                <EmptyState
                                    icon={RefreshCw}
                                    title="No re-evaluation requests"
                                    message="There are currently no re-evaluation requests assigned to you."
                                />

                            ) : (

                                <>

                                    <div className="space-y-3">

                                        {reevaluationRequests
                                            .slice(0, 3)
                                            .map((request) => (

                                                <ReevaluationPreviewCard
                                                    key={request.id}
                                                    request={request}
                                                />

                                            ))}

                                    </div>


                                    {/* MOBILE */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/teacher/reevaluation")
                                        }
                                        className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-violet-100
                        bg-violet-50
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-violet-600
                        transition
                        hover:bg-violet-100
                        sm:hidden
                    "
                                    >
                                        See All Re-evaluation Requests
                                        <ArrowRight size={16} />
                                    </button>

                                </>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                    TEACHER AI
                ================================================= */}

                    <section className="mt-6">

                        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg md:p-8">

                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                                <div className="flex items-start gap-4">

                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">

                                        <Bot size={30} />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold md:text-2xl">
                                            Teacher AI Assistant
                                        </h2>

                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100 md:text-base">
                                            Get AI-powered academic insights,
                                            student performance analysis and
                                            teaching assistance.
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={() => navigate("/teacher/ai")}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
                                >

                                    Open Teacher AI

                                    <ArrowRight size={18} />

                                </button>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                    <section className="mt-6">

                        <div className="mb-4">

                            <h2 className="text-lg font-bold text-slate-900">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Quickly access your teacher tools
                            </p>

                        </div>


                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            <QuickAction
                                icon={BookOpen}
                                title="My Subjects"
                                description="View assigned subjects"
                                onClick={() => {
                                    navigate("/teacher/subjects");
                                }}
                            />

                            <QuickAction
                                icon={RefreshCw}
                                title="Rechecking"
                                description="Review requests"
                                onClick={() => {
                                    navigate("/teacher/rechecking");
                                }}
                            />

                            <QuickAction
                                icon={Bot}
                                title="Teacher AI"
                                description="Open AI assistant"
                                onClick={() => {
                                    navigate("/teacher/ai");
                                }}
                            />

                            <QuickAction
                                icon={UserCircle}
                                title="My Profile"
                                description="View profile"
                                onClick={() => {
                                    navigate("/teacher/profile");
                                }}
                            />

                        </div>

                    </section>


                    {/* =================================================
                    FOOTER
                ================================================= */}

                    <footer className="mt-10 border-t border-slate-200 py-6">

                        <div className="
        flex
        flex-col
        items-center
        justify-center
        gap-2
        text-sm
        text-slate-500
    ">

                            <p>
                                AI Powered Student Result Management System
                            </p>

                            <p className="text-xs text-slate-400">
                                © 2026 SRMS • Teacher Portal
                            </p>

                        </div>

                    </footer>

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


// =============================================================
// STAT CARD
// =============================================================

const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    iconClass,
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
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
                >

                    <Icon size={23} />

                </div>

            </div>

        </div>

    );
};


// =============================================================
// SUBJECT CARD
// =============================================================

const SubjectCard = ({ subject }) => {

    return (

        <div className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <div className="inline-flex rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">

                        {subject.subjectCode || "N/A"}

                    </div>

                    <h3 className="mt-3 line-clamp-2 font-bold text-slate-800">

                        {subject.subjectName ||
                            "Subject Name"}

                    </h3>

                </div>


                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">

                    <BookOpen size={17} />

                </div>

            </div>


            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">

                <span>
                    Semester:{" "}
                    <strong className="text-slate-700">
                        {subject.semesterName || "N/A"}
                    </strong>
                </span>

                <span>
                    Credits:{" "}
                    <strong className="text-slate-700">
                        {subject.credits ?? "N/A"}
                    </strong>
                </span>

            </div>

        </div>

    );
};


// =============================================================
// RECHECKING CARD
// =============================================================

const RecheckingCard = ({ request }) => {

    const subjects = request?.subjects || [];

    const status =
        subjects.length > 0
            ? subjects[0]?.status
            : request?.status;

    const normalizedStatus =
        String(status || "PENDING").toUpperCase();


    return (

        <div className="rounded-xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-sm">

            {/* Request Header */}

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>

                    <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold text-slate-900">

                            {request?.studentName ||
                                "Student"}

                        </h3>

                        <StatusBadge
                            status={normalizedStatus}
                        />

                    </div>


                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">

                        <span>
                            Roll No:{" "}
                            <strong className="text-slate-700">
                                {request?.rollNo || "N/A"}
                            </strong>
                        </span>

                        <span>
                            Semester:{" "}
                            <strong className="text-slate-700">
                                {request?.semesterName || "N/A"}
                            </strong>
                        </span>

                        <span>
                            Exam:{" "}
                            <strong className="text-slate-700">
                                {request?.examType || "N/A"}
                            </strong>
                        </span>

                    </div>

                </div>


                <div className="text-left md:text-right">

                    <p className="text-xs font-medium text-slate-400">
                        Applied
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatDate(request?.appliedAt)}
                    </p>

                </div>

            </div>


            {/* Reason */}

            {request?.reason && (

                <div className="mt-4 rounded-lg bg-slate-50 p-3">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Reason
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                        {request.reason}
                    </p>

                </div>

            )}


            {/* Subjects */}

            {subjects.length > 0 && (

                <div className="mt-5 overflow-x-auto">

                    <table className="w-full min-w-[650px] text-left">

                        <thead>

                            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">

                                <th className="px-3 py-3 font-semibold">
                                    Subject
                                </th>

                                <th className="px-3 py-3 font-semibold">
                                    Old Marks
                                </th>

                                <th className="px-3 py-3 font-semibold">
                                    New Marks
                                </th>

                                <th className="px-3 py-3 font-semibold">
                                    Status
                                </th>

                                <th className="px-3 py-3 font-semibold">
                                    Review Result
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {subjects.map((subject) => (

                                <tr
                                    key={subject.id}
                                    className="border-b border-slate-50 last:border-0"
                                >

                                    <td className="px-3 py-3">

                                        <div>

                                            <p className="font-semibold text-slate-800">
                                                {subject.subjectName ||
                                                    "N/A"}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {subject.subjectCode ||
                                                    ""}
                                            </p>

                                        </div>

                                    </td>


                                    <td className="px-3 py-3 font-medium text-slate-700">

                                        {subject.oldMarks ?? "—"}

                                    </td>


                                    <td className="px-3 py-3 font-medium text-slate-700">

                                        {subject.newMarks ?? "—"}

                                    </td>


                                    <td className="px-3 py-3">

                                        <StatusBadge
                                            status={
                                                subject.status
                                            }
                                        />

                                    </td>


                                    <td className="px-3 py-3 text-sm text-slate-600">

                                        {subject.reviewResult ||
                                            "—"}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
};


// =============================================================
// PROFILE ROW
// =============================================================

const ProfileRow = ({
    icon: Icon,
    label,
    value,
}) => {

    return (

        <div className="flex items-start gap-3">

            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">

                <Icon size={17} />

            </div>

            <div className="min-w-0">

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                    {value}
                </p>

            </div>

        </div>

    );
};


// =============================================================
// STATUS BADGE
// =============================================================

const StatusBadge = ({ status, count }) => {

    const normalized =
        String(status || "PENDING").toUpperCase();


    let className =
        "bg-slate-100 text-slate-600";

    if (normalized === "PENDING") {

        className =
            "bg-amber-100 text-amber-700";

    } else if (normalized === "COMPLETED") {

        className =
            "bg-emerald-100 text-emerald-700";

    } else if (
        normalized === "APPROVED" ||
        normalized === "SUCCESS"
    ) {

        className =
            "bg-blue-100 text-blue-700";

    } else if (
        normalized === "REJECTED" ||
        normalized === "FAILED"
    ) {

        className =
            "bg-red-100 text-red-700";

    }


    return (

        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
        >

            {normalized}

            {count !== undefined && (
                <span className="rounded-full bg-white/70 px-1.5">
                    {count}
                </span>
            )}

        </span>

    );
};


// =============================================================
// EMPTY STATE
// =============================================================

const EmptyState = ({
    icon: Icon,
    title,
    message,
}) => {

    return (

        <div className="flex flex-col items-center justify-center py-12 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                <Icon size={25} />

            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
                {title}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
                {message}
            </p>

        </div>

    );
};


// =============================================================
// QUICK ACTION
// =============================================================

const QuickAction = ({
    icon: Icon,
    title,
    description,
    onClick,
}) => {

    return (

        <button
            onClick={onClick}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
        >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">

                <Icon size={20} />

            </div>


            <div className="min-w-0">

                <h3 className="font-semibold text-slate-800">
                    {title}
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                    {description}
                </p>

            </div>


            <ArrowRight
                size={17}
                className="ml-auto shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500"
            />

        </button>

    );
};


// =============================================================
// DATE FORMATTER
// =============================================================

const formatDate = (date) => {

    if (!date) {
        return "N/A";
    }

    try {

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    } catch {

        return date;

    }
};


export default TeacherDashboard;