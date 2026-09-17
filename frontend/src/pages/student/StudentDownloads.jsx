import React, { useEffect, useState } from "react";
import {
    Download,
    FileText,
    Printer,
    Award,
    BookOpen,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    FileDown,
} from "lucide-react";

import axios from "axios";

import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";
import studentService from "../../services/studentService";

const API_URL = "http://localhost:8080/api/student";

const StudentDownloads = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [results, setResults] = useState([]);
    const [profile, setProfile] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    const [selectedSemester, setSelectedSemester] = useState("");

    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const [error, setError] = useState("");

    // =====================================================
    // AUTH CONFIG
    // =====================================================

    const getAuthConfig = () => {

        const token = sessionStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };


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
                resultsResponse,
                profileResponse,
                dashboardResponse,
            ] = await Promise.all([
                studentService.getResults(),
                studentService.getProfile(),
                studentService.getDashboard(),
            ]);


            console.log(
                "Student Results API:",
                resultsResponse
            );

            console.log(
                "Student Profile API:",
                profileResponse
            );

            console.log(
                "Student Dashboard API:",
                dashboardResponse
            );


            // =================================================
            // RESULTS
            // =================================================

            if (resultsResponse?.success) {

                const resultData =
                    resultsResponse.data || [];

                setResults(
                    Array.isArray(resultData)
                        ? resultData
                        : []
                );

            }


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

                setDashboardData(
                    dashboardResponse.data
                );

            }

        } catch (err) {

            console.error(
                "Download Page Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load your results."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RESULT HELPERS
    // =====================================================

    const getSemesterId = (result) => {

        return (
            result?.semesterId ??
            result?.semester?.id ??
            result?.semester?.semesterId
        );

    };


    const getSemesterName = (result, index) => {

        return (
            result?.semesterName ||
            result?.semester?.name ||
            result?.semester ||
            `Semester ${index + 1}`
        );

    };


    const getResultId = (result) => {

        return (
            result?.id ??
            result?.resultId
        );

    };


    // =====================================================
    // SELECTED RESULT
    // =====================================================

    const selectedResult =
        results.find(
            (result) =>
                String(getSemesterId(result)) ===
                String(selectedSemester)
        ) || null;


    // =====================================================
    // DOWNLOAD PDF
    // =====================================================

    const downloadSemesterPDF = async () => {

        if (!selectedResult) {

            alert(
                "Please select a semester first."
            );

            return;
        }


        const resultId =
            getResultId(selectedResult);


        if (!resultId) {

            alert(
                "Result ID is not available."
            );

            return;
        }


        try {

            setDownloading(true);


            const response = await axios.get(
                `${API_URL}/results/${resultId}/pdf`,
                {
                    ...getAuthConfig(),
                    responseType: "blob",
                }
            );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                );


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `semester-result-${resultId}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Semester PDF Error:",
                err
            );

            alert(
                "Unable to download semester result."
            );

        } finally {

            setDownloading(false);

        }

    };


    // =====================================================
    // OPEN PDF / PRINT
    // =====================================================

    const openSemesterPDF = async () => {

        if (!selectedResult) {

            alert(
                "Please select a semester first."
            );

            return;
        }


        const resultId =
            getResultId(selectedResult);


        if (!resultId) {

            alert(
                "Result ID is not available."
            );

            return;
        }


        try {

            setDownloading(true);


            const response = await axios.get(
                `${API_URL}/results/${resultId}/pdf`,
                {
                    ...getAuthConfig(),
                    responseType: "blob",
                }
            );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                );


            const url =
                window.URL.createObjectURL(blob);


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        } catch (err) {

            console.error(
                "Open PDF Error:",
                err
            );

            alert(
                "Unable to open result."
            );

        } finally {

            setDownloading(false);

        }

    };


    // =====================================================
    // PRINT RESULT
    // =====================================================

    const printResult = async () => {

        if (!selectedResult) {

            alert(
                "Please select a semester first."
            );

            return;
        }


        const resultId =
            getResultId(selectedResult);


        if (!resultId) {

            alert(
                "Result ID is not available."
            );

            return;
        }


        try {

            setDownloading(true);


            const response = await axios.get(
                `${API_URL}/results/${resultId}/pdf`,
                {
                    ...getAuthConfig(),
                    responseType: "blob",
                }
            );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                );


            const url =
                window.URL.createObjectURL(blob);


            const printWindow =
                window.open(
                    url,
                    "_blank"
                );


            if (printWindow) {

                printWindow.onload = () => {

                    printWindow.focus();

                    printWindow.print();

                };

            }

        } catch (err) {

            console.error(
                "Print Error:",
                err
            );

            alert(
                "Unable to print result."
            );

        } finally {

            setDownloading(false);

        }

    };


    // =====================================================
    // COMPLETE ACADEMIC RESULT
    // =====================================================

    const downloadCompleteResult = () => {

        if (!results.length) {

            alert(
                "No academic results available."
            );

            return;
        }


        alert(
            "Complete academic result PDF endpoint is not available in the current backend. Add a backend endpoint for generating all semester results."
        );

    };


    // =====================================================
    // GENERATE MARKSHEET
    // =====================================================

    const generateMarksheet = async () => {

        if (!selectedResult) {

            alert(
                "Please select a semester first."
            );

            return;
        }


        const resultId =
            getResultId(selectedResult);


        if (!resultId) {

            alert(
                "Result ID is not available."
            );

            return;
        }


        try {

            setDownloading(true);


            const response = await axios.get(
                `${API_URL}/results/${resultId}/pdf`,
                {
                    ...getAuthConfig(),
                    responseType: "blob",
                }
            );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                );


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `marksheet-${resultId}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Marksheet Error:",
                err
            );

            alert(
                "Unable to generate marksheet."
            );

        } finally {

            setDownloading(false);

        }

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
                            : "lg:ml-80"
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
                        title="Download Result"
                    />

                    {/* LOADING CONTENT */}
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
                        <div className="flex min-h-[500px] items-center justify-center">
                            <div className="text-center">
                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />

                                <p className="mt-3 text-sm text-slate-500">
                                    Loading your results...
                                </p>
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        );
    }

    // =====================================================
    // MAIN
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}
            <StudentSidebar
                open={sidebarOpen}
                collapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
            />

            {/* MAIN CONTENT AREA */}
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
                    title="Download Result"
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
            space-y-8
        "
                    >
                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">

                                <Download className="h-5 w-5 text-indigo-600" />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Download Result
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Download, print and generate your academic result documents.
                                </p>

                            </div>

                        </div>




                        {/* ERROR */}

                        {error && (

                            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">

                                <div className="flex items-center gap-3">

                                    <AlertTriangle className="h-5 w-5 text-red-500" />

                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* SEMESTER SELECTOR */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">

                                    <BookOpen className="h-5 w-5 text-indigo-600" />

                                </div>

                                <div>

                                    <h2 className="font-bold text-slate-900">
                                        Select Semester
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Select a semester to download or print its result.
                                    </p>

                                </div>

                            </div>


                            <div className="mt-5">

                                <select
                                    value={selectedSemester}
                                    onChange={(e) =>
                                        setSelectedSemester(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:max-w-md"
                                >

                                    <option value="">
                                        Select Semester
                                    </option>

                                    {results.map(
                                        (result, index) => (

                                            <option
                                                key={
                                                    getSemesterId(
                                                        result
                                                    ) ||
                                                    index
                                                }
                                                value={
                                                    getSemesterId(
                                                        result
                                                    )
                                                }
                                            >

                                                {getSemesterName(
                                                    result,
                                                    index
                                                )}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* SELECTED RESULT */}
                            {selectedResult && (
                                <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">

                                        <div>
                                            <p className="text-xs font-medium text-slate-400">
                                                Selected Result
                                            </p>

                                            <h3 className="mt-1 text-lg font-bold text-slate-800">
                                                {getSemesterName(
                                                    selectedResult,
                                                    results.indexOf(selectedResult)
                                                )}
                                            </h3>

                                            <p className="mt-1 text-sm font-semibold text-indigo-700">
                                                {getExamTypeTitle(selectedResult)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                                            <span className="text-sm font-semibold text-emerald-700">
                                                Result Available
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            )}

                        </section>

                        {/* DOWNLOAD OPTIONS */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-2">

                            {/* SEMESTER PDF */}
                            <DownloadCard
                                icon={
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                }
                                iconBg="bg-indigo-50"
                                title="Semester Result PDF"
                                description="Download the selected semester result as a PDF document."
                                buttonText={
                                    downloading
                                        ? "Downloading..."
                                        : "Download PDF"
                                }
                                onClick={downloadSemesterPDF}
                                disabled={!selectedResult || downloading}
                            />

                            {/* COMPLETE RESULT */}
                            <DownloadCard
                                icon={
                                    <BookOpen className="h-5 w-5 text-emerald-600" />
                                }
                                iconBg="bg-emerald-50"
                                title="Complete Academic Result"
                                description="Download your complete academic result containing all available semesters."
                                buttonText="Download Complete Result"
                                onClick={downloadCompleteResult}
                                disabled={results.length === 0 || downloading}
                            />

                            {/* PRINT */}
                            <DownloadCard
                                icon={
                                    <Printer className="h-5 w-5 text-violet-600" />
                                }
                                iconBg="bg-violet-50"
                                title="Print Result"
                                description="Open the selected semester result and print it directly."
                                buttonText="Print Result"
                                onClick={printResult}
                                disabled={!selectedResult || downloading}
                            />

                            {/* MARKSHEET */}
                            <DownloadCard
                                icon={
                                    <Award className="h-5 w-5 text-orange-500" />
                                }
                                iconBg="bg-orange-50"
                                title="Generate Marksheet"
                                description="Generate and download the marksheet for the selected semester."
                                buttonText="Generate Marksheet"
                                onClick={generateMarksheet}
                                disabled={!selectedResult || downloading}
                            />

                        </div>


                        {/* INFORMATION */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-start gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                    <FileDown className="h-4 w-4 text-slate-600" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-800">
                                        Download Information
                                    </h3>

                                    <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-500">
                                        <li>
                                            • Select a semester before downloading or printing a semester result.
                                        </li>

                                        <li>
                                            • PDF documents are generated from your official SRMS result data.
                                        </li>

                                        <li>
                                            • Keep your downloaded marksheet safely for future reference.
                                        </li>
                                    </ul>
                                </div>

                            </div>

                        </section>

                    </div>
                </main>

            </div>

        </div>
    );

};


// =====================================================
// DOWNLOAD CARD
// =====================================================

const DownloadCard = ({
    icon,
    iconBg,
    title,
    description,
    buttonText,
    onClick,
    disabled,
}) => {
    return (
        <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-full items-start gap-4">

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >
                    {icon}
                </div>

                <div className="min-w-0 flex-1">

                    <h2 className="font-bold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                        {description}
                    </p>

                    <button
                        type="button"
                        onClick={onClick}
                        disabled={disabled}
                        className="
                            mt-4
                            inline-flex
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
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <Download className="h-4 w-4" />

                        {buttonText}
                    </button>

                </div>
            </div>
        </section>
    );
};

export default StudentDownloads;