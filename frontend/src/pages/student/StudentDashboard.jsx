import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    BarChart3,
    LineChart as LineChartIcon,
    BookOpenCheck,
    ClipboardList,
    Compass,
    MessageSquare,
    RotateCcw,
    FileEdit,
    Settings,
    ChevronDown,
    BookOpen,
    CheckCircle2,
    AlertTriangle,
    Send,
    Bot,
    Headphones,
    Star,
    ShieldCheck,
    TrendingUp,
    Wrench,
    Award,
    X,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";
import studentService from "../../services/studentService";






const toneClasses = {
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
};

const gradeClasses = {
    A: "bg-emerald-50 text-emerald-700",
    "B+": "bg-blue-50 text-blue-700",
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function StatCard({ label, value, unit, sub, subClass, icon: Icon, iconBg, iconColor }) {
    return (
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 sm:text-3xl">{value}</span>
                {unit && <span className="text-sm text-slate-400">{unit}</span>}
            </div>
            <p className={`mt-1 text-xs font-medium ${subClass || "text-slate-400"}`}>{sub}</p>
        </div>
    );
}





function WelcomeBanner({ dashboardData }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-white p-6 sm:p-8">
            <p className="text-sm text-slate-500">Welcome back,</p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {dashboardData?.studentName || "Student"} <span aria-hidden>👋</span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">
                Here's what's happening with your academics today.
            </p>
        </div>
    );
}

function PerformanceOverview({
    performanceData,
    highestSgpa,
    lowestSgpa,
    averageSgpa,
    highestSemester,
    lowestSemester,
    dashboardData,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900">Performance Overview</h3>
                <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    All Semesters
                    <ChevronDown className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="h-64 w-full sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="sgpaFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#eef2f7" />
                        <XAxis
                            dataKey="sem"
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 10]}
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="sgpa"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                            fill="url(#sgpaFill)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
                <div>
                    <p className="text-xs text-slate-400">Highest SGPA</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                        {highestSgpa.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">
                        Lowest SGPA
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-amber-500">
                        {lowestSgpa.toFixed(2)}

                        <span className="ml-1 font-normal text-slate-400">
                            {lowestSemester}
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">
                        Average SGPA
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                        {averageSgpa.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Total Credits</p>
                    <p className="mt-0.5 text-sm font-bold text-emerald-600">{dashboardData?.totalCredits || 0}</p>
                </div>
            </div>
        </div>
    );
}

