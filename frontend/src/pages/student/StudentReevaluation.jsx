import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    RefreshCw,
    BookOpen,
    CheckCircle2,
    Clock3,
    XCircle,
    Send,
    AlertCircle,
} from "lucide-react";

import studentService from "../../services/studentService";

import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";


const StudentReevaluation = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [results, setResults] = useState([]);
    const [requests, setRequests] = useState([]);

    const [examType, setExamType] = useState("REGULAR");
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingResults, setLoadingResults] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(false);

    const [dashboard, setDashboard] = useState(null);
    const [profile, setProfile] = useState(null);

    // =====================================================
    // SIDEBAR
    // =====================================================

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadResults();
        loadRequests();
        loadDashboard();

        const handleNotificationReceived = (event) => {

            const notification = event.detail;

            console.log(
                "Reevaluation page received notification:",
                notification
            );

            if (
                notification?.type === "REEVALUATION_COMPLETED" ||
                notification?.type === "RESULT_UPDATED" ||
                notification?.type === "REEVALUATION_APPROVED" ||
                notification?.type === "REEVALUATION_REJECTED"
            ) {
                loadRequests();
                loadResults();
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

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async () => {
        try {

            const response =
                await studentService.getDashboard();

            console.log(
                "Student Dashboard:",
                response
            );

            if (response?.success) {
                setDashboard(response.data);
            }

        } catch (error) {

            console.error(
                "Student Dashboard Error:",
                error
            );

        }
    };

    // =====================================================
    // LOAD RESULTS
    // =====================================================

    const loadResults = async () => {
        try {
            setLoadingResults(true);

            const response = await studentService.getResults();

            console.log("Student Results API:", response);

            const data =
                response?.data ||
                response?.result ||
                [];

            console.log("Normalized Results:", data);

            // API returns semester-wise results.
            // We need to extract all subjects from every semester.
            const subjects = Array.isArray(data)
                ? data.flatMap((semester) =>
                    Array.isArray(semester?.subjects)
                        ? semester.subjects.map((subject) => ({
                            ...subject,

                            // Keep semester information
                            semesterId: semester.semesterId,
                            semesterName: semester.semesterName,

                            // Keep student information if needed
                            studentId: semester.studentId,
                            studentName: semester.studentName,

                            // Keep course information
                            courseId: semester.courseId,
                            courseName: semester.courseName,
                        }))
                        : []
                )
                : [];

            console.log("Normalized Subjects:", subjects);

            setResults(subjects);

        } catch (error) {
            console.error(
                "Failed to load results:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load student results."
            );

        } finally {
            setLoadingResults(false);
        }
    };

    // =====================================================
    // LOAD REEVALUATION REQUESTS
    // =====================================================

    const loadRequests = async () => {

        try {

            setLoadingRequests(true);

            const response =
                await studentService.getReevaluationRequests();

            console.log(
                "Student Reevaluation Requests:",
                response
            );

            const data =
                response?.data || [];

            setRequests(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load reevaluation requests:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load reevaluation requests."
            );

        } finally {

            setLoadingRequests(false);

        }
    };

    // =====================================================
    // GET SUBJECT OBJECT
    // =====================================================
    // Handles different possible backend structures.
    // =====================================================

    const getSubjectObject = (item) => {

        return (
            item?.subject ||
            item?.resultSubject?.subject ||
            item?.resultSubject ||
            item
        );
    };

    // =====================================================
    // GET SUBJECT ID
    // =====================================================

    const getSubjectId = (item) => {
        return (
            item?.resultSubjectId ??
            item?.resultSubject?.id ??
            item?.resultSubject?.resultSubjectId ??
            item?.subjectResultId ??
            item?.id ??
            item?.subject?.id ??
            null
        );
    };

    // =====================================================
    // GET SUBJECT NAME
    // =====================================================

    const getSubjectName = (item) => {
        const subject =
            item?.subject ||
            item?.resultSubject?.subject ||
            item?.resultSubject ||
            item?.subjectDetails ||
            item?.subjectInfo ||
            item;

        return (
            item?.subjectName ||
            item?.name ||
            item?.title ||

            item?.subject?.subjectName ||
            item?.subject?.name ||
            item?.subject?.title ||

            item?.resultSubject?.subjectName ||
            item?.resultSubject?.name ||
            item?.resultSubject?.title ||

            item?.resultSubject?.subject?.subjectName ||
            item?.resultSubject?.subject?.name ||
            item?.resultSubject?.subject?.title ||

            item?.subjectDetails?.subjectName ||
            item?.subjectDetails?.name ||
            item?.subjectInfo?.subjectName ||
            item?.subjectInfo?.name ||

            subject?.subjectName ||
            subject?.name ||
            subject?.title ||

            null
        );
    };

    // =====================================================
    // GET SUBJECT CODE
    // =====================================================

    const getSubjectCode = (item) => {
        return item?.subjectCode || "";
    };



    // =====================================================
    // GET MARKS
    // =====================================================

    const getMarks = (item) => {

        return (
            item?.obtainedMarks ??
            item?.oldMarks ??
            item?.marks ??
            item?.externalMarks ??
            item?.resultSubject?.obtainedMarks ??
            item?.resultSubject?.oldMarks ??
            "-"
        );
    };

    // =====================================================
    // SUBJECT SELECTION
    // =====================================================

    const toggleSubject = (subjectId) => {

        setSelectedSubjects((previous) => {

            if (previous.includes(subjectId)) {

                return previous.filter(
                    (id) => id !== subjectId
                );

            }

            return [
                ...previous,
                subjectId
            ];

        });

    };

    // =====================================================
    // SUBMIT REEVALUATION
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (selectedSubjects.length === 0) {

            toast.warning(
                "Please select at least one subject."
            );

            return;
        }

        if (!reason.trim()) {

            toast.warning(
                "Please enter a reason."
            );

            return;
        }

        try {

            setLoading(true);

            const request = {

                examType,

                resultSubjectIds:
                    selectedSubjects,

                reason:
                    reason.trim(),

            };

            console.log(
                "Submitting Reevaluation:",
                request
            );

            await studentService.submitReevaluation(
                request
            );

            toast.success(
                "Reevaluation request submitted successfully."
            );

            setSelectedSubjects([]);
            setReason("");

            await loadRequests();

        } catch (error) {

            console.error(
                "Reevaluation submission failed:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to submit reevaluation request."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this reevaluation request?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await studentService.cancelReevaluation(
                id
            );

            toast.success(
                "Reevaluation request cancelled successfully."
            );

            await loadRequests();

        } catch (error) {

            console.error(
                "Cancel reevaluation failed:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to cancel reevaluation request."
            );

        }
    };

    // =====================================================
    // STATUS BADGE
    // =====================================================

    const getStatusBadge = (status) => {

        const normalized =
            String(status || "")
                .toUpperCase();

        if (normalized === "PENDING") {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-amber-50
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-amber-700
                    "
                >
                    <Clock3 size={13} />
                    Pending
                </span>
            );
        }

        if (normalized === "APPROVED") {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-emerald-50
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-emerald-700
                    "
                >
                    <CheckCircle2 size={13} />
                    Approved
                </span>
            );
        }

        if (normalized === "COMPLETED") {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-blue-700
                    "
                >
                    <CheckCircle2 size={13} />
                    Completed
                </span>
            );
        }

        if (normalized === "REJECTED") {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-red-50
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-red-700
                    "
                >
                    <XCircle size={13} />
                    Rejected
                </span>
            );
        }

        if (normalized === "CANCELLED") {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-slate-600
                    "
                >
                    <XCircle size={13} />
                    Cancelled
                </span>
            );
        }

        return (
            <span
                className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-slate-600
                "
            >
                {status || "Unknown"}
            </span>
        );
    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                STUDENT SIDEBAR
            ================================================= */}

            <StudentSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
            />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div
                className={`
            min-h-screen
            transition-all
            duration-300
            ${sidebarCollapsed
                        ? "lg:ml-20"
                        : "lg:ml-72"
                    }
        `}
            >

                {/* =================================================
                    STUDENT TOPBAR
                ================================================= */}

                <div className="m-0 p-0">

                    <StudentTopbar
                        onMenuClick={() =>
                            setSidebarOpen(true)
                        }
                        onSidebarToggle={() =>
                            setSidebarCollapsed(
                                (previous) => !previous
                            )
                        }
                        sidebarCollapsed={
                            sidebarCollapsed
                        }
                        dashboardData={dashboard}
                        title="Reevaluation"
                    />

                </div>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <main
                    className="
        w-full
        px-4
        pb-6
        pt-20
        sm:px-6
        lg:px-8
    "
                >

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div
                        className="
                            mb-6
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-indigo-100
                                        text-indigo-600
                                    "
                                >
                                    <RefreshCw
                                        className="h-5 w-5"
                                    />
                                </div>

                                <div>

                                    <h1
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        Reevaluation
                                    </h1>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        Apply for reevaluation
                                        of your examination
                                        subjects.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                loadResults();
                                loadRequests();
                            }}
                            disabled={
                                loadingResults ||
                                loadingRequests
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-indigo-600
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    loadingResults ||
                                        loadingRequests
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>


                    {/* =================================================
                        APPLICATION CARD
                    ================================================= */}

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >

                        {/* CARD HEADER */}

                        <div
                            className="
                                border-b
                                border-slate-200
                                px-5
                                py-5
                                sm:px-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-indigo-50
                                        text-indigo-600
                                    "
                                >
                                    <Send
                                        size={18}
                                    />
                                </div>

                                <div>

                                    <h2
                                        className="
                                            text-lg
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        Apply for Reevaluation
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        Select the subjects
                                        you want to send for
                                        reevaluation.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                p-5
                                sm:p-6
                            "
                        >

                            {/* =================================================
                                EXAM TYPE
                            ================================================= */}

                            <div className="mb-6">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Exam Type
                                </label>

                                <select
                                    value={examType}
                                    onChange={(e) =>
                                        setExamType(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        focus:border-indigo-500
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        sm:max-w-sm
                                    "
                                >

                                    <option value="REGULAR">
                                        Regular
                                    </option>

                                    <option value="ATKT">
                                        ATKT
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                SUBJECTS
                            ================================================= */}

                            <div className="mb-6">

                                <div
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <label
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Select Subjects
                                    </label>

                                    {selectedSubjects.length >
                                        0 && (

                                            <span
                                                className="
                                                rounded-full
                                                bg-indigo-50
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-indigo-600
                                            "
                                            >
                                                {
                                                    selectedSubjects.length
                                                }{" "}
                                                selected
                                            </span>

                                        )}

                                </div>


                                {/* LOADING */}

                                {loadingResults ? (

                                    <div
                                        className="
                                            flex
                                            min-h-[160px]
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                        "
                                    >

                                        <div className="text-center">

                                            <RefreshCw
                                                className="
                                                    mx-auto
                                                    mb-2
                                                    h-6
                                                    w-6
                                                    animate-spin
                                                    text-indigo-600
                                                "
                                            />

                                            <p
                                                className="
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >
                                                Loading subjects...
                                            </p>

                                        </div>

                                    </div>

                                ) : results.length ===
                                    0 ? (

                                    <div
                                        className="
                                            flex
                                            min-h-[160px]
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-dashed
                                            border-slate-300
                                            bg-slate-50
                                            px-6
                                            text-center
                                        "
                                    >

                                        <BookOpen
                                            className="
                                                mb-3
                                                h-7
                                                w-7
                                                text-slate-400
                                            "
                                        />

                                        <p
                                            className="
                                                text-sm
                                                font-medium
                                                text-slate-600
                                            "
                                        >
                                            No result subjects
                                            available.
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            You need an available
                                            result before applying
                                            for reevaluation.
                                        </p>

                                    </div>

                                ) : (

                                    <div
                                        className="
                                            grid
                                            grid-cols-1
                                            gap-3
                                            lg:grid-cols-2
                                        "
                                    >

                                        {results.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const subjectId =
                                                    getSubjectId(
                                                        item
                                                    );

                                                const subjectName =
                                                    getSubjectName(
                                                        item
                                                    );

                                                const subjectCode =
                                                    getSubjectCode(
                                                        item
                                                    );

                                                const marks =
                                                    getMarks(
                                                        item
                                                    );

                                                const selected =
                                                    selectedSubjects.includes(
                                                        subjectId
                                                    );

                                                return (

                                                    <label
                                                        key={
                                                            subjectId ||
                                                            index
                                                        }
                                                        className={`
                                                            flex
                                                            cursor-pointer
                                                            items-center
                                                            justify-between
                                                            gap-4
                                                            rounded-xl
                                                            border
                                                            p-4
                                                            transition

                                                            ${selected
                                                                ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-100"
                                                                : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                                                            }
                                                        `}
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                min-w-0
                                                                items-center
                                                                gap-3
                                                            "
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    selected
                                                                }
                                                                onChange={() =>
                                                                    toggleSubject(
                                                                        subjectId
                                                                    )
                                                                }
                                                                className="
                                                                    h-4
                                                                    w-4
                                                                    shrink-0
                                                                    accent-indigo-600
                                                                "
                                                            />

                                                            <div
                                                                className="
                                                                    min-w-0
                                                                "
                                                            >

                                                                <p
                                                                    className="
                                                                        truncate
                                                                        text-sm
                                                                        font-semibold
                                                                        text-slate-800
                                                                    "
                                                                >
                                                                    {
                                                                        subjectName ||
                                                                        "Subject Name Not Available"
                                                                    }
                                                                </p>

                                                                {subjectCode && (

                                                                    <p
                                                                        className="
                                                                            mt-1
                                                                            text-xs
                                                                            font-medium
                                                                            text-indigo-600
                                                                        "
                                                                    >
                                                                        {
                                                                            subjectCode
                                                                        }
                                                                    </p>

                                                                )}

                                                            </div>

                                                        </div>


                                                        <div
                                                            className="
                                                                shrink-0
                                                                text-right
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-slate-400
                                                                "
                                                            >
                                                                Current
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    text-sm
                                                                    font-bold
                                                                    text-slate-700
                                                                "
                                                            >
                                                                {marks}

                                                                <span
                                                                    className="
        ml-1
        text-xs
        font-medium
        text-slate-400
    "
                                                                >
                                                                    / {item?.totalMarks ?? 100}
                                                                </span>
                                                            </p>

                                                        </div>

                                                    </label>

                                                );

                                            }
                                        )}

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                REASON
                            ================================================= */}

                            <div className="mb-6">

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <label
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Reason
                                    </label>

                                    <span
                                        className="
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        {reason.length}/500
                                    </span>

                                </div>

                                <textarea
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(
                                            e.target.value
                                        )
                                    }
                                    maxLength={500}
                                    rows={4}
                                    placeholder="Enter your reason for requesting reevaluation..."
                                    className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-indigo-500
                                        focus:ring-2
                                        focus:ring-indigo-100
                                    "
                                />

                            </div>


                            {/* =================================================
                                INFO
                            ================================================= */}

                            <div
                                className="
                                    mb-5
                                    flex
                                    gap-3
                                    rounded-xl
                                    border
                                    border-indigo-100
                                    bg-indigo-50
                                    p-4
                                "
                            >

                                <AlertCircle
                                    className="
                                        mt-0.5
                                        h-5
                                        w-5
                                        shrink-0
                                        text-indigo-600
                                    "
                                />

                                <p
                                    className="
                                        text-xs
                                        leading-5
                                        text-indigo-700
                                    "
                                >
                                    Select one or more subjects
                                    and provide a clear reason
                                    before submitting your
                                    reevaluation request.
                                </p>

                            </div>


                            {/* =================================================
                                SUBMIT
                            ================================================= */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    inline-flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-indigo-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-indigo-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:w-auto
                                "
                            >

                                {loading ? (

                                    <>
                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Submitting...
                                    </>

                                ) : (

                                    <>
                                        <Send size={16} />

                                        Submit Reevaluation
                                    </>

                                )}

                            </button>

                        </form>

                    </div>


                    {/* =================================================
                        MY REQUESTS
                    ================================================= */}

                    <div
                        className="
                            mt-6
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >

                        {/* HEADER */}

                        <div
                            className="
                                border-b
                                border-slate-200
                                px-5
                                py-5
                                sm:px-6
                            "
                        >

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                "
                            >
                                My Reevaluation Requests
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                            "
                            >
                                Track the status of your
                                submitted requests.
                            </p>

                        </div>


                        {/* REQUESTS */}

                        <div className="p-5 sm:p-6">

                            {loadingRequests ? (

                                <div
                                    className="
                                        flex
                                        min-h-[180px]
                                        items-center
                                        justify-center
                                    "
                                >

                                    <div className="text-center">

                                        <RefreshCw
                                            className="
                                                mx-auto
                                                mb-2
                                                h-6
                                                w-6
                                                animate-spin
                                                text-indigo-600
                                            "
                                        />

                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            Loading requests...
                                        </p>

                                    </div>

                                </div>

                            ) : requests.length ===
                                0 ? (

                                <div
                                    className="
                                        flex
                                        min-h-[180px]
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-dashed
                                        border-slate-300
                                        bg-slate-50
                                        text-center
                                    "
                                >

                                    <RefreshCw
                                        className="
                                            mb-3
                                            h-7
                                            w-7
                                            text-slate-400
                                        "
                                    />

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-600
                                        "
                                    >
                                        No reevaluation requests
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Your submitted requests
                                        will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {requests.map(
                                        (request) => (

                                            <div
                                                key={
                                                    request.id
                                                }
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-slate-200
                                                    bg-white
                                                    p-4
                                                    transition
                                                    hover:shadow-sm
                                                    sm:p-5
                                                "
                                            >

                                                {/* REQUEST HEADER */}

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-3
                                                        sm:flex-row
                                                        sm:items-center
                                                        sm:justify-between
                                                    "
                                                >

                                                    <div>

                                                        <h3
                                                            className="
                                                                text-sm
                                                                font-bold
                                                                text-slate-800
                                                            "
                                                        >
                                                            Reevaluation
                                                            Request #
                                                            {
                                                                request.id
                                                            }
                                                        </h3>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-slate-500
                                                            "
                                                        >
                                                            {
                                                                request.examType ||
                                                                "REGULAR"
                                                            }
                                                        </p>

                                                    </div>

                                                    <div>
                                                        {
                                                            getStatusBadge(
                                                                request.status
                                                            )
                                                        }
                                                    </div>

                                                </div>


                                                {/* REASON */}

                                                {request.reason && (

                                                    <div
                                                        className="
                                                            mt-4
                                                            rounded-xl
                                                            bg-slate-50
                                                            p-4
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                mb-1
                                                                text-[11px]
                                                                font-bold
                                                                uppercase
                                                                tracking-wide
                                                                text-slate-400
                                                            "
                                                        >
                                                            Reason
                                                        </p>

                                                        <p
                                                            className="
                                                                text-sm
                                                                leading-6
                                                                text-slate-600
                                                            "
                                                        >
                                                            {
                                                                request.reason
                                                            }
                                                        </p>

                                                    </div>

                                                )}


                                                {/* SUBJECTS */}

                                                {request.subjects &&
                                                    request.subjects.length >
                                                    0 && (

                                                        <div className="mt-4">

                                                            <p
                                                                className="
                                                                    mb-2
                                                                    text-xs
                                                                    font-semibold
                                                                    text-slate-500
                                                                "
                                                            >
                                                                Requested
                                                                Subjects
                                                            </p>

                                                            <div className="space-y-2">

                                                                {request.subjects.map(
                                                                    (
                                                                        subject,
                                                                        subjectIndex
                                                                    ) => {

                                                                        const name =
                                                                            subject?.subjectName ||
                                                                            subject?.resultSubject?.subjectName ||
                                                                            subject?.resultSubject?.subject?.subjectName ||
                                                                            subject?.subject?.subjectName ||
                                                                            subject?.name;

                                                                        const code =
                                                                            subject?.subjectCode ||
                                                                            subject?.resultSubject?.subjectCode ||
                                                                            subject?.resultSubject?.subject?.subjectCode ||
                                                                            subject?.subject?.subjectCode;

                                                                        return (

                                                                            <div
                                                                                key={
                                                                                    subject?.id ||
                                                                                    subjectIndex
                                                                                }
                                                                                className="
                                                                                    flex
                                                                                    flex-col
                                                                                    gap-2
                                                                                    rounded-xl
                                                                                    border
                                                                                    border-slate-200
                                                                                    bg-slate-50
                                                                                    p-3
                                                                                    sm:flex-row
                                                                                    sm:items-center
                                                                                    sm:justify-between
                                                                                "
                                                                            >

                                                                                <div
                                                                                    className="
                                                                                        flex
                                                                                        min-w-0
                                                                                        items-center
                                                                                        gap-3
                                                                                    "
                                                                                >

                                                                                    <div
                                                                                        className="
                                                                                            flex
                                                                                            h-9
                                                                                            w-9
                                                                                            shrink-0
                                                                                            items-center
                                                                                            justify-center
                                                                                            rounded-lg
                                                                                            bg-indigo-100
                                                                                            text-indigo-600
                                                                                        "
                                                                                    >
                                                                                        <BookOpen
                                                                                            size={16}
                                                                                        />
                                                                                    </div>

                                                                                    <div
                                                                                        className="
                                                                                            min-w-0
                                                                                        "
                                                                                    >

                                                                                        <p
                                                                                            className="
                                                                                                truncate
                                                                                                text-sm
                                                                                                font-semibold
                                                                                                text-slate-800
                                                                                            "
                                                                                        >
                                                                                            {
                                                                                                name ||
                                                                                                "Subject Name Not Available"
                                                                                            }
                                                                                        </p>

                                                                                        {code && (

                                                                                            <p
                                                                                                className="
                                                                                                    mt-0.5
                                                                                                    text-xs
                                                                                                    font-medium
                                                                                                    text-indigo-600
                                                                                                "
                                                                                            >
                                                                                                {
                                                                                                    code
                                                                                                }
                                                                                            </p>

                                                                                        )}

                                                                                    </div>

                                                                                </div>


                                                                                <div
                                                                                    className="
        flex
        flex-wrap
        items-center
        justify-end
        gap-4
    "
                                                                                >
                                                                                    {/* OLD MARKS */}
                                                                                    <div className="text-right">
                                                                                        <p
                                                                                            className="
                text-[11px]
                text-slate-400
            "
                                                                                        >
                                                                                            Old Marks
                                                                                        </p>

                                                                                        <p
                                                                                            className="
                text-sm
                font-bold
                text-slate-700
            "
                                                                                        >
                                                                                            {subject?.oldMarks ?? "-"}
                                                                                        </p>
                                                                                    </div>

                                                                                    {/* NEW MARKS */}
                                                                                    <div className="text-right">
                                                                                        <p
                                                                                            className="
                text-[11px]
                text-slate-400
            "
                                                                                        >
                                                                                            Updated Marks
                                                                                        </p>

                                                                                        <p
                                                                                            className="
                text-sm
                font-bold
                text-emerald-600
            "
                                                                                        >
                                                                                            {subject?.newMarks ?? "-"}
                                                                                        </p>
                                                                                    </div>

                                                                                    {/* STATUS */}
                                                                                    <div>
                                                                                        {getStatusBadge(subject?.status)}
                                                                                    </div>
                                                                                </div>

                                                                            </div>

                                                                        );

                                                                    }
                                                                )}

                                                            </div>

                                                        </div>

                                                    )}


                                                {/* CANCEL */}

                                                {/* CANCEL REQUEST */}

                                                {["PENDING"].includes(
                                                    String(request.status || "").toUpperCase()
                                                ) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCancel(request.id)}
                                                            className="
            mt-4
            rounded-xl
            border
            border-red-200
            px-4
            py-2.5
            text-sm
            font-semibold
            text-red-600
            transition
            hover:bg-red-50
        "
                                                        >
                                                            Cancel Request
                                                        </button>
                                                    )}

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default StudentReevaluation;