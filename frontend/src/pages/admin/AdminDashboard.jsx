import { useEffect, useState } from "react";

import {
    Users,
    GraduationCap,
    BookOpen,
    LibraryBig,
    RefreshCcw,
    XCircle,
    BarChart3,
    PieChart,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import adminService from "../../services/adminService";

// =====================================================
// RESULT PERFORMANCE CHART
// =====================================================

const ResultChart = ({
    passed = 0,
    failed = 0,
}) => {
    const total = passed + failed;

    const passedPercentage =
        total > 0
            ? Math.round((passed / total) * 100)
            : 0;

    const failedPercentage =
        total > 0
            ? Math.round((failed / total) * 100)
            : 0;

    return (
        <div
            className="
                w-full
                min-w-0
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-4
                sm:p-5
                md:p-6
                shadow-sm
            "
        >
            {/* HEADER */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div className="min-w-0">
                    <h2
                        className="
                            text-base
                            sm:text-lg
                            font-bold
                            text-slate-800
                        "
                    >
                        Result Performance
                    </h2>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                        "
                    >
                        Passed and failed result overview
                    </p>
                </div>

                <div
                    className="
                        h-10
                        w-10
                        shrink-0
                        rounded-xl
                        bg-indigo-50
                        text-indigo-600
                        flex
                        items-center
                        justify-center
                    "
                >
                    <PieChart size={20} />
                </div>
            </div>

            {/* DONUT CHART */}

            <div
                className="
                    mt-6
                    sm:mt-7
                    flex
                    items-center
                    justify-center
                "
            >
                <div
                    className="
                        relative
                        h-36
                        w-36
                        sm:h-44
                        sm:w-44
                        rounded-full
                        flex
                        items-center
                        justify-center
                    "
                    style={{
                        background: `conic-gradient(
                            #4f46e5 0% ${passedPercentage}%,
                            #ef4444 ${passedPercentage}% 100%
                        )`,
                    }}
                >
                    {/* INNER CIRCLE */}

                    <div
                        className="
                            h-24
                            w-24
                            sm:h-28
                            sm:w-28
                            rounded-full
                            bg-white
                            flex
                            flex-col
                            items-center
                            justify-center
                        "
                    >
                        <span
                            className="
                                text-xl
                                sm:text-2xl
                                font-bold
                                text-slate-800
                            "
                        >
                            {total}
                        </span>

                        <span
                            className="
                                text-xs
                                text-slate-400
                            "
                        >
                            Results
                        </span>
                    </div>
                </div>
            </div>

            {/* LEGEND */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                    sm:gap-4
                    mt-6
                    sm:mt-7
                "
            >
                {/* PASSED */}

                <div
                    className="
                        rounded-xl
                        bg-indigo-50
                        p-3
                        sm:p-4
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                h-3
                                w-3
                                shrink-0
                                rounded-full
                                bg-indigo-600
                            "
                        />

                        <span
                            className="
                                text-sm
                                text-slate-600
                            "
                        >
                            Passed
                        </span>
                    </div>

                    <p
                        className="
                            mt-2
                            text-xl
                            font-bold
                            text-indigo-700
                        "
                    >
                        {passed}
                    </p>

                    <p
                        className="
                            text-xs
                            text-slate-400
                        "
                    >
                        {passedPercentage}%
                    </p>
                </div>

                {/* FAILED */}

                <div
                    className="
                        rounded-xl
                        bg-red-50
                        p-3
                        sm:p-4
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                h-3
                                w-3
                                shrink-0
                                rounded-full
                                bg-red-500
                            "
                        />

                        <span
                            className="
                                text-sm
                                text-slate-600
                            "
                        >
                            Failed
                        </span>
                    </div>

                    <p
                        className="
                            mt-2
                            text-xl
                            font-bold
                            text-red-700
                        "
                    >
                        {failed}
                    </p>

                    <p
                        className="
                            text-xs
                            text-slate-400
                        "
                    >
                        {failedPercentage}%
                    </p>
                </div>
            </div>
        </div>
    );
};

// =====================================================
// RECHECKING CHART
// =====================================================

const RecheckingChart = ({
    pending = 0,
    approved = 0,
    rejected = 0,
    completed = 0,
}) => {
    const data = [
        {
            label: "Pending",
            value: pending,
            color: "bg-amber-500",
            textColor: "text-amber-700",
        },
        {
            label: "Approved",
            value: approved,
            color: "bg-emerald-500",
            textColor: "text-emerald-700",
        },
        {
            label: "Rejected",
            value: rejected,
            color: "bg-red-500",
            textColor: "text-red-700",
        },
        {
            label: "Completed",
            value: completed,
            color: "bg-blue-500",
            textColor: "text-blue-700",
        },
    ];

    const maxValue = Math.max(
        ...data.map((item) => item.value),
        1
    );

    const totalRequests =
        pending +
        approved +
        rejected +
        completed;

    return (
        <div
            className="
                w-full
                min-w-0
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-4
                sm:p-5
                md:p-6
                shadow-sm
            "
        >
            {/* HEADER */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div className="min-w-0">
                    <h2
                        className="
                            text-base
                            sm:text-lg
                            font-bold
                            text-slate-800
                        "
                    >
                        Rechecking Overview
                    </h2>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                        "
                    >
                        Current rechecking request status
                    </p>
                </div>

                <div
                    className="
                        h-10
                        w-10
                        shrink-0
                        rounded-xl
                        bg-indigo-50
                        text-indigo-600
                        flex
                        items-center
                        justify-center
                    "
                >
                    <BarChart3 size={20} />
                </div>
            </div>

            {/* BAR CHART */}

            <div
                className="
                    mt-6
                    sm:mt-8
                    space-y-5
                    sm:space-y-6
                "
            >
                {data.map((item) => {
                    const percentage =
                        (item.value / maxValue) * 100;

                    return (
                        <div key={item.label}>
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    mb-2
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        min-w-0
                                    "
                                >
                                    <span
                                        className={`
                                            h-2.5
                                            w-2.5
                                            shrink-0
                                            rounded-full
                                            ${item.color}
                                        `}
                                    />

                                    <span
                                        className="
                                            text-sm
                                            font-medium
                                            text-slate-600
                                        "
                                    >
                                        {item.label}
                                    </span>
                                </div>

                                <span
                                    className={`
                                        text-sm
                                        font-bold
                                        shrink-0
                                        ${item.textColor}
                                    `}
                                >
                                    {item.value}
                                </span>
                            </div>

                            <div
                                className="
                                    h-3
                                    w-full
                                    bg-slate-100
                                    rounded-full
                                    overflow-hidden
                                "
                            >
                                <div
                                    className={`
                                        h-full
                                        rounded-full
                                        ${item.color}
                                        transition-all
                                        duration-700
                                    `}
                                    style={{
                                        width: `${percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* TOTAL */}

            <div
                className="
                    mt-6
                    sm:mt-8
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-3
                    sm:p-4
                    rounded-xl
                    bg-slate-50
                "
            >
                <span
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    Total Requests
                </span>

                <span
                    className="
                        text-xl
                        font-bold
                        text-slate-800
                    "
                >
                    {totalRequests}
                </span>
            </div>
        </div>
    );
};

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const AdminDashboard = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [collapsed, setCollapsed] =
        useState(false);

    const [activePage, setActivePage] =
        useState("Dashboard");

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [mobileOpen, setMobileOpen] =
        useState(false);

    // =====================================================
    // LOAD ADMIN DASHBOARD
    // =====================================================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await adminService.getDashboard();

                console.log(
                    "Admin Dashboard Response:",
                    response
                );

                if (response?.success) {
                    setDashboard(response.data);
                } else {
                    setError(
                        response?.message ||
                        "Failed to load dashboard."
                    );
                }
            } catch (err) {
                console.error(
                    "Admin Dashboard Error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to connect to the server."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // =====================================================
    // CLOSE MOBILE SIDEBAR WHEN PAGE CHANGES
    // =====================================================

    const handlePageChange = (page) => {
        setActivePage(page);

        if (window.innerWidth < 768) {
            setMobileOpen(false);
        }
    };

    // =====================================================
    // STAT CARD
    // =====================================================

    const StatCard = ({
        title,
        value,
        icon: Icon,
        description,
        iconBg,
        iconColor,
    }) => {
        return (
            <div
                className="
                    w-full
                    min-w-0
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-4
                    sm:p-5
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >
                    <div className="min-w-0">
                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-500
                            "
                        >
                            {title}
                        </p>

                        <h2
                            className="
                                mt-2
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-slate-800
                            "
                        >
                            {value ?? 0}
                        </h2>

                        <p
                            className="
                                mt-2
                                text-xs
                                text-slate-400
                            "
                        >
                            {description}
                        </p>
                    </div>

                    <div
                        className={`
                            h-10
                            w-10
                            sm:h-11
                            sm:w-11
                            shrink-0
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            ${iconBg}
                            ${iconColor}
                        `}
                    >
                        <Icon size={21} />
                    </div>
                </div>
            </div>
        );
    };

    // =====================================================
    // COMMON LAYOUT
    // =====================================================

    const Layout = ({ children }) => {
        return (
            <div
                className="
                    min-h-screen
                    w-full
                    overflow-x-hidden
                    bg-slate-50
                "
            >
                {/* SIDEBAR */}

                <AdminSidebar
                    activePage={activePage}
                    setActivePage={handlePageChange}
                    collapsed={collapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                {/* TOPBAR */}

                <AdminTopbar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                {/* MAIN */}

                <main
                    className={`
        min-h-screen
        min-w-0
        pt-[72px]
        overflow-x-hidden
        transition-all
        duration-300

        ${collapsed
                            ? "md:ml-[76px] md:w-[calc(100%-76px)]"
                            : "md:ml-[260px] md:w-[calc(100%-260px)]"
                        }
    `}
                >
                    {children}
                </main>
            </div>
        );
    };

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {
        return (
            <Layout>
                <div
                    className="
                        w-full
                        min-w-0
                        p-4
                        sm:p-5
                        md:p-6
                    "
                >
                    <div className="animate-pulse">
                        {/* HEADER SKELETON */}

                        <div
                            className="
                                h-7
                                sm:h-8
                                w-52
                                sm:w-64
                                bg-slate-200
                                rounded-lg
                            "
                        />

                        <div
                            className="
                                mt-3
                                h-4
                                w-full
                                max-w-md
                                bg-slate-200
                                rounded
                            "
                        />

                        {/* CARDS SKELETON */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                xl:grid-cols-4
                                gap-3
                                sm:gap-5
                                mt-5
                                sm:mt-7
                            "
                        >
                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="
                                            h-32
                                            bg-white
                                            border
                                            border-slate-200
                                            rounded-2xl
                                        "
                                    />
                                )
                            )}
                        </div>

                        {/* CHART SKELETON */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                xl:grid-cols-2
                                gap-5
                                mt-5
                            "
                        >
                            <div
                                className="
                                    h-96
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-2xl
                                "
                            />

                            <div
                                className="
                                    h-96
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-2xl
                                "
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // =====================================================
    // ERROR SCREEN
    // =====================================================

    if (error) {
        return (
            <Layout>
                <div
                    className="
                        min-h-[calc(100vh-72px)]
                        w-full
                        flex
                        items-center
                        justify-center
                        p-4
                        sm:p-6
                    "
                >
                    <div
                        className="
                            w-full
                            max-w-md
                            bg-white
                            border
                            border-red-100
                            rounded-2xl
                            p-6
                            sm:p-8
                            text-center
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                mx-auto
                                h-14
                                w-14
                                rounded-full
                                bg-red-50
                                text-red-500
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <XCircle size={28} />
                        </div>

                        <h2
                            className="
                                mt-4
                                text-lg
                                font-bold
                                text-slate-800
                            "
                        >
                            Unable to Load Dashboard
                        </h2>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                            "
                        >
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                            className="
                                mt-5
                                px-5
                                py-2.5
                                rounded-xl
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                text-sm
                                font-semibold
                                transition
                            "
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    // =====================================================
    // DASHBOARD
    // =====================================================

    return (
        <Layout>
            <div
                className="
        w-full
        max-w-full
        min-w-0
        overflow-hidden
        p-4
        sm:p-5
        md:p-6
    "
            >
                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="w-full min-w-0">
                    <h1
                        className="
                            text-xl
                            sm:text-2xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Admin Dashboard 👋
                    </h1>

                    <p
                        className="
                            mt-1
                            text-xs
                            sm:text-sm
                            text-slate-500
                            max-w-xl
                        "
                    >
                        Manage and monitor your
                        Student Result Management System.
                    </p>
                </div>

                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div
                    className="
        grid
        w-full
        max-w-full
        min-w-0
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-3
        sm:gap-5
        mt-5
        sm:mt-7
    "
                >
                    <StatCard
                        title="Total Students"
                        value={
                            dashboard?.totalStudents
                        }
                        icon={GraduationCap}
                        description="Registered students"
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                    />

                    <StatCard
                        title="Total Teachers"
                        value={
                            dashboard?.totalTeachers
                        }
                        icon={Users}
                        description="Teaching staff"
                        iconBg="bg-indigo-50"
                        iconColor="text-indigo-600"
                    />

                    <StatCard
                        title="Total Courses"
                        value={
                            dashboard?.totalCourses
                        }
                        icon={LibraryBig}
                        description="Available courses"
                        iconBg="bg-violet-50"
                        iconColor="text-violet-600"
                    />

                    <StatCard
                        title="Total Subjects"
                        value={
                            dashboard?.totalSubjects
                        }
                        icon={BookOpen}
                        description="Academic subjects"
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />
                </div>

                {/* =================================================
                    ANALYTICS CHARTS
                ================================================= */}

                <div
                    className="
                        grid
                        w-full
                        min-w-0
                        grid-cols-1
                        xl:grid-cols-2
                        gap-5
                        mt-5
                    "
                >
                    <ResultChart
                        passed={
                            dashboard?.passedResults ??
                            0
                        }
                        failed={
                            dashboard?.failedResults ??
                            0
                        }
                    />

                    <RecheckingChart
                        pending={
                            dashboard?.pendingRechecking ??
                            0
                        }
                        approved={
                            dashboard?.approvedRechecking ??
                            0
                        }
                        rejected={
                            dashboard?.rejectedRechecking ??
                            0
                        }
                        completed={
                            dashboard?.completedRechecking ??
                            0
                        }
                    />
                </div>

                {/* =================================================
                    RECHECKING REQUESTS
                ================================================= */}

                <div
                    className="
                        mt-5
                        w-full
                        min-w-0
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        p-4
                        sm:p-5
                        md:p-6
                        shadow-sm
                    "
                >
                    {/* HEADER */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-base
                                    sm:text-lg
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Rechecking Requests
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Current request status
                            </p>
                        </div>

                        <RefreshCcw
                            size={21}
                            className="
                                shrink-0
                                text-indigo-500
                            "
                        />
                    </div>

                    {/* REQUEST CARDS */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            md:grid-cols-4
                            gap-3
                            sm:gap-4
                            mt-5
                            sm:mt-6
                        "
                    >
                        {/* PENDING */}

                        <div
                            className="
                                p-3
                                sm:p-4
                                rounded-xl
                                bg-amber-50
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-amber-600
                                "
                            >
                                Pending
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    text-amber-700
                                "
                            >
                                {
                                    dashboard?.pendingRechecking ??
                                    0
                                }
                            </p>
                        </div>

                        {/* APPROVED */}

                        <div
                            className="
                                p-3
                                sm:p-4
                                rounded-xl
                                bg-emerald-50
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-emerald-600
                                "
                            >
                                Approved
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    text-emerald-700
                                "
                            >
                                {
                                    dashboard?.approvedRechecking ??
                                    0
                                }
                            </p>
                        </div>

                        {/* REJECTED */}

                        <div
                            className="
                                p-3
                                sm:p-4
                                rounded-xl
                                bg-red-50
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-red-600
                                "
                            >
                                Rejected
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    text-red-700
                                "
                            >
                                {
                                    dashboard?.rejectedRechecking ??
                                    0
                                }
                            </p>
                        </div>

                        {/* COMPLETED */}

                        <div
                            className="
                                p-3
                                sm:p-4
                                rounded-xl
                                bg-blue-50
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-blue-600
                                "
                            >
                                Completed
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    text-blue-700
                                "
                            >
                                {
                                    dashboard?.completedRechecking ??
                                    0
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;