function AIAssistant({ dashboardData, backlogs }) {
    const [message, setMessage] = useState("");
    const [chatResponse, setChatResponse] = useState("");
    const [chatLoading, setChatLoading] = useState(false);


    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const handleSend = async () => {
        const question = message.trim();

        if (!question || chatLoading) {
            return;
        }

        console.log("Sending AI question:", question);

        try {
            setChatLoading(true);

            const response = await studentService.chat(question);

            console.log("AI Chat Response:", response);

            if (response?.success) {
                const aiMessage =
                    response?.data?.response ||
                    response?.data?.message ||
                    response?.data?.answer ||
                    response?.data?.content ||
                    "AI response received successfully.";

                setChatResponse(aiMessage);
            } else {
                setChatResponse(
                    response?.message || "Unable to get AI response."
                );
            }

            setMessage("");

        } catch (error) {
            console.error("AI Chat Error:", error);

            console.error(
                "AI Chat Error Response:",
                error?.response?.data
            );

            setChatResponse(
                error?.response?.data?.message ||
                "Sorry, I couldn't process your question right now."
            );

        } finally {
            setChatLoading(false);
        }
    };
    return (
        <div className="flex h-[430px] min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    AI Assistant
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                        Beta
                    </span>
                </h3>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-2.5 text-sm text-white">
                    Hi AI, how is my overall performance?
                    <p className="mt-1 text-[10px] text-indigo-200">
                        {getCurrentTime()}
                    </p>
                </div>

                <div className="flex items-start gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <Bot className="h-4 w-4" />
                    </span>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                        Hello {dashboardData?.studentName?.split(" ")[0] || "Student"}!

                        Your overall performance is{" "}
                        <strong className="text-slate-800">
                            {dashboardData?.latestResultStatus === "PASS"
                                ? "good"
                                : "needs attention"}
                        </strong>.

                        You have a CGPA of{" "}
                        <strong className="text-slate-800">
                            {dashboardData?.cgpa?.toFixed(2) || "0.00"}
                        </strong>{" "}
                        and latest SGPA of{" "}
                        <strong className="text-slate-800">
                            {dashboardData?.latestSgpa?.toFixed(2) || "0.00"}
                        </strong>.
                        {" "}

                        {backlogs > 0
                            ? `Focus on clearing your ${backlogs} backlog${backlogs > 1 ? "s" : ""} to improve further.`
                            : "Excellent! You currently have no backlogs."}
                        <p className="mt-1 text-[10px] text-slate-400">
                            {getCurrentTime()}
                        </p>
                    </div>
                </div>

                {chatResponse && (
                    <div className="mt-3 flex items-start gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <Bot className="h-4 w-4" />
                        </span>

                        <div className="max-w-[85%] min-w-0 rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-2.5 text-sm leading-6 text-slate-600 break-words">
                            <p className="whitespace-pre-wrap">
                                {chatResponse}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                                {getCurrentTime()}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 flex items-center gap-2">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    type="text"
                    placeholder="Type your question..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400"
                />
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={chatLoading || !message.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {chatLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    );
}

function RecentSubjectResults({ recentSubjects }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-1 xl:col-span-1">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Recent Subject Results</h3>
                <button className="text-xs font-semibold text-indigo-600 hover:underline">View All</button>
            </div>

            <div className="-mx-2 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                        <tr className="text-xs text-slate-400">
                            <th className="px-2 pb-3 font-medium">Subject Code</th>
                            <th className="px-2 pb-3 font-medium">Subject Name</th>
                            <th className="px-2 pb-3 font-medium">Grade</th>
                            <th className="px-2 pb-3 font-medium">Marks</th>
                            <th className="px-2 pb-3 font-medium">Grade Point</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {recentSubjects.map((row) => (
                            <tr
                                key={`${row.subjectCode}-${row.semesterName}`}
                                className="text-slate-700"
                            >
                                <td className="whitespace-nowrap px-2 py-3 font-medium">
                                    {row.subjectCode}
                                </td>

                                <td className="whitespace-nowrap px-2 py-3 text-slate-500">
                                    {row.subjectName}
                                </td>

                                <td className="px-2 py-3">
                                    <span
                                        className={`rounded-md px-2 py-0.5 text-xs font-semibold ${gradeClasses[row.grade] ||
                                            "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {row.grade}
                                    </span>
                                </td>

                                <td className="whitespace-nowrap px-2 py-3 text-slate-500">
                                    {row.obtainedMarks} / {row.totalMarks}
                                </td>

                                <td className="whitespace-nowrap px-2 py-3 font-semibold text-slate-800">
                                    {row.gradePoint}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SgpaDonut({ dashboardData }) {
    const sgpa = Number(dashboardData?.latestSgpa || 0);

    const data = [
        {
            name: "Obtained",
            value: sgpa,
        },
        {
            name: "Remaining",
            value: Math.max(10 - sgpa, 0),
        },
    ];
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 text-base font-bold text-slate-900">SGPA - {dashboardData?.currentSemester || "Current Semester"}</h3>

            <div className="relative mx-auto h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius="72%"
                            outerRadius="100%"
                            startAngle={90}
                            endAngle={450}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell fill="#6366f1" />
                            <Cell fill="#e0e7ff" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-900">{dashboardData?.latestSgpa?.toFixed(2) || "0.00"}</span>
                    <span className="text-xs text-slate-400">SGPA</span>
                </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> SGPA Obtained
                    </span>
                    <span className="font-semibold text-slate-800">
                        {dashboardData?.latestSgpa?.toFixed(2) || "0.00"}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-100" /> Class Average
                    </span>
                    <span className="font-semibold text-slate-800"> Not available</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Topper SGPA
                    </span>
                    <span className="font-semibold text-slate-800"> Not available</span>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
                <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                Excellent! You are performing outstanding.
            </div>
        </div>
    );
}

function AIInsights({ performance }) {
    return (
        <div className="flex h-[430px] min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-slate-900">
                        AI Insights for You
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Personalized insights from your academic performance
                    </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
                    AI Powered
                </span>
            </div>

            {!performance ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />

                        <p className="text-xs text-slate-400">
                            Generating AI insights...
                        </p>
                    </div>
                </div>
            ) : (
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">

                    {/* Overall Summary */}
                    {performance.overallSummary && (
                        <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <ShieldCheck className="h-4 w-4" />
                            </span>

                            <div>
                                <p className="mb-1 text-xs font-semibold text-slate-800">
                                    Overall Summary
                                </p>

                                <p className="text-sm leading-snug text-slate-600">
                                    {performance.overallSummary}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Strengths */}
                    {performance.strengths?.map((strength, index) => (
                        <div
                            key={`strength-${index}`}
                            className="flex items-start gap-3"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <Award className="h-4 w-4" />
                            </span>

                            <div>
                                <p className="mb-1 text-xs font-semibold text-slate-800">
                                    Strength
                                </p>

                                <p className="text-sm leading-snug text-slate-600">
                                    {strength}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Areas for Improvement */}
                    {performance.areasForImprovement?.map((area, index) => (
                        <div
                            key={`improvement-${index}`}
                            className="flex items-start gap-3"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                <AlertTriangle className="h-4 w-4" />
                            </span>

                            <div>
                                <p className="mb-1 text-xs font-semibold text-slate-800">
                                    Area for Improvement
                                </p>

                                <p className="text-sm leading-snug text-slate-600">
                                    {area}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Recommendations */}
                    {performance.recommendations?.map(
                        (recommendation, index) => (
                            <div
                                key={`recommendation-${index}`}
                                className="flex items-start gap-3"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                                    <Wrench className="h-4 w-4" />
                                </span>

                                <div>
                                    <p className="mb-1 text-xs font-semibold text-slate-800">
                                        Recommendation
                                    </p>

                                    <p className="text-sm leading-snug text-slate-600">
                                        {recommendation}
                                    </p>
                                </div>
                            </div>
                        )
                    )}

                    {/* Performance Trend */}
                    {performance.performanceTrend && (
                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="mb-1 text-xs font-semibold text-slate-800">
                                Performance Trend
                            </p>

                            <p className="text-sm leading-6 text-slate-600">
                                {performance.performanceTrend}
                            </p>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [performance, setPerformance] = useState(null);

    const [dashboardData, setDashboardData] = useState(null);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


    useEffect(() => {
        loadDashboard();
        loadPerformance();
    }, []);

    const loadPerformance = async () => {

        try {

            const response =
                await studentService.getPerformanceAnalysis();

            console.log(
                "Performance API:",
                response
            );

            if (response?.success) {

                setPerformance(
                    response.data
                );
            }

        } catch (error) {

            console.error(
                "Performance API Error:",
                error
            );

        }

    };

    const loadDashboard = async () => {
        try {
            const [dashboardResponse, profileResponse] = await Promise.all([
                studentService.getDashboard(),
                studentService.getProfile(),
            ]);

            console.log(
                "Student Dashboard API:",
                JSON.stringify(dashboardResponse, null, 2)
            );

            console.log(
                "Student Profile API:",
                JSON.stringify(profileResponse, null, 2)
            );

            if (dashboardResponse?.success) {
                const dashboardData = dashboardResponse.data || {};
                const profileData = profileResponse?.success
                    ? profileResponse.data || {}
                    : {};

                setDashboardData({
                    ...dashboardData,
                    ...profileData,
                });
            } else {
                console.error(
                    "Dashboard API failed:",
                    dashboardResponse?.message
                );
            }
        } catch (error) {
            console.error(
                "Student Dashboard API Error:",
                error?.response?.data || error.message
            );
        }
    };

    const semesterResults =
        dashboardData?.semesterResults ||
        dashboardData?.semesterResult ||
        [];

    // --------------------------------------------------
    // ALL SUBJECTS
    // --------------------------------------------------

    const allSubjects = semesterResults.flatMap((semester) =>
        (semester.subjects || []).map((subject) => ({
            ...subject,
            semesterName: semester.semesterName,
        }))
    );

    // --------------------------------------------------
    // SUBJECT STATISTICS
    // --------------------------------------------------

    const totalSubjects = allSubjects.length;

    const passedSubjects = allSubjects.filter(
        (subject) =>
            subject.grade &&
            !["F", "FF", "FAIL"].includes(
                subject.grade.toUpperCase()
            )
    ).length;

    const backlogs = totalSubjects - passedSubjects;

    const passPercentage =
        totalSubjects > 0
            ? ((passedSubjects / totalSubjects) * 100).toFixed(2)
            : "0.00";

    // --------------------------------------------------
    // SGPA PERFORMANCE
    // --------------------------------------------------

    const performanceData = semesterResults.map((result) => ({
        sem: result.semesterName,
        sgpa: Number(result.sgpa || 0),
    }));

    const sgpaValues = performanceData.map(
        (item) => item.sgpa
    );

    const highestSgpa =
        sgpaValues.length > 0
            ? Math.max(...sgpaValues)
            : 0;

    const lowestSgpa =
        sgpaValues.length > 0
            ? Math.min(...sgpaValues)
            : 0;

    const averageSgpa =
        sgpaValues.length > 0
            ? sgpaValues.reduce(
                (sum, value) => sum + value,
                0
            ) / sgpaValues.length
            : 0;

    // --------------------------------------------------
    // HIGHEST / LOWEST SEMESTER
    // --------------------------------------------------

    const highestSemester =
        performanceData.find(
            (item) => item.sgpa === highestSgpa
        )?.sem || "";

    const lowestSemester =
        performanceData.find(
            (item) => item.sgpa === lowestSgpa
        )?.sem || "";

    // --------------------------------------------------
    // RECENT SUBJECTS
    // --------------------------------------------------

    const recentSubjects = [...allSubjects]
        .reverse()
        .slice(0, 5);
    return (
        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}
            <StudentSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
            />

            {/* CONTENT AREA */}
            <div
                className={`
                min-h-screen
                min-w-0
                transition-all
                duration-300
                ${sidebarCollapsed
                        ? "lg:ml-10"
                        : "lg:ml-70"
                    }
            `}
            >

                {/* TOPBAR */}
                <StudentTopbar
                    title="Student Dashboard"
                    onMenuClick={() => setSidebarOpen(true)}
                    onSidebarToggle={() =>
                        setSidebarCollapsed((prev) => !prev)
                    }
                    sidebarCollapsed={sidebarCollapsed}
                    dashboardData={dashboardData}
                />

                {/* PAGE */}
                <main
                    className="
                    min-w-0
                    overflow-x-hidden
                    px-4
                    pb-8
                    pt-20
                    sm:px-6
                    lg:px-8
                "
                >

                    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-6">

                        {/* YOUR EXISTING CONTENT */}

                        {/* WELCOME */}
                        <WelcomeBanner
                            dashboardData={dashboardData}
                        />

                        {/* STAT CARDS */}
                        <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

                            <StatCard
                                label="CGPA"
                                value={
                                    dashboardData?.cgpa?.toFixed(2) ||
                                    "0.00"
                                }
                                unit="/10"
                                sub={
                                    dashboardData?.latestResultStatus ||
                                    "Loading..."
                                }
                                icon={BarChart3}
                                iconBg="bg-indigo-50"
                                iconColor="text-indigo-600"
                            />

                            <StatCard
                                label="Total Subjects"
                                value={totalSubjects}
                                sub="All Semesters"
                                subClass="text-slate-400"
                                icon={BookOpen}
                                iconBg="bg-emerald-50"
                                iconColor="text-emerald-600"
                            />

                            <StatCard
                                label="Passed Subjects"
                                value={passedSubjects}
                                sub={`${passPercentage}%`}
                                subClass="text-slate-400"
                                icon={CheckCircle2}
                                iconBg="bg-violet-50"
                                iconColor="text-violet-600"
                            />

                            <StatCard
                                label="Backlogs"
                                value={backlogs}
                                sub={
                                    backlogs > 0
                                        ? "Need Focus"
                                        : "Excellent"
                                }
                                subClass={
                                    backlogs > 0
                                        ? "text-amber-600"
                                        : "text-emerald-600"
                                }
                                icon={AlertTriangle}
                                iconBg="bg-orange-50"
                                iconColor="text-orange-500"
                            />

                        </div>

                        {/* PERFORMANCE + AI */}
                        <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-3">

                            <div className="min-w-0 xl:col-span-2">
                                <PerformanceOverview
                                    performanceData={performanceData}
                                    highestSgpa={highestSgpa}
                                    lowestSgpa={lowestSgpa}
                                    averageSgpa={averageSgpa}
                                    highestSemester={highestSemester}
                                    lowestSemester={lowestSemester}
                                    dashboardData={dashboardData}
                                />
                            </div>

                            <div className="min-w-0">
                                <AIAssistant
                                    dashboardData={dashboardData}
                                    backlogs={backlogs}
                                />
                            </div>

                        </div>

                        {/* RECENT RESULTS + SGPA + AI INSIGHTS */}
                        <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-3">

                            <div className="min-w-0">
                                <RecentSubjectResults
                                    recentSubjects={recentSubjects}
                                />
                            </div>

                            <div className="min-w-0">
                                <SgpaDonut
                                    dashboardData={dashboardData}
                                />
                            </div>

                            <div className="min-w-0">
                                <AIInsights
                                    performance={performance}
                                />
                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div >
    );
}