import React, { useEffect, useMemo, useState } from "react";

import {
    BarChart3,
    TrendingUp,
    Users,
    CheckCircle,
    XCircle,
    Award,
    BookOpen,
    GraduationCap,
    RefreshCw,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import adminPerformanceService from "../../services/adminPerformanceService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";


const AdminPerformance = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [performance, setPerformance] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedSemester, setSelectedSemester] =
        useState("ALL");

    const [selectedDepartment, setSelectedDepartment] =
        useState("ALL");

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // =========================================================
    // FETCH DATA
    // =========================================================

    const fetchPerformance = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await adminPerformanceService
                    .getPerformance();

            if (response?.success) {

                setPerformance(
                    response.data
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load performance data."
                );
            }

        } catch (err) {

            console.error(
                "Admin Performance Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load performance data."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchPerformance();
    }, []);

    // Keep desktop and mobile sidebar states separate.
    // Desktop: collapsed controls 260px <-> 76px.
    // Mobile/tablet: mobileOpen controls the slide-in sidebar.
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // =========================================================
    // SEMESTERS
    // =========================================================

    const semesters = useMemo(() => {

        if (!performance?.semesterPerformance) {
            return [];
        }

        return performance.semesterPerformance;

    }, [performance]);

    // =========================================================
    // DEPARTMENTS
    // =========================================================

    const departments = useMemo(() => {

        if (!performance?.departmentPerformance) {
            return [];
        }

        return performance.departmentPerformance;

    }, [performance]);

    // =========================================================
    // FILTER SEMESTER
    // =========================================================

    const filteredSemesterData = useMemo(() => {

        if (!performance?.semesterPerformance) {
            return [];
        }

        if (selectedSemester === "ALL") {

            return performance.semesterPerformance;

        }

        return performance.semesterPerformance.filter(
            item =>
                String(item.semesterNumber) ===
                String(selectedSemester)
        );

    }, [
        performance,
        selectedSemester
    ]);

    // =========================================================
    // FILTER DEPARTMENT
    // =========================================================

    const filteredDepartmentData = useMemo(() => {

        if (!performance?.departmentPerformance) {
            return [];
        }

        if (selectedDepartment === "ALL") {

            return performance.departmentPerformance;

        }

        return performance.departmentPerformance.filter(
            item =>
                item.departmentName ===
                selectedDepartment
        );

    }, [
        performance,
        selectedDepartment
    ]);

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <RefreshCw
                        size={32}
                        className="animate-spin mx-auto text-indigo-600"
                    />

                    <p className="mt-3 text-slate-600">
                        Loading performance...
                    </p>

                </div>

            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (
            <div className="min-h-screen bg-slate-50 p-6">

                <div className="max-w-3xl mx-auto bg-white border border-red-200 rounded-2xl p-8 text-center">

                    <XCircle
                        size={42}
                        className="mx-auto text-red-500"
                    />

                    <h2 className="mt-4 text-xl font-semibold text-slate-800">
                        Unable to Load Performance
                    </h2>

                    <p className="mt-2 text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={fetchPerformance}
                        className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    if (!performance) {
        return null;
    }

    // =========================================================
    // PASS / FAIL PIE
    // =========================================================

    const passFailData = [
        {
            name: "Passed",
            value: performance.passCount || 0
        },
        {
            name: "Failed",
            value: performance.failCount || 0
        }
    ];

    const PASS_FAIL_COLORS = [
        "#10B981",
        "#F43F5E",
    ];

    // =========================================================
    // STAT CARD
    // =========================================================

    const StatCard = ({
        title,
        value,
        icon,
        description
    }) => {

        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

                <div className="flex items-start justify-between">

                    <div>

                        <p className="text-sm text-slate-500">
                            {title}
                        </p>

                        <h3 className="text-2xl font-bold text-slate-800 mt-2">
                            {value}
                        </h3>

                        {description && (
                            <p className="text-xs text-slate-400 mt-1">
                                {description}
                            </p>
                        )}

                    </div>

                    <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        {icon}
                    </div>

                </div>

            </div>
        );
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">

            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <AdminTopbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <main
                className={`
            pt-[72px]
            min-h-screen
            transition-all
            duration-300
            ${collapsed ? "lg:ml-[76px]" : "lg:ml-[260px]"}
        `}
            >
                <div className="p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto">

                    {/* =====================================================
                HEADER
            ===================================================== */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                    <BarChart3 size={22} />
                                </div>

                                <div>

                                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                                        Performance Analysis
                                    </h1>

                                    <p className="text-sm text-slate-500">
                                        Overall academic performance
                                    </p>

                                </div>

                            </div>

                        </div>

                        <button
                            onClick={fetchPerformance}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>

                    </div>

                    {/* =====================================================
                FILTERS
            ===================================================== */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                            <div className="flex-1">

                                <label className="block text-xs font-medium text-slate-500 mb-2">
                                    Semester
                                </label>

                                <select
                                    value={selectedSemester}
                                    onChange={e =>
                                        setSelectedSemester(
                                            e.target.value
                                        )
                                    }
                                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 bg-white"
                                >

                                    <option value="ALL">
                                        All Semesters
                                    </option>

                                    {semesters.map(
                                        semester => (
                                            <option
                                                key={
                                                    semester.semesterNumber
                                                }
                                                value={
                                                    semester.semesterNumber
                                                }
                                            >
                                                {semester.semesterName ||
                                                    `Semester ${semester.semesterNumber}`}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            <div className="flex-1">

                                <label className="block text-xs font-medium text-slate-500 mb-2">
                                    Department
                                </label>

                                <select
                                    value={selectedDepartment}
                                    onChange={e =>
                                        setSelectedDepartment(
                                            e.target.value
                                        )
                                    }
                                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 bg-white"
                                >

                                    <option value="ALL">
                                        All Departments
                                    </option>

                                    {departments.map(
                                        department => (
                                            <option
                                                key={
                                                    department.departmentName
                                                }
                                                value={
                                                    department.departmentName
                                                }
                                            >
                                                {
                                                    department.departmentName
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                    </div>

                    {/* =====================================================
                STAT CARDS
            ===================================================== */}

                    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">

                        <StatCard
                            title="Total Students"
                            value={
                                performance.totalStudents
                            }
                            icon={
                                <Users size={21} />
                            }
                            description="Registered students"
                        />

                        <StatCard
                            title="Average Percentage"
                            value={`${performance.averagePercentage}%`}
                            icon={
                                <TrendingUp size={21} />
                            }
                            description="Overall average"
                        />

                        <StatCard
                            title="Average SGPA"
                            value={
                                performance.averageSGPA
                            }
                            icon={
                                <Award size={21} />
                            }
                            description="Overall SGPA"
                        />

                        <StatCard
                            title="Pass Percentage"
                            value={`${performance.passPercentage}%`}
                            icon={
                                <CheckCircle size={21} />
                            }
                            description={`${performance.passCount} passed`}
                        />

                    </div>

                    {/* =====================================================
                SECONDARY CARDS
            ===================================================== */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 min-w-0">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                    <CheckCircle size={20} />
                                </div>

                                <div>

                                    <p className="text-xs text-slate-500">
                                        Passed Results
                                    </p>

                                    <p className="text-xl font-bold text-slate-800">
                                        {performance.passCount}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 min-w-0">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                    <XCircle size={20} />
                                </div>

                                <div>

                                    <p className="text-xs text-slate-500">
                                        Failed Results
                                    </p>

                                    <p className="text-xl font-bold text-slate-800">
                                        {performance.failCount}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 min-w-0">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <GraduationCap size={20} />
                                </div>

                                <div>

                                    <p className="text-xs text-slate-500">
                                        Total Results
                                    </p>

                                    <p className="text-xl font-bold text-slate-800">
                                        {performance.totalResults}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* =====================================================
                CHART ROW 1
            ===================================================== */}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6">

                        {/* PASS FAIL */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 min-w-0">

                            <div className="flex items-center gap-3 mb-4">

                                <CheckCircle
                                    size={20}
                                    className="text-indigo-600"
                                />

                                <div>

                                    <h2 className="font-semibold text-slate-800">
                                        Pass / Fail Analysis
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Result distribution
                                    </p>

                                </div>

                            </div>

                            <div className="h-[260px] sm:h-[300px] w-full min-w-0">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <PieChart>

                                        <Pie
                                            data={
                                                passFailData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >

                                            <Cell fill={PASS_FAIL_COLORS[0]} />
                                            <Cell fill={PASS_FAIL_COLORS[1]} />

                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                        {/* SEMESTER */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 min-w-0">

                            <div className="flex items-center gap-3 mb-4">

                                <TrendingUp
                                    size={20}
                                    className="text-indigo-600"
                                />

                                <div>

                                    <h2 className="font-semibold text-slate-800">
                                        Semester Performance
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Average percentage and SGPA
                                    </p>

                                </div>

                            </div>

                            <div className="h-[260px] sm:h-[300px] w-full min-w-0">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <LineChart
                                        data={
                                            filteredSemesterData
                                        }
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="semesterNumber"
                                            tickFormatter={
                                                value =>
                                                    `Sem ${value}`
                                            }
                                        />

                                        <YAxis />

                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#ffffff",
                                                border: "1px solid #E2E8F0",
                                                borderRadius: "12px",
                                                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.10)",
                                            }}
                                            labelStyle={{
                                                color: "#334155",
                                                fontWeight: 600,
                                            }}
                                        />

                                        <Legend />

                                        <Line
                                            type="monotone"
                                            dataKey="averagePercentage"
                                            name="Average %"
                                            stroke="#4F46E5"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="averageSGPA"
                                            name="Average SGPA"
                                            stroke="#06B6D4"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                    </div>

                    {/* =====================================================
                SUBJECT PERFORMANCE
            ===================================================== */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">

                        <div className="flex items-center gap-3 mb-5">

                            <BookOpen
                                size={20}
                                className="text-indigo-600"
                            />

                            <div>

                                <h2 className="font-semibold text-slate-800">
                                    Subject Performance
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Average marks by subject
                                </p>

                            </div>

                        </div>

                        <div className="h-[300px] sm:h-[360px] w-full min-w-0">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={
                                        performance.subjectPerformance
                                    }
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 10,
                                        bottom: 70
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="subjectCode"
                                        angle={-35}
                                        textAnchor="end"
                                        interval={0}
                                        height={75}
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis />

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #E2E8F0",
                                            borderRadius: "12px",
                                            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.10)",
                                        }}
                                        labelStyle={{
                                            color: "#334155",
                                            fontWeight: 600,
                                        }}
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="averageMarks"
                                        name="Average Marks"
                                        fill="#7C3AED"
                                        radius={[8, 8, 0, 0]}
                                        barSize={32}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                    {/* =====================================================
                DEPARTMENT PERFORMANCE
            ===================================================== */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">

                        <div className="flex items-center gap-3 mb-5">

                            <GraduationCap
                                size={20}
                                className="text-indigo-600"
                            />

                            <div>

                                <h2 className="font-semibold text-slate-800">
                                    Department Performance
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Department-wise academic performance
                                </p>

                            </div>

                        </div>

                        <div className="h-[300px] sm:h-[360px] w-full min-w-0">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={
                                        filteredDepartmentData
                                    }
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 70
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="departmentName"
                                        angle={-25}
                                        textAnchor="end"
                                        interval={0}
                                        height={75}
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis />

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #E2E8F0",
                                            borderRadius: "12px",
                                            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.10)",
                                        }}
                                        labelStyle={{
                                            color: "#334155",
                                            fontWeight: 600,
                                        }}
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="averagePercentage"
                                        name="Average Percentage"
                                        fill="#2563EB"
                                        radius={[8, 8, 0, 0]}
                                        barSize={28}
                                    />

                                    <Bar
                                        dataKey="averageSGPA"
                                        name="Average SGPA"
                                        fill="#F59E0B"
                                        radius={[8, 8, 0, 0]}
                                        barSize={28}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                    {/* =====================================================
                SUBJECT TABLE
            ===================================================== */}

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden min-w-0">

                        <div className="p-5 border-b border-slate-200">

                            <h2 className="font-semibold text-slate-800">
                                Subject-wise Details
                            </h2>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-[760px] w-full text-xs sm:text-sm">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                                            Code
                                        </th>

                                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                                            Subject
                                        </th>

                                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                                            Avg Marks
                                        </th>

                                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                                            Avg %
                                        </th>

                                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                                            Passed
                                        </th>

                                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                                            Failed
                                        </th>

                                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                                            Pass %
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {performance.subjectPerformance
                                        ?.map(subject => (

                                            <tr
                                                key={
                                                    subject.subjectCode
                                                }
                                                className="border-t border-slate-100 hover:bg-slate-50"
                                            >

                                                <td className="px-3 sm:px-5 py-3 font-medium text-slate-700">
                                                    {
                                                        subject.subjectCode
                                                    }
                                                </td>

                                                <td className="px-3 sm:px-5 py-3 text-slate-600">
                                                    {
                                                        subject.subjectName
                                                    }
                                                </td>

                                                <td className="px-3 sm:px-5 py-3 text-center">
                                                    {
                                                        subject.averageMarks
                                                    }
                                                </td>

                                                <td className="px-3 sm:px-5 py-3 text-center">
                                                    {
                                                        subject.averagePercentage
                                                    }%
                                                </td>

                                                <td className="px-3 sm:px-5 py-3 text-center text-green-600 font-medium">
                                                    {
                                                        subject.passCount
                                                    }
                                                </td>

                                                <td className="px-3 sm:px-5 py-3 text-center text-red-600 font-medium">
                                                    {
                                                        subject.failCount
                                                    }
                                                </td>

                                                <td className="px-3 sm:px-5 py-3 text-center font-medium">
                                                    {
                                                        subject.passPercentage
                                                    }%
                                                </td>

                                            </tr>

                                        ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default AdminPerformance;