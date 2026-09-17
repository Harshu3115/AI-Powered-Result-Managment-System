import React, { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    Users,
    GraduationCap,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Search,
    Printer,
    RefreshCw,
    FileText,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import api from "../../services/api";

const AdminReports = () => {
    const [collapsed, setCollapsed] = useState(false);

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [mobileOpen, setMobileOpen] = useState(false);

    // =========================================================
    // FETCH REPORT
    // =========================================================

    const fetchReport = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get(
                "/api/admin/performance"
            );

            console.log(
                "Admin Performance / Report API:",
                response.data
            );

            if (response.data?.success) {
                setReportData(response.data.data);
            } else {
                setError(
                    response.data?.message ||
                    "Unable to load report."
                );
            }
        } catch (err) {
            console.error(
                "Admin Report API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load report."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    // =========================================================
    // DEPARTMENT DATA
    // =========================================================

    const departments = useMemo(() => {
        return (
            reportData?.departmentPerformance || []
        );
    }, [reportData]);

    // =========================================================
    // FILTER
    // =========================================================

    const filteredDepartments = useMemo(() => {
        const searchText = search
            .trim()
            .toLowerCase();

        if (!searchText) {
            return departments;
        }

        return departments.filter((department) => {
            return (
                String(
                    department.departmentName || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||
                String(
                    department.departmentCode || ""
                )
                    .toLowerCase()
                    .includes(searchText)
            );
        });
    }, [departments, search]);

    // =========================================================
    // CALCULATE OVERALL SUMMARY
    // =========================================================

    const summary = useMemo(() => {
        if (!departments.length) {
            return {
                totalStudents: 0,
                totalPass: 0,
                totalFail: 0,
                averagePercentage: 0,
                averageSGPA: 0,
            };
        }

        const totalStudents = departments.reduce(
            (sum, item) =>
                sum +
                Number(item.totalStudents || 0),
            0
        );

        const totalPass = departments.reduce(
            (sum, item) =>
                sum +
                Number(item.passCount || 0),
            0
        );

        const totalFail = departments.reduce(
            (sum, item) =>
                sum +
                Number(item.failCount || 0),
            0
        );

        const departmentsWithData =
            departments.filter(
                (item) =>
                    Number(
                        item.totalStudents || 0
                    ) > 0
            );

        const averagePercentage =
            departmentsWithData.length > 0
                ? departmentsWithData.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.averagePercentage ||
                            0
                        ),
                    0
                ) /
                departmentsWithData.length
                : 0;

        const averageSGPA =
            departmentsWithData.length > 0
                ? departmentsWithData.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.averageSGPA || 0
                        ),
                    0
                ) /
                departmentsWithData.length
                : 0;

        return {
            totalStudents,
            totalPass,
            totalFail,
            averagePercentage:
                Math.round(
                    averagePercentage * 100
                ) / 100,
            averageSGPA:
                Math.round(averageSGPA * 100) / 100,
        };
    }, [departments]);

    // =========================================================
    // CHART DATA
    // =========================================================

    const departmentChartData = useMemo(() => {
        return departments.map((department) => ({
            name:
                department.departmentCode ||
                department.departmentName,
            percentage: Number(
                department.averagePercentage || 0
            ),
            sgpa: Number(
                department.averageSGPA || 0
            ),
        }));
    }, [departments]);

    const passFailData = useMemo(() => {
        return [
            {
                name: "Passed",
                value: summary.totalPass,
            },
            {
                name: "Failed",
                value: summary.totalFail,
            },
        ];
    }, [summary]);

    // =========================================================
    // PRINT
    // =========================================================

    const handlePrint = () => {
        window.print();
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <AdminSidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                <div
                    className={`
        min-h-screen
        transition-all
        duration-300
        ml-0
        ${collapsed ? "lg:ml-[76px]" : "lg:ml-[260px]"}
    `}
                >
                    <AdminTopbar
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        mobileOpen={mobileOpen}
                        setMobileOpen={setMobileOpen}
                    />

                    <main className="px-4 pb-10 pt-[92px] sm:px-6 lg:px-8">
                        <div className="flex min-h-[500px] items-center justify-center">
                            <div className="text-center">
                                <RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-600" />

                                <p className="mt-4 text-sm font-medium text-slate-500">
                                    Loading report...
                                </p>
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
        <div className="min-h-screen bg-slate-50 print:bg-white">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* =================================================
                CONTENT
            ================================================= */}

            <div
                className={`
        min-h-screen
        transition-all
        duration-300
        ml-0
        ${collapsed ? "lg:ml-[76px]" : "lg:ml-[260px]"}
    `}
            >
                {/* =================================================
                    TOPBAR
                ================================================= */}

                <AdminTopbar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="px-4 pb-12 pt-[92px] sm:px-6 lg:px-8">

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                                    <FileText className="h-6 w-6 text-indigo-600" />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        Academic Report
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Overall academic performance
                                        report
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">

                            {/* REFRESH */}

                            <button
                                type="button"
                                onClick={() => fetchReport(true)}
                                disabled={refreshing}
                                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:px-4 sm:text-sm"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""
                                        }`}
                                />

                                <span>Refresh</span>
                            </button>

                            {/* PRINT REPORT */}

                            <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:px-4 sm:text-sm"
                            >
                                <Printer className="h-4 w-4" />

                                <span>Print Report</span>
                            </button>

                        </div>
                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

                        {/* TOTAL STUDENTS */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Total Students
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-slate-800">
                                        {
                                            summary.totalStudents
                                        }
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* PASSED */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Passed
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                                        {
                                            summary.totalPass
                                        }
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        {/* FAILED */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Failed
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-red-600">
                                        {
                                            summary.totalFail
                                        }
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                            </div>
                        </div>

                        {/* AVERAGE PERCENTAGE */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Avg Percentage
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-indigo-600">
                                        {
                                            summary.averagePercentage
                                        }
                                        %
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>
                        </div>

                        {/* AVG SGPA */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Avg SGPA
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-purple-600">
                                        {
                                            summary.averageSGPA
                                        }
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                                    <GraduationCap className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* =================================================
                        CHART SECTION
                    ================================================= */}

                    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

                        {/* DEPARTMENT PERFORMANCE */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Department Performance
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Average percentage by
                                        department
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>

                            <div className="h-[320px] w-full">
                                {departmentChartData.length >
                                    0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={
                                                departmentChartData
                                            }
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 0,
                                                bottom: 10,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                tick={{
                                                    fontSize: 12,
                                                }}
                                            />

                                            <YAxis
                                                domain={[
                                                    0,
                                                    100,
                                                ]}
                                                tick={{
                                                    fontSize: 12,
                                                }}
                                            />

                                            <Tooltip
                                                formatter={(
                                                    value
                                                ) => [
                                                        `${value}%`,
                                                        "Average",
                                                    ]}
                                            />

                                            <Bar
                                                dataKey="percentage"
                                                name="Average Percentage"
                                                fill="#6366f1"
                                                radius={[
                                                    6,
                                                    6,
                                                    0,
                                                    0,
                                                ]}
                                                barSize={42}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        No department
                                        performance data
                                        available.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PASS FAIL */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-800">
                                    Result Overview
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Pass and fail distribution
                                </p>
                            </div>

                            <div className="h-[250px]">
                                {summary.totalPass +
                                    summary.totalFail >
                                    0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={
                                                    passFailData
                                                }
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={
                                                    65
                                                }
                                                outerRadius={
                                                    90
                                                }
                                                paddingAngle={
                                                    4
                                                }
                                                dataKey="value"
                                            >
                                                <Cell fill="#10b981" />
                                                <Cell fill="#ef4444" />
                                            </Pie>

                                            <Tooltip />

                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        No result data
                                        available.
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">

                                <div className="rounded-xl bg-emerald-50 p-3 text-center">
                                    <p className="text-xs font-medium text-emerald-600">
                                        Passed
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-emerald-700">
                                        {
                                            summary.totalPass
                                        }
                                    </p>
                                </div>

                                <div className="rounded-xl bg-red-50 p-3 text-center">
                                    <p className="text-xs font-medium text-red-600">
                                        Failed
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-red-700">
                                        {
                                            summary.totalFail
                                        }
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        DEPARTMENT TABLE
                    ================================================= */}

                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* TABLE HEADER */}

                        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Department-wise Report
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Academic performance of
                                    every department
                                </p>
                            </div>

                            {/* SEARCH */}

                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search department..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                        </div>

                        {/* TABLE */}

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            #
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Department
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Students
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Avg %
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Avg SGPA
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Passed
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Failed
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Pass Rate
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredDepartments.length >
                                        0 ? (
                                        filteredDepartments.map(
                                            (
                                                department,
                                                index
                                            ) => {
                                                const students =
                                                    Number(
                                                        department.totalStudents ||
                                                        0
                                                    );

                                                const passed =
                                                    Number(
                                                        department.passCount ||
                                                        0
                                                    );

                                                const failed =
                                                    Number(
                                                        department.failCount ||
                                                        0
                                                    );

                                                const total =
                                                    passed +
                                                    failed;

                                                const passRate =
                                                    total >
                                                        0
                                                        ? (
                                                            (passed /
                                                                total) *
                                                            100
                                                        ).toFixed(
                                                            1
                                                        )
                                                        : "0.0";

                                                return (
                                                    <tr
                                                        key={
                                                            department.departmentId ||
                                                            index
                                                        }
                                                        className="border-b border-slate-100 transition hover:bg-slate-50"
                                                    >

                                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-500">
                                                            {index +
                                                                1}
                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <div className="font-semibold text-slate-800">
                                                                {
                                                                    department.departmentName
                                                                }
                                                            </div>

                                                            <div className="mt-1 text-xs text-slate-400">
                                                                {
                                                                    department.departmentCode
                                                                }
                                                            </div>

                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                                                            {
                                                                students
                                                            }
                                                        </td>

                                                        <td className="px-5 py-4 text-center">

                                                            <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-bold text-indigo-600">
                                                                {Number(
                                                                    department.averagePercentage ||
                                                                    0
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                                %
                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4 text-center">

                                                            <span className="inline-flex rounded-lg bg-purple-50 px-2.5 py-1 text-sm font-bold text-purple-600">
                                                                {Number(
                                                                    department.averageSGPA ||
                                                                    0
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4 text-center">

                                                            <span className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-600">
                                                                {
                                                                    passed
                                                                }
                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4 text-center">

                                                            <span className="inline-flex rounded-lg bg-red-50 px-2.5 py-1 text-sm font-bold text-red-600">
                                                                {
                                                                    failed
                                                                }
                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4 text-center">

                                                            <span
                                                                className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-bold ${Number(
                                                                    passRate
                                                                ) >=
                                                                    75
                                                                    ? "bg-emerald-50 text-emerald-600"
                                                                    : Number(
                                                                        passRate
                                                                    ) >=
                                                                        50
                                                                        ? "bg-amber-50 text-amber-600"
                                                                        : "bg-red-50 text-red-600"
                                                                    }`}
                                                            >
                                                                {
                                                                    passRate
                                                                }
                                                                %
                                                            </span>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-5 py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <BarChart3 className="h-10 w-10 text-slate-300" />

                                                    <p className="mt-3 text-sm font-semibold text-slate-500">
                                                        No departments
                                                        found
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Try another
                                                        search.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                </tbody>

                            </table>
                        </div>

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="mt-6 text-center text-xs text-slate-400">
                        Academic Performance Report
                    </div>

                </main>
            </div>

            {/* =================================================
                PRINT CSS
            ================================================= */}

            <style>
                {`
                    @media print {
                        @page {
                            size: A4;
                            margin: 15mm;
                        }

                        body {
                            background: white !important;
                        }

                        header,
                        aside,
                        button,
                        input {
                            display: none !important;
                        }

                        main {
                            padding-top: 0 !important;
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                        }

                        .print\\:bg-white {
                            background: white !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default AdminReports;