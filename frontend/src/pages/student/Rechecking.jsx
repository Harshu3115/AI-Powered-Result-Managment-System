import React, { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileCheck2,
    Loader2,
    RefreshCcw,
    Send,
    XCircle,
    ChevronDown,
} from "lucide-react";

import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";
import studentService from "../../services/studentService";
import ConfirmModal from "../../components/ConfirmModal";


const Rechecking = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [loading, setLoading] = useState(true);

    const [dashboardData, setDashboardData] = useState(null);

    const [selectedSemester, setSelectedSemester] =
        useState("");

    const [selectedSubject, setSelectedSubject] =
        useState("");

    const [reason, setReason] =
        useState("");

    const [requests, setRequests] =
        useState([]);

    const [submitting, setSubmitting] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");
    const [profile, setProfile] = useState(null);


    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedCancelRequest, setSelectedCancelRequest] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const [currentTime, setCurrentTime] = useState(Date.now());

    // =========================================================
    // LOAD DASHBOARD DATA
    // =========================================================

    useEffect(() => {

        loadData();

    }, []);

    useEffect(() => {

        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timer);

    }, []);


    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                dashboardResponse,
                profileResponse,
            ] = await Promise.all([
                studentService.getDashboard(),
                studentService.getProfile(),
            ]);

            console.log(
                "Rechecking Dashboard API:",
                dashboardResponse
            );

            console.log(
                "Rechecking Profile API:",
                profileResponse
            );

            // Dashboard data
            if (dashboardResponse?.success) {
                const data = dashboardResponse.data;

                setDashboardData(data);

                const semesterResults =
                    data?.semesterResults || [];

                if (semesterResults.length > 0) {
                    const latestSemester =
                        semesterResults[
                        semesterResults.length - 1
                        ];

                    setSelectedSemester(
                        latestSemester?.semesterName || ""
                    );
                }
            } else {
                setDashboardData(
                    dashboardResponse?.data ||
                    dashboardResponse ||
                    null
                );
            }

            // Profile data
            if (profileResponse?.success) {
                setProfile(profileResponse.data);
            } else {
                setProfile(
                    profileResponse?.data ||
                    profileResponse ||
                    null
                );
            }

        } catch (err) {
            console.error(
                "Rechecking Dashboard Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load student results."
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
    // SELECTED SEMESTER RESULT
    // =========================================================

    const selectedSemesterResult =
        useMemo(() => {

            const results =
                dashboardData?.semesterResults || [];

            return (
                results.find(
                    (result) =>
                        String(
                            result?.semesterName
                        ) ===
                        String(selectedSemester)
                ) || null
            );

        }, [
            dashboardData,
            selectedSemester,
        ]);


    // =========================================================
    // SUBJECTS
    // =========================================================

    const subjects =
        selectedSemesterResult?.subjects || [];


    // =========================================================
    // HELPERS
    // =========================================================

    const getSubjectName = (subject) => {

        return (
            subject?.subjectName ||
            subject?.name ||
            subject?.subject ||
            "Unknown Subject"
        );

    };


    const getSubjectCode = (subject) => {

        return (
            subject?.subjectCode ||
            subject?.code ||
            "-"
        );

    };


    const getMarks = (subject) => {

        return Number(
            subject?.obtainedMarks ??
            subject?.marks ??
            0
        );

    };


    const getGrade = (subject) => {

        return (
            subject?.grade ||
            "-"
        );

    };


    // =========================================================
    // SELECTED SUBJECT
    // =========================================================

    const selectedSubjectData = useMemo(() => {

        if (!selectedSubject) {
            return null;
        }

        const foundSubject = subjects.find(
            (subject) =>
                String(subject?.resultSubjectId) ===
                String(selectedSubject)
        );

        return foundSubject || null;

    }, [subjects, selectedSubject]);

    console.log("SELECTED SUBJECT:", selectedSubject);
    console.log("AVAILABLE SUBJECTS:", subjects);
    console.log("SELECTED SUBJECT DATA:", selectedSubjectData);


    // =========================================================
    // HANDLE SEMESTER CHANGE
    // =========================================================

    const handleSemesterChange = (e) => {

        const semester = e.target.value;

        setSelectedSemester(semester);

        // Reset subject when semester changes
        setSelectedSubject("");

        // Clear previous messages
        setMessage("");
        setError("");
    };


    // =========================================================
    // HANDLE SUBJECT CHANGE
    // =========================================================

    const handleSubjectChange = (e) => {

        setSelectedSubject(
            e.target.value
        );

        setMessage("");

        setError("");

    };


    // =========================================================
    // SUBMIT REQUEST
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!selectedSemester) {

            setError(
                "Please select a semester."
            );

            return;
        }


        if (!selectedSubjectData) {

            setError(
                "Please select a subject."
            );

            return;
        }


        const resultSubjectId =
            selectedSubjectData?.resultSubjectId;


        if (!resultSubjectId) {

            console.error(
                "Missing resultSubjectId:",
                selectedSubjectData
            );

            setError(
                "Result Subject ID is missing. Please refresh the page."
            );

            return;
        }


        try {

            setSubmitting(true);


            console.log(
                "RECHECKING PAYLOAD:",
                {
                    examType: "REGULAR",
                    resultSubjectIds: [
                        resultSubjectId
                    ],
                    reason: reason.trim(),
                }
            );


            const response =
                await studentService.submitRechecking({

                    examType: "REGULAR",

                    resultSubjectIds: [
                        resultSubjectId
                    ],

                    reason:
                        reason.trim(),

                });


            console.log(
                "Rechecking Submit Response:",
                response
            );


            if (response?.success) {

                setMessage(
                    response?.message ||
                    "Rechecking request submitted successfully."
                );

                setReason("");

                setSelectedSubject("");

                await loadRequests();

            } else {

                setError(
                    response?.message ||
                    "Unable to submit rechecking request."
                );

            }

        } catch (err) {

            console.error(
                "Rechecking Submit Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to submit rechecking request."
            );

        } finally {

            setSubmitting(false);

        }

    };


    // =========================================================
    // LOAD REQUESTS
    // =========================================================

    const loadRequests = async () => {

        /*
         * Connect this after your backend API is available.
         */

        if (
            typeof studentService.getRecheckingRequests !==
            "function"
        ) {

            return;

        }


        try {

            const response =
                await studentService.getRecheckingRequests();

            console.log(
                "Rechecking Requests API:",
                response
            );


            if (response?.success) {

                setRequests(
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : []
                );

            }

        } catch (err) {

            console.error(
                "Rechecking Requests Error:",
                err
            );

        }

    };


    // =========================================================
    // LOAD REQUESTS ON PAGE LOAD
    // =========================================================

    useEffect(() => {

        loadRequests();

        const handleNotificationReceived = (event) => {

            const notification = event.detail;

            console.log(
                "Rechecking page received notification:",
                notification
            );

            // Refresh rechecking status
            if (
                notification?.type === "RECHECKING_APPROVED" ||
                notification?.type === "RECHECKING_REJECTED" ||
                notification?.type === "RECHECKING_COMPLETED" ||
                notification?.type === "RESULT_UPDATED"
            ) {
                loadRequests();
            }
        };

        window.addEventListener(
            "notificationReceived",
            handleNotificationReceived
        );

        return () => {
            window.removeEventListener(
                "notificationReceived",
                handleNotificationReceived
            );
        };

    }, []);


    const CANCEL_WINDOW = 10 * 60 * 1000;

    const canCancelRequest = (request) => {

        if (!request?.id || !request?.appliedAt) {
            return false;
        }

        const status =
            String(request.status || "").toUpperCase();

        if (status !== "PENDING") {
            return false;
        }

        const appliedTime =
            new Date(request.appliedAt).getTime();

        if (Number.isNaN(appliedTime)) {
            return false;
        }

        const elapsed =
            Date.now() - appliedTime;

        return elapsed >= 0 && elapsed < CANCEL_WINDOW;
    };


    const getRemainingMinutes = (appliedAt) => {

        if (!appliedAt) {
            return 0;
        }

        const appliedTime =
            new Date(appliedAt).getTime();

        if (Number.isNaN(appliedTime)) {
            return 0;
        }

        const remaining =
            (appliedTime + CANCEL_WINDOW) - Date.now();

        if (remaining <= 0) {
            return 0;
        }

        return Math.ceil(
            remaining / 60000
        );
    };





    const handleCancelRequest = (request) => {

        if (!request?.id) {
            setError("Request ID is missing.");
            return;
        }

        if (!canCancelRequest(request)) {
            setError(
                "Cancellation period has expired. You can cancel a request only within 10 minutes."
            );
            return;
        }

        setSelectedCancelRequest(request);
        setCancelModalOpen(true);
    };


    const confirmCancelRequest = async () => {

        if (!selectedCancelRequest?.id) {
            setError("Request ID is missing.");
            return;
        }

        try {

            setCancelLoading(true);
            setError("");
            setMessage("");

            const response =
                await studentService.cancelRechecking(
                    selectedCancelRequest.id
                );

            console.log(
                "Cancel Rechecking Response:",
                response
            );

            if (response?.success) {

                setMessage(
                    response?.message ||
                    "Rechecking request cancelled successfully."
                );

                setCancelModalOpen(false);
                setSelectedCancelRequest(null);

                await loadRequests();

            } else {

                setError(
                    response?.message ||
                    "Unable to cancel rechecking request."
                );
            }

        } catch (err) {

            console.error(
                "Cancel Rechecking Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to cancel rechecking request."
            );

        } finally {

            setCancelLoading(false);
        }
    };


    // =========================================================
    // STATUS UI
    // =========================================================

    const getStatusConfig = (status) => {

        const value =
            String(status || "")
                .toUpperCase();


        if (value === "APPROVED") {

            return {
                label: "Approved",
                className:
                    "bg-emerald-50 text-emerald-600",
                icon: CheckCircle2,
            };

        }


        if (value === "REJECTED") {

            return {
                label: "Rejected",
                className:
                    "bg-red-50 text-red-600",
                icon: XCircle,
            };

        }


        if (value === "COMPLETED") {

            return {
                label: "Completed",
                className:
                    "bg-blue-50 text-blue-600",
                icon: CheckCircle2,
            };

        }

        if (value === "CANCELLED") {
            return {
                label: "Cancelled",
                className: "bg-slate-100 text-slate-500",
                icon: XCircle,
            };
        }


        return {
            label: "Pending",
            className:
                "bg-amber-50 text-amber-600",
            icon: Clock3,
        };

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="flex min-h-screen bg-slate-50">

                <StudentSidebar
                    open={sidebarOpen}
                    collapsed={sidebarCollapsed}
                    onClose={() => setSidebarOpen(false)}
                />

                <div
                    className={`
        min-h-screen
        min-w-0
        flex-1
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
                    />

                    <main className="flex min-h-screen flex-1 items-center justify-center pt-16">

                        <div className="flex items-center gap-3 text-sm text-slate-500">

                            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />

                            Loading rechecking...

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

            {/* CONTENT */}
            <div
                className={`
                min-h-screen
                min-w-0
                flex-1
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
                    title="Rechecking"
                />

                {/* MAIN */}
                <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-6 lg:px-8">

                    <div className="mx-auto w-full max-w-[1400px] space-y-6">

                        {/* YOUR EXISTING HEADER */}
                        <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                    <RefreshCcw className="h-6 w-6" />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-extrabold">
                                        Rechecking
                                    </h1>

                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-indigo-100">
                                        Request rechecking for a specific subject
                                        if you believe your marks require verification.
                                    </p>
                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            ALERTS
                        ================================================= */}

                        {message && (

                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">

                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                                <span>
                                    {message}
                                </span>

                            </div>

                        )}


                        {error && (

                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* =================================================
                            REQUEST FORM
                        ================================================= */}

                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">

                                        <FileCheck2 className="h-5 w-5 text-indigo-600" />

                                    </div>

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            Request Rechecking
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Select the semester and subject you want to recheck.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="p-5"
                            >

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                                    {/* SEMESTER */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Semester
                                        </label>

                                        <div className="relative">

                                            <select
                                                value={
                                                    selectedSemester
                                                }
                                                onChange={
                                                    handleSemesterChange
                                                }
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            >

                                                <option value="">
                                                    Select Semester
                                                </option>

                                                {semesters.map(
                                                    (
                                                        semester
                                                    ) => (

                                                        <option
                                                            key={
                                                                semester
                                                            }
                                                            value={
                                                                semester
                                                            }
                                                        >
                                                            {
                                                                semester
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                            <ChevronDown
                                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                            />

                                        </div>

                                    </div>


                                    {/* SUBJECT */}

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Select Subject
                                        </label>

                                        <select
                                            value={selectedSubject}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                console.log("SUBJECT SELECTED:", value);

                                                setSelectedSubject(value);
                                            }}
                                            disabled={!selectedSemester || subjects.length === 0}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                        >
                                            <option value="">
                                                Select Subject
                                            </option>

                                            {subjects.map((subject, index) => (
                                                <option
                                                    key={
                                                        subject?.resultSubjectId ??
                                                        index
                                                    }
                                                    value={
                                                        subject?.resultSubjectId ?? ""
                                                    }
                                                >
                                                    {subject?.subjectCode} - {subject?.subjectName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>


                                {/* =================================================
                                    SELECTED SUBJECT DETAILS
                                ================================================= */}

                                {selectedSubjectData && (

                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                        <div className="rounded-xl bg-slate-50 p-4">

                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                Subject Code
                                            </p>

                                            <p className="mt-1 font-bold text-slate-800">
                                                {
                                                    getSubjectCode(
                                                        selectedSubjectData
                                                    )
                                                }
                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-slate-50 p-4">

                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                Current Marks
                                            </p>

                                            <p className="mt-1 font-bold text-slate-800">

                                                {
                                                    getMarks(
                                                        selectedSubjectData
                                                    )
                                                }

                                                <span className="ml-1 text-xs font-medium text-slate-400">
                                                    /100
                                                </span>

                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-slate-50 p-4">

                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                Current Grade
                                            </p>

                                            <p className="mt-1 font-bold text-indigo-600">
                                                {
                                                    getGrade(
                                                        selectedSubjectData
                                                    )
                                                }
                                            </p>

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                    REASON
                                ================================================= */}

                                <div className="mt-5">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Reason
                                        <span className="ml-1 text-red-500">*</span>
                                    </label>

                                    <textarea
                                        value={reason}
                                        onChange={(e) =>
                                            setReason(
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        placeholder="Enter your reason for requesting rechecking..."
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>


                                {/* =================================================
                                    SUBMIT
                                ================================================= */}

                                <div className="mt-5 flex justify-end">

                                    <button
                                        type="submit"
                                        disabled={
                                            submitting ||
                                            !selectedSubjectData
                                        }
                                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {submitting ? (

                                            <Loader2 className="h-4 w-4 animate-spin" />

                                        ) : (

                                            <Send className="h-4 w-4" />

                                        )}

                                        {submitting
                                            ? "Submitting..."
                                            : "Submit Rechecking Request"}

                                    </button>

                                </div>

                            </form>

                        </section>


                        {/* =================================================
                            REQUEST HISTORY
                        ================================================= */}

                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">

                                        <CalendarDays className="h-5 w-5 text-violet-600" />

                                    </div>

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            My Rechecking Requests
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Track your submitted rechecking requests.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="overflow-x-auto">

                                {requests.length > 0 ? (

                                    <table className="w-full min-w-[700px]">

                                        <thead>

                                            <tr className="border-b border-slate-100 bg-slate-50">

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                    SUBJECT
                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                    SEMESTER
                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                    MARKS
                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                    DATE
                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                    STATUS
                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400">
                                                    ACTION
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>
                                            {requests.map((request, index) => {

                                                const status = getStatusConfig(
                                                    request?.status
                                                );

                                                const StatusIcon = status.icon;

                                                const cancelAllowed =
                                                    canCancelRequest(request);

                                                const remainingMinutes =
                                                    getRemainingMinutes(
                                                        request?.appliedAt
                                                    );

                                                const subjects =
                                                    Array.isArray(request?.subjects)
                                                        ? request.subjects
                                                        : [];

                                                return (
                                                    <tr
                                                        key={request?.id || index}
                                                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                                    >

                                                        {/* SUBJECT */}

                                                        <td className="px-5 py-4">

                                                            {subjects.length > 0 ? (

                                                                <div className="space-y-2">

                                                                    {subjects.map((subject, subjectIndex) => (

                                                                        <div key={
                                                                            subject?.id ||
                                                                            subject?.resultSubjectId ||
                                                                            subjectIndex
                                                                        }>

                                                                            <p className="font-semibold text-slate-700">
                                                                                {subject?.subjectName || "-"}
                                                                            </p>

                                                                            <p className="mt-1 text-xs text-slate-400">
                                                                                {subject?.subjectCode || "-"}
                                                                            </p>

                                                                        </div>

                                                                    ))}

                                                                </div>

                                                            ) : (
                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>
                                                            )}

                                                        </td>


                                                        {/* SEMESTER */}

                                                        <td className="px-5 py-4 text-sm text-slate-600">
                                                            {request?.semesterName || "-"}
                                                        </td>


                                                        {/* MARKS */}

                                                        <td className="px-5 py-4">

                                                            {subjects.length > 0 ? (

                                                                <div className="space-y-2">

                                                                    {subjects.map((subject, subjectIndex) => (

                                                                        <div
                                                                            key={
                                                                                subject?.id ||
                                                                                subject?.resultSubjectId ||
                                                                                subjectIndex
                                                                            }
                                                                            className="text-sm font-semibold text-slate-700"
                                                                        >
                                                                            {subject?.oldMarks ?? "-"}
                                                                            <span className="ml-1 text-xs font-normal text-slate-400">
                                                                                /100
                                                                            </span>
                                                                        </div>

                                                                    ))}

                                                                </div>

                                                            ) : (
                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>
                                                            )}

                                                        </td>


                                                        {/* DATE */}

                                                        <td className="px-5 py-4 text-sm text-slate-500">

                                                            {request?.appliedAt
                                                                ? new Date(
                                                                    request.appliedAt
                                                                ).toLocaleString()
                                                                : "-"}

                                                        </td>


                                                        {/* STATUS */}

                                                        <td className="px-5 py-4">

                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${status.className}`}
                                                            >

                                                                <StatusIcon className="h-3.5 w-3.5" />

                                                                {status.label}

                                                            </span>

                                                        </td>


                                                        {/* ACTION */}

                                                        <td className="px-5 py-4">

                                                            {cancelAllowed ? (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCancelRequest(request)
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                                                >

                                                                    <XCircle className="h-3.5 w-3.5" />

                                                                    Cancel

                                                                    <span className="text-[10px] text-red-400">
                                                                        ({remainingMinutes}m)
                                                                    </span>

                                                                </button>

                                                            ) : (

                                                                <span className="text-xs text-slate-400">
                                                                    Not available
                                                                </span>

                                                            )}

                                                        </td>

                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                    </table>

                                ) : (

                                    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">

                                            <FileCheck2 className="h-7 w-7 text-slate-300" />

                                        </div>

                                        <h3 className="mt-4 font-bold text-slate-700">
                                            No Rechecking Requests
                                        </h3>

                                        <p className="mt-1 max-w-md text-sm text-slate-400">
                                            You haven't submitted any rechecking requests yet.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* =================================================
                            INFORMATION
                        ================================================= */}

                        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />

                            <div>

                                <p className="text-sm font-semibold text-blue-800">
                                    Rechecking Information
                                </p>

                                <p className="mt-1 text-xs leading-5 text-blue-600">
                                    Select the correct semester and subject before
                                    submitting your request. Your request will be
                                    processed according to the university's rechecking
                                    procedure.
                                </p>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

            {/* =========================================================
    CANCEL RECHECKING MODAL
========================================================= */}

            <ConfirmModal
                open={cancelModalOpen}
                title="Cancel Rechecking Request"
                message="Are you sure you want to cancel this rechecking request?"
                confirmText="Yes, Cancel Request"
                cancelText="Keep Request"
                onConfirm={confirmCancelRequest}
                onCancel={() => {
                    if (!cancelLoading) {
                        setCancelModalOpen(false);
                        setSelectedCancelRequest(null);
                    }
                }}
                loading={cancelLoading}
                variant="danger"
            >
                {selectedCancelRequest && (
                    <div className="rounded-xl bg-slate-50 p-4">

                        {selectedCancelRequest?.subjects?.map(
                            (subject, index) => (

                                <div
                                    key={
                                        subject?.id ||
                                        subject?.resultSubjectId ||
                                        index
                                    }
                                    className={
                                        index > 0
                                            ? "mt-3 border-t border-slate-200 pt-3"
                                            : ""
                                    }
                                >

                                    <p className="text-sm font-semibold text-slate-800">
                                        {subject?.subjectName || "-"}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {subject?.subjectCode || "-"}
                                    </p>

                                    <div className="mt-2 flex justify-between text-xs">

                                        <span className="text-slate-500">
                                            Current Marks
                                        </span>

                                        <span className="font-semibold text-slate-700">
                                            {subject?.oldMarks ?? "-"} / 100
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2">

                            <p className="text-xs leading-5 text-red-600">
                                This request can only be cancelled within
                                10 minutes of submission.
                            </p>

                        </div>

                    </div>
                )}
            </ConfirmModal>

        </div>

    );

};

export default Rechecking;