import React, { useEffect, useState } from "react";
import {
    Download,
    FileText,
    Award,
    TrendingUp,
    BookOpen,
    CheckCircle2,
    AlertTriangle,
    ChevronDown,
    Loader2,
} from "lucide-react";


import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";
import studentService from "../../services/studentService";

export default function MyResults() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [results, setResults] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    // --------------------------------------------------
    // LOAD RESULTS
    // --------------------------------------------------



    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await studentService.getProfile();

                console.log("Profile API:", response);

                if (response?.success) {
                    setProfile(response.data);
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error("Profile API Error:", error);
            }
        };

        loadProfile();
    }, []);

    const loadResults = async () => {
        try {

            setLoading(true);
            setError("");

            const response = await studentService.getResults();
            console.log("Results API:", response.data);

            console.log("My Results API:", response);

            if (response?.success) {
                setResults(response.data || []);
            } else {
                setError(response?.message || "Unable to load results.");
            }

        } catch (error) {

            console.error("My Results API Error:", error);

            setError(
                error?.response?.data?.message ||
                "Unable to load your results."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadResults();
    }, []);

    // --------------------------------------------------
    // SEMESTERS
    // --------------------------------------------------

    const semesters = [
        ...results
            .map((result) => result.semesterName)
            .filter(Boolean)
            .filter(
                (value, index, self) =>
                    self.indexOf(value) === index
            )
    ];;

    const filteredResults = selectedSemester
        ? results.filter(
            (result) =>
                result.semesterName === selectedSemester
        )
        : [];

    // --------------------------------------------------
    // STATISTICS
    // --------------------------------------------------

    const totalSemesters = results.length;

    const passedSemesters = results.filter(
        (result) =>
            result.resultStatus?.trim().toUpperCase() === "PASS"
    ).length;

    const latestResult =
        results.length > 0
            ? results[results.length - 1]
            : null;

    const latestSgpa = Number(
        latestResult?.sgpa || 0
    );

    const cgpa =
        results.length > 0
            ? results.reduce(
                (total, result) => total + Number(result.sgpa || 0),
                0
            ) / results.length
            : 0;

    // --------------------------------------------------
    // PDF DOWNLOAD
    // --------------------------------------------------

    const downloadMarksheet = async (resultId) => {

        try {

            const token = sessionStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/student/results/${resultId}/pdf`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to download marksheet");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `marksheet-${resultId}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Marksheet Download Error:",
                error
            );

            alert("Unable to download marksheet.");

        }
    };

    // --------------------------------------------------
    // PDF PREVIEW
    // --------------------------------------------------

    const handlePreview = async (resultId) => {

        try {

            const token =
                sessionStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/student/results/${resultId}/pdf`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to generate marksheet preview"
                );
            }

            const blob =
                await response.blob();

            const pdfUrl =
                window.URL.createObjectURL(blob);

            window.open(
                pdfUrl,
                "_blank"
            );

        } catch (error) {

            console.error(
                "PDF Preview Error:",
                error
            );

            alert(
                "Unable to preview marksheet."
            );
        }
    };





    // --------------------------------------------------
    // UI
    // --------------------------------------------------

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
                        : "lg:ml-72"
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
                    title="My Results"
                />

                {/* PAGE CONTENT */}
                <main
                    className="
        min-w-0
        px-4
        pb-6
        pt-20
        sm:px-6
        space-y-6
    "
                >
                    {/* HEADER */}

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            My Results
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            View your semester-wise academic results,
                            SGPA and marksheets.
                        </p>
                    </div>


                    {/* STAT CARDS */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {/* CGPA */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    CGPA
                                </span>

                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50">
                                    <Award className="h-4 w-4 text-indigo-600" />
                                </span>

                            </div>

                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {cgpa.toFixed(2)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Overall Performance
                            </p>

                        </div>


                        {/* SEMESTERS */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    Semesters
                                </span>

                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                                    <BookOpen className="h-4 w-4 text-emerald-600" />
                                </span>

                            </div>

                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {totalSemesters}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Results Available
                            </p>

                        </div>


                        {/* PASSED */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    Passed
                                </span>

                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50">
                                    <CheckCircle2 className="h-4 w-4 text-violet-600" />
                                </span>

                            </div>

                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {passedSemesters}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Passed Semesters
                            </p>

                        </div>


                        {/* LATEST SGPA */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    Latest SGPA
                                </span>

                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
                                    <TrendingUp className="h-4 w-4 text-orange-500" />
                                </span>

                            </div>

                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {latestSgpa.toFixed(2)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Latest Semester
                            </p>

                        </div>

                    </div>


                    {/* RESULTS */}

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* HEADER */}

                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h3 className="text-base font-bold text-slate-900">
                                    Semester Results
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Your complete semester-wise results
                                </p>

                            </div>


                            {/* SEMESTER FILTER */}

                            <div className="relative">

                                <select
                                    value={selectedSemester}
                                    onChange={(e) =>
                                        setSelectedSemester(e.target.value)
                                    }
                                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-400"
                                >
                                    <option value="" disabled>
                                        Select Semester
                                    </option>

                                    {semesters.map((semester) => (
                                        <option
                                            key={semester}
                                            value={semester}
                                        >
                                            {semester}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            </div>

                        </div>


                        {/* LOADING */}

                        {loading && (

                            <div className="flex min-h-[300px] items-center justify-center">

                                <div className="flex flex-col items-center gap-3">

                                    <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />

                                    <p className="text-sm text-slate-400">
                                        Loading results...
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* ERROR */}

                        {!loading && error && (

                            <div className="p-6">

                                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                                    {error}
                                </div>

                            </div>

                        )}


                        {/* EMPTY */}

                        {!loading &&
                            !error &&
                            !selectedSemester && (
                                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                                    <FileText className="h-10 w-10 text-slate-300" />

                                    <p className="mt-3 text-sm font-semibold text-slate-700">
                                        Select a semester
                                    </p>

                                    <p className="mt-1 max-w-sm text-xs text-slate-400">
                                        Select a semester above to view your
                                        result, subjects, grades and SGPA.
                                    </p>
                                </div>
                            )}

                        {!loading &&
                            !error &&
                            selectedSemester &&
                            filteredResults.length === 0 && (
                                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                                    <AlertTriangle className="h-10 w-10 text-slate-300" />

                                    <p className="mt-3 text-sm font-semibold text-slate-700">
                                        No result available
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        No result was found for {selectedSemester}.
                                    </p>
                                </div>
                            )}


                        {/* RESULTS */}

                        {!loading &&
                            !error &&
                            filteredResults.length > 0 && (

                                <div className="divide-y divide-slate-100">

                                    {filteredResults.map(
                                        (result, index) => (

                                            <div
                                                key={
                                                    result.id ||
                                                    result.resultId ||
                                                    index
                                                }
                                                className="p-5"
                                            >

                                                {/* RESULT HEADER */}

                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                                    <div className="flex items-center gap-4">

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                                                            <FileText className="h-5 w-5 text-indigo-600" />
                                                        </div>

                                                        <div>

                                                            <h4 className="font-bold text-slate-900">
                                                                {result.semesterName ||
                                                                    `Semester ${index + 1}`}
                                                            </h4>

                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {result.courseName ||
                                                                    "Academic Result"}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div className="flex flex-wrap items-center gap-3">

                                                        {/* SGPA */}
                                                        <div className="rounded-xl bg-indigo-50 px-4 py-2 text-center">
                                                            <p className="text-[10px] font-medium text-indigo-500">
                                                                SGPA
                                                            </p>

                                                            <p className="text-lg font-bold text-indigo-700">
                                                                {Number(result.sgpa || 0).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        {/* PERCENTAGE */}
                                                        <div className="rounded-xl bg-emerald-50 px-4 py-2 text-center">
                                                            <p className="text-[10px] font-medium text-emerald-500">
                                                                Percentage
                                                            </p>

                                                            <p className="text-lg font-bold text-emerald-700">
                                                                {Number(
                                                                    result.percentage ??
                                                                    result.cgpaPercentage ??
                                                                    0
                                                                ).toFixed(2)}%
                                                            </p>
                                                        </div>

                                                        {/* STATUS */}
                                                        <div
                                                            className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold ${result.status?.toUpperCase() === "PASS"
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-red-50 text-red-600"
                                                                }`}
                                                        >
                                                            {result.status?.toUpperCase() === "PASS" ? (
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            ) : (
                                                                <AlertTriangle className="h-4 w-4" />
                                                            )}

                                                            {result.status || "N/A"}
                                                        </div>

                                                        <div className="flex items-center gap-2">

                                                            {/* PREVIEW PDF */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handlePreview(
                                                                        result.id ||
                                                                        result.resultId
                                                                    )
                                                                }
                                                                className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-indigo-200
            bg-indigo-50
            px-4
            py-2.5
            text-xs
            font-semibold
            text-indigo-700
            transition
            hover:bg-indigo-100
        "
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                                Preview
                                                            </button>

                                                            {/* DOWNLOAD PDF */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    downloadMarksheet(
                                                                        result.id ||
                                                                        result.resultId
                                                                    )
                                                                }
                                                                className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-indigo-600
            px-4
            py-2.5
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-indigo-700
        "
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                Download
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* SUBJECTS */}

                                                {result.subjects?.length > 0 && (

                                                    <div className="mt-5 overflow-x-auto">

                                                        <table className="w-full min-w-[650px] text-left text-sm">

                                                            <thead>

                                                                <tr className="border-b border-slate-100 text-xs text-slate-400">

                                                                    <th className="px-3 pb-3 font-medium">
                                                                        Subject Code
                                                                    </th>

                                                                    <th className="px-3 pb-3 font-medium">
                                                                        Subject
                                                                    </th>

                                                                    <th className="px-3 pb-3 font-medium">
                                                                        Marks
                                                                    </th>

                                                                    <th className="px-3 pb-3 font-medium">
                                                                        Grade
                                                                    </th>

                                                                    <th className="px-3 pb-3 font-medium">
                                                                        Grade Point
                                                                    </th>

                                                                </tr>

                                                            </thead>


                                                            <tbody className="divide-y divide-slate-100">

                                                                {result.subjects.map(
                                                                    (subject, subjectIndex) => (

                                                                        <tr
                                                                            key={
                                                                                subject.id ||
                                                                                subject.subjectCode ||
                                                                                subjectIndex
                                                                            }
                                                                            className="text-slate-700"
                                                                        >

                                                                            <td className="px-3 py-3 font-medium">
                                                                                {subject.subjectCode ||
                                                                                    "-"}
                                                                            </td>

                                                                            <td className="px-3 py-3 text-slate-500">
                                                                                {subject.subjectName ||
                                                                                    "-"}
                                                                            </td>

                                                                            <td className="px-3 py-3 text-slate-500">
                                                                                {subject.obtainedMarks ??
                                                                                    "-"}
                                                                                {" / "}
                                                                                {subject.totalMarks ??
                                                                                    "-"}
                                                                            </td>

                                                                            <td className="px-3 py-3">

                                                                                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                                                                                    {subject.grade ||
                                                                                        "-"}
                                                                                </span>

                                                                            </td>

                                                                            <td className="px-3 py-3 font-semibold text-slate-800">
                                                                                {subject.gradePoint ??
                                                                                    "-"}
                                                                            </td>

                                                                        </tr>

                                                                    )
                                                                )}

                                                            </tbody>

                                                        </table>

                                                    </div>

                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                    </div>

                </main>

            </div>

        </div>
    );
}