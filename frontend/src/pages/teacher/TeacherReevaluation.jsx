import React, { useEffect, useState } from "react";

import {
    FiRefreshCw,
    FiCheck,
    FiX,
    FiClock,
    FiTrash2,
} from "react-icons/fi";

import { toast } from "react-toastify";

import teacherService from "../../services/teacherService";

import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";


const TeacherReevaluation = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [reevaluationRequests, setReevaluationRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [processingId, setProcessingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [dashboard, setDashboard] =
        useState(null);

    // =====================================================
    // SIDEBAR
    // =====================================================

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const [sidebarOpen, setSidebarOpen] =
        useState(true);

    // =====================================================
    // REVIEW MODAL
    // =====================================================

    const [selectedRequest, setSelectedRequest] =
        useState(null);

    const [showReviewModal, setShowReviewModal] =
        useState(false);

    // =====================================================
    // COMPLETE MODAL
    // =====================================================

    const [showCompleteModal, setShowCompleteModal] =
        useState(false);

    const [reviewResult, setReviewResult] =
        useState("");

    const [newMarks, setNewMarks] =
        useState("");

    const [teacherMessage, setTeacherMessage] =
        useState("");


    const [marksIncreased, setMarksIncreased] = useState(false);

    // =====================================================
    // DELETE MODAL
    // =====================================================

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteRequest, setDeleteRequest] =
        useState(null);


    // =====================================================
    // FETCH REEVALUATION REQUESTS
    // =====================================================

    const fetchReevaluationRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await teacherService.getReevaluationRequests();

            console.log(
                "Teacher Reevaluation Response:",
                response
            );

            if (response?.success) {

                setReevaluationRequests(
                    response.data || []
                );

            } else {

                setError(
                    response?.message ||
                    "Failed to fetch reevaluation requests."
                );

            }

        } catch (err) {

            console.error(
                "Reevaluation API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load reevaluation requests."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FETCH DASHBOARD
    // =====================================================

    const fetchDashboard = async () => {

        try {

            const response =
                await teacherService.getDashboard();

            console.log(
                "Teacher Dashboard Response:",
                response
            );

            if (response?.success) {

                setDashboard(
                    response.data
                );

            }

        } catch (err) {

            console.error(
                "Teacher Dashboard Error:",
                err
            );

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchReevaluationRequests();

        fetchDashboard();

    }, []);


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async () => {

        if (!deleteRequest?.id) {

            toast.error(
                "Invalid reevaluation request."
            );

            return;
        }

        try {

            setProcessingId(
                deleteRequest.id
            );

            /*
             * If your backend provides a teacher
             * delete reevaluation API, this method
             * should exist in teacherService.
             */

            const response =
                await teacherService.deleteReevaluationRequest(
                    deleteRequest.id
                );

            if (response?.success) {

                toast.success(
                    response.message ||
                    "Reevaluation request deleted successfully."
                );

                setReevaluationRequests(
                    (prev) =>
                        prev.filter(
                            (item) =>
                                item.id !==
                                deleteRequest.id
                        )
                );

                setShowDeleteModal(false);

                setDeleteRequest(null);

            } else {

                toast.error(
                    response?.message ||
                    "Unable to delete request."
                );

            }

        } catch (err) {

            console.error(
                "Delete Reevaluation Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Failed to delete reevaluation request."
            );

        } finally {

            setProcessingId(null);

        }

    };


    // =====================================================
    // REVIEW
    // =====================================================

    const handleReview = async (approved) => {
        if (!selectedRequest) {
            return;
        }

        try {
            setProcessingId(selectedRequest.id);

            const reviewStatus = approved
                ? "APPROVED"
                : "REJECTED";

            const response =
                await teacherService.reviewReevaluation(
                    selectedRequest.id,
                    reviewStatus
                );

            console.log(
                "Review Reevaluation Response:",
                response
            );

            if (response?.success) {
                // Close Review modal
                setShowReviewModal(false);

                if (approved) {
                    // Keep the approved request for Complete modal
                    setSelectedRequest(
                        response.data || selectedRequest
                    );

                    // Reset completion fields
                    setReviewResult("");
                    setNewMarks("");
                    setTeacherMessage("");

                    // Open Complete Reevaluation modal
                    setShowCompleteModal(true);
                    setMarksIncreased(false);
                } else {
                    // Rejected
                    setSelectedRequest(null);

                    await fetchReevaluationRequests();

                    toast.success(
                        response.message ||
                        "Reevaluation request rejected."
                    );
                }
            } else {
                toast.error(
                    response?.message ||
                    "Unable to review request."
                );
            }
        } catch (err) {
            console.error(
                "Review Reevaluation Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Failed to review reevaluation request."
            );
        } finally {
            setProcessingId(null);
        }
    };


    // =====================================================
    // COMPLETE REEVALUATION
    // =====================================================

    const handleComplete = async () => {

        if (!selectedRequest) {
            return;
        }


        // -------------------------------------------------
        // REVIEW RESULT
        // -------------------------------------------------

        if (!reviewResult) {

            toast.error(
                "Please select the review result."
            );

            return;
        }


        // -------------------------------------------------
        // TEACHER MESSAGE
        // -------------------------------------------------

        if (!teacherMessage.trim()) {

            toast.error(
                "Please enter a teacher message."
            );

            return;
        }


        let marks;


        // -------------------------------------------------
        // MARKS INCREASED
        // -------------------------------------------------

        if (
            reviewResult ===
            "MARKS_INCREASED"
        ) {

            if (
                newMarks === "" ||
                newMarks === null ||
                newMarks === undefined
            ) {

                toast.error(
                    "Please enter new marks."
                );

                return;
            }


            marks =
                Number(newMarks);


            if (
                Number.isNaN(marks) ||
                marks < 0 ||
                marks > 60
            ) {

                toast.error(
                    "Marks must be between 0 and 60."
                );

                return;
            }


            if (
                marks <=
                Number(
                    selectedRequest.oldMarks
                )
            ) {

                toast.error(
                    "New marks must be greater than old marks."
                );

                return;
            }

        }

        // -------------------------------------------------
        // NO CHANGE
        // -------------------------------------------------

        else {

            marks =
                Number(
                    selectedRequest.oldMarks
                );

        }


        // -------------------------------------------------
        // API
        // -------------------------------------------------

        try {

            setProcessingId(
                selectedRequest.id
            );

            const response =
                await teacherService.completeReevaluation(
                    selectedRequest.id,
                    reviewResult,
                    marks
                );

            console.log(
                "Complete Reevaluation Response:",
                response
            );


            if (response?.success) {

                toast.success(
                    response.message ||
                    "Reevaluation completed successfully."
                );

                setShowCompleteModal(
                    false
                );

                setSelectedRequest(
                    null
                );

                setReviewResult("");

                setNewMarks("");

                setTeacherMessage("");

                await fetchReevaluationRequests();

            } else {

                toast.error(
                    response?.message ||
                    "Unable to complete reevaluation."
                );

            }

        } catch (err) {

            console.error(
                "Complete Reevaluation Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Failed to complete reevaluation."
            );

        } finally {

            setProcessingId(null);

        }

    };


    // =====================================================
    // STATUS BADGE
    // =====================================================

    const getStatusBadge = (
        status
    ) => {

        const normalized =
            String(status || "")
                .toUpperCase();


        if (
            normalized ===
            "PENDING"
        ) {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-amber-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-amber-700
                    "
                >
                    <FiClock />

                    Pending
                </span>
            );

        }


        if (
            normalized ===
            "APPROVED"
        ) {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-emerald-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-emerald-700
                    "
                >
                    <FiCheck />

                    Approved
                </span>
            );

        }


        if (
            normalized ===
            "REJECTED"
        ) {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-red-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-red-700
                    "
                >
                    <FiX />

                    Rejected
                </span>
            );

        }


        if (
            normalized ===
            "COMPLETED"
        ) {

            return (
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-blue-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-blue-700
                    "
                >
                    <FiCheck />

                    Completed
                </span>
            );

        }


        return (
            <span
                className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
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
    // OPEN REVIEW MODAL
    // =====================================================

    const openReviewModal = (
        request
    ) => {

        setSelectedRequest(
            request
        );

        setShowReviewModal(
            true
        );

    };


    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const openDeleteModal = (
        request
    ) => {

        setDeleteRequest(
            request
        );

        setShowDeleteModal(
            true
        );

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <TeacherSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
                collapsed={
                    sidebarCollapsed
                }
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
                        ? "lg:ml-[84px]"
                        : "lg:ml-[272px]"
                    }
                `}
            >

                {/* =================================================
                    TOPBAR
                ================================================= */}

                <TeacherTopbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    onSidebarToggle={() =>
                        setSidebarCollapsed(
                            (prev) =>
                                !prev
                        )
                    }
                    sidebarCollapsed={
                        sidebarCollapsed
                    }
                    dashboardData={
                        dashboard
                    }
                    title="Teacher Dashboard"
                />


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <main
                    className="
        w-full
        pt-[96px]
        px-6
        pb-6
        sm:px-8
        lg:px-8
    "
                >

                    {/* =================================================
                        HEADER
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
                                    mb-1
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        rounded-xl
                                        bg-indigo-100
                                        p-2
                                        text-indigo-600
                                    "
                                >
                                    <FiRefreshCw
                                        className="h-5 w-5"
                                    />
                                </div>

                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    Reevaluation Requests
                                </h1>

                            </div>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Review and manage
                                student reevaluation
                                requests.
                            </p>

                        </div>


                        {/* REFRESH */}

                        <button
                            onClick={
                                fetchReevaluationRequests
                            }
                            disabled={
                                loading
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
                                shadow-sm
                                transition
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            <FiRefreshCw
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            className="
                                mb-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            "
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        TABLE CARD
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
                                py-4
                            "
                        >

                            <h2
                                className="
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                Pending Requests
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Requests assigned to
                                you for review.
                            </p>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading ? (

                            <div
                                className="
                                    flex
                                    min-h-[300px]
                                    items-center
                                    justify-center
                                "
                            >

                                <div
                                    className="
                                        text-center
                                    "
                                >

                                    <FiRefreshCw
                                        className="
                                            mx-auto
                                            mb-3
                                            h-7
                                            w-7
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
                                        Loading reevaluation
                                        requests...
                                    </p>

                                </div>

                            </div>

                        ) : reevaluationRequests.length ===
                            0 ? (

                            /* EMPTY */

                            <div
                                className="
                                    flex
                                    min-h-[300px]
                                    flex-col
                                    items-center
                                    justify-center
                                    px-6
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        mb-4
                                        rounded-full
                                        bg-slate-100
                                        p-4
                                    "
                                >

                                    <FiRefreshCw
                                        className="
                                            h-7
                                            w-7
                                            text-slate-400
                                        "
                                    />

                                </div>

                                <h3
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    No Reevaluation Requests
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        max-w-md
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    There are currently
                                    no pending
                                    reevaluation requests
                                    assigned to you.
                                </p>

                            </div>

                        ) : (

                            /* =================================================
                               TABLE
                            ================================================= */

                            <div
                                className="
                                    overflow-x-auto
                                "
                            >

                                <table
                                    className="
                                        min-w-[1050px]
                                        w-full
                                    "
                                >

                                    <thead>

                                        <tr
                                            className="
                                                bg-slate-50
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >

                                            <th className="px-5 py-4">
                                                #
                                            </th>

                                            <th className="px-5 py-4">
                                                Subject
                                            </th>

                                            <th className="px-5 py-4">
                                                Old Marks
                                            </th>

                                            <th className="px-5 py-4">
                                                New Marks
                                            </th>

                                            <th className="px-5 py-4">
                                                Status
                                            </th>

                                            <th className="px-5 py-4">
                                                Result
                                            </th>

                                            <th className="px-5 py-4 text-center">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody
                                        className="
                                            divide-y
                                            divide-slate-100
                                        "
                                    >

                                        {reevaluationRequests.map(
                                            (
                                                request,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        request.id
                                                    }
                                                    className="
                                                        transition
                                                        hover:bg-slate-50
                                                    "
                                                >

                                                    {/* NUMBER */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                            text-sm
                                                            font-medium
                                                            text-slate-500
                                                        "
                                                    >
                                                        {index + 1}
                                                    </td>


                                                    {/* SUBJECT */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                font-semibold
                                                                text-slate-800
                                                            "
                                                        >
                                                            {
                                                                request.subjectName ||
                                                                "—"
                                                            }
                                                        </div>

                                                        <div
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-slate-500
                                                            "
                                                        >
                                                            {
                                                                request.subjectCode ||
                                                                "—"
                                                            }
                                                        </div>

                                                    </td>


                                                    {/* OLD MARKS */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                font-semibold
                                                                text-slate-700
                                                            "
                                                        >
                                                            {
                                                                request.oldMarks ??
                                                                "—"
                                                            }
                                                        </span>

                                                        <span
                                                            className="
                                                                text-xs
                                                                text-slate-400
                                                            "
                                                        >
                                                            {" "}
                                                            / 60
                                                        </span>

                                                    </td>


                                                    {/* NEW MARKS */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        {
                                                            request.newMarks !==
                                                                null &&
                                                                request.newMarks !==
                                                                undefined ? (

                                                                <span
                                                                    className="
                                                                        font-semibold
                                                                        text-emerald-600
                                                                    "
                                                                >
                                                                    {
                                                                        request.newMarks
                                                                    }
                                                                </span>

                                                            ) : (

                                                                <span
                                                                    className="
                                                                        text-slate-400
                                                                    "
                                                                >
                                                                    —
                                                                </span>

                                                            )
                                                        }

                                                    </td>


                                                    {/* STATUS */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                        "
                                                    >
                                                        {
                                                            getStatusBadge(
                                                                request.status
                                                            )
                                                        }
                                                    </td>


                                                    {/* RESULT */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                            text-sm
                                                            text-slate-600
                                                        "
                                                    >
                                                        {
                                                            request.reviewResult ||
                                                            "—"
                                                        }
                                                    </td>


                                                    {/* ACTION */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                            "
                                                        >

                                                            {/* REVIEW */}

                                                            <button
                                                                onClick={() =>
                                                                    openReviewModal(
                                                                        request
                                                                    )
                                                                }
                                                                disabled={
                                                                    request.status?.toUpperCase() !==
                                                                    "PENDING" ||
                                                                    processingId ===
                                                                    request.id
                                                                }
                                                                className="
                                                                    rounded-lg
                                                                    bg-indigo-600
                                                                    px-4
                                                                    py-2
                                                                    text-xs
                                                                    font-semibold
                                                                    text-white
                                                                    transition
                                                                    hover:bg-indigo-700
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                "
                                                            >
                                                                Review
                                                            </button>


                                                            {/* DELETE */}

                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        request
                                                                    )
                                                                }
                                                                disabled={
                                                                    processingId ===
                                                                    request.id
                                                                }
                                                                title="
                                                                    Delete request
                                                                "
                                                                className="
                                                                    inline-flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    border
                                                                    border-red-200
                                                                    text-red-600
                                                                    transition
                                                                    hover:bg-red-50
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                "
                                                            >

                                                                <FiTrash2
                                                                    className="
                                                                        h-4
                                                                        w-4
                                                                    "
                                                                />

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </main>

            </div>


            {/* =========================================================
                REVIEW MODAL
            ========================================================= */}

            {showReviewModal &&
                selectedRequest && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-slate-900/50
                            p-4
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-lg
                                rounded-2xl
                                bg-white
                                shadow-2xl
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    px-6
                                    py-5
                                "
                            >

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    Review Reevaluation Request
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Review the student's
                                    request before
                                    proceeding.
                                </p>

                            </div>


                            {/* BODY */}

                            <div
                                className="
                                    space-y-4
                                    px-6
                                    py-5
                                "
                            >

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-4
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Subject
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-semibold
                                                text-slate-800
                                            "
                                        >
                                            {
                                                selectedRequest.subjectName ||
                                                "—"
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Subject Code
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-semibold
                                                text-slate-800
                                            "
                                        >
                                            {
                                                selectedRequest.subjectCode ||
                                                "—"
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* CURRENT MARKS */}

                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-50
                                        p-4
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        Current Marks
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-2xl
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        {
                                            selectedRequest.oldMarks ??
                                            "—"
                                        }

                                        <span
                                            className="
                                                ml-1
                                                text-sm
                                                font-medium
                                                text-slate-400
                                            "
                                        >
                                            / 60
                                        </span>

                                    </p>

                                </div>


                                {/* REQUEST */}

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-200
                                        p-4
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        Student's Request
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-slate-600
                                        "
                                    >
                                        Please review the
                                        student's answer
                                        sheet and decide
                                        whether the
                                        reevaluation request
                                        should be approved.
                                    </p>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-3
                                    border-t
                                    border-slate-200
                                    px-6
                                    py-4
                                "
                            >

                                <button
                                    onClick={() => {

                                        setShowReviewModal(
                                            false
                                        );

                                        setSelectedRequest(
                                            null
                                        );

                                    }}
                                    disabled={
                                        processingId !==
                                        null
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-300
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        transition
                                        hover:bg-slate-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    onClick={() =>
                                        handleReview(
                                            false
                                        )
                                    }
                                    disabled={
                                        processingId !==
                                        null
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-red-600
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-red-700
                                        disabled:opacity-50
                                    "
                                >

                                    <FiX />

                                    Reject

                                </button>


                                <button
                                    onClick={() =>
                                        handleReview(
                                            true
                                        )
                                    }
                                    disabled={
                                        processingId !==
                                        null
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-emerald-600
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-emerald-700
                                        disabled:opacity-50
                                    "
                                >

                                    <FiCheck />

                                    Approve

                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {/* =========================================================
                COMPLETE MODAL
            ========================================================= */}

            {showCompleteModal &&
                selectedRequest && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-slate-900/50
                            p-4
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-md
                                rounded-2xl
                                bg-white
                                shadow-2xl
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    px-6
                                    py-5
                                "
                            >

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    Complete Reevaluation
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Enter the reevaluation
                                    result.
                                </p>

                            </div>


                            {/* BODY */}

                            <div
                                className="
                                    space-y-5
                                    px-6
                                    py-6
                                "
                            >

                                {/* OLD MARKS */}

                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-50
                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <span
                                            className="
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            Old Marks
                                        </span>

                                        <span
                                            className="
                                                font-bold
                                                text-slate-800
                                            "
                                        >
                                            {
                                                selectedRequest.oldMarks
                                            }{" "}
                                            / 60
                                        </span>

                                    </div>

                                </div>


                                {/* RESULT */}

                                <div>

                                    <label
                                        className="
                                            mb-3
                                            block
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Review Result
                                    </label>


                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            gap-3
                                        "
                                    >

                                        {/* MARKS INCREASED */}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReviewResult("MARKS_INCREASED");
                                                setMarksIncreased(true);
                                                setNewMarks("");
                                            }}
                                            className={`
                                                rounded-xl
                                                border
                                                px-4
                                                py-3
                                                text-sm
                                                font-semibold
                                                transition

                                                ${reviewResult ===
                                                    "MARKS_INCREASED"

                                                    ? `
                                                            border-emerald-500
                                                            bg-emerald-50
                                                            text-emerald-700
                                                            ring-2
                                                            ring-emerald-100
                                                        `

                                                    : `
                                                            border-slate-200
                                                            bg-white
                                                            text-slate-600
                                                            hover:border-emerald-300
                                                            hover:bg-emerald-50
                                                        `
                                                }
                                            `}
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                "
                                            >

                                                <FiCheck />

                                                Marks Increased

                                            </div>

                                        </button>


                                        {/* NO CHANGE */}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReviewResult("NO_CHANGE");
                                                setMarksIncreased(false);
                                                setNewMarks(
                                                    String(selectedRequest.oldMarks)
                                                );
                                            }}
                                            className={`
                                                rounded-xl
                                                border
                                                px-4
                                                py-3
                                                text-sm
                                                font-semibold
                                                transition

                                                ${reviewResult ===
                                                    "NO_CHANGE"

                                                    ? `
                                                            border-amber-500
                                                            bg-amber-50
                                                            text-amber-700
                                                            ring-2
                                                            ring-amber-100
                                                        `

                                                    : `
                                                            border-slate-200
                                                            bg-white
                                                            text-slate-600
                                                            hover:border-amber-300
                                                            hover:bg-amber-50
                                                        `
                                                }
                                            `}
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                "
                                            >

                                                <FiX />

                                                No Change

                                            </div>

                                        </button>

                                    </div>

                                </div>


                                {/* NEW MARKS */}

                                {marksIncreased && (
                                    <div>
                                        <label
                                            className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
            "
                                        >
                                            New Marks
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="60"
                                            value={newMarks}
                                            onChange={(e) => {
                                                setNewMarks(e.target.value);
                                            }}
                                            placeholder="Enter marks out of 60"
                                            className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-100
            "
                                        />

                                        <p className="mt-2 text-xs text-slate-400">
                                            New marks must be greater than old marks and
                                            cannot exceed 60.
                                        </p>
                                    </div>
                                )}


                                {/* NO CHANGE */}

                                {reviewResult ===
                                    "NO_CHANGE" && (

                                        <div
                                            className="
                                            rounded-xl
                                            border
                                            border-amber-200
                                            bg-amber-50
                                            p-4
                                        "
                                        >

                                            <p
                                                className="
                                                text-sm
                                                font-medium
                                                text-amber-800
                                            "
                                            >
                                                No marks change
                                            </p>

                                            <p
                                                className="
                                                mt-1
                                                text-xs
                                                text-amber-700
                                            "
                                            >
                                                The student's
                                                marks will remain{" "}
                                                <strong>
                                                    {
                                                        selectedRequest.oldMarks
                                                    }
                                                </strong>
                                                .
                                            </p>

                                        </div>

                                    )}


                                {/* TEACHER MESSAGE */}

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Teacher Message
                                    </label>

                                    <textarea
                                        rows={4}
                                        maxLength={1000}
                                        value={
                                            teacherMessage
                                        }
                                        onChange={(e) =>
                                            setTeacherMessage(
                                                e.target.value
                                            )
                                        }
                                        placeholder={
                                            reviewResult ===
                                                "NO_CHANGE"

                                                ? "Explain why the marks were not changed..."

                                                : "Explain why the marks were increased..."
                                        }
                                        className="
                                            w-full
                                            resize-none
                                            rounded-xl
                                            border
                                            border-slate-300
                                            px-4
                                            py-3
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-indigo-500
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                    <div
                                        className="
                                            mt-1
                                            text-right
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        {
                                            teacherMessage.length
                                        }
                                        /1000
                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-3
                                    border-t
                                    border-slate-200
                                    px-6
                                    py-4
                                "
                            >

                                <button
                                    onClick={() => {

                                        setShowCompleteModal(
                                            false
                                        );

                                        setSelectedRequest(
                                            null
                                        );

                                        setReviewResult(
                                            ""
                                        );

                                        setNewMarks(
                                            ""
                                        );

                                        setTeacherMessage(
                                            ""
                                        );

                                    }}
                                    disabled={
                                        processingId !==
                                        null
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-300
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        hover:bg-slate-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    onClick={
                                        handleComplete
                                    }
                                    disabled={
                                        processingId !==
                                        null
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-indigo-600
                                        px-5
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

                                    {processingId !==
                                        null ? (

                                        <>
                                            <FiRefreshCw
                                                className="
                                                    animate-spin
                                                "
                                            />

                                            Saving...
                                        </>

                                    ) : (

                                        <>
                                            <FiCheck />

                                            Complete
                                        </>

                                    )}

                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {/* =========================================================
                DELETE MODAL
            ========================================================= */}

            {showDeleteModal &&
                deleteRequest && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-[60]
                            flex
                            items-center
                            justify-center
                            bg-slate-900/60
                            p-4
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-md
                                overflow-hidden
                                bg-white
                                shadow-2xl
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    px-6
                                    py-5
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
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-red-100
                                            text-red-600
                                        "
                                    >

                                        <FiTrash2
                                            className="h-5 w-5"
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
                                            Delete Reevaluation Request
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            Confirm deletion
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* BODY */}

                            <div
                                className="
                                    px-6
                                    py-6
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-slate-600
                                    "
                                >
                                    Are you sure you want
                                    to delete this
                                    reevaluation request?
                                </p>


                                {/* REQUEST INFO */}

                                <div
                                    className="
                                        mt-4
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            Subject
                                        </span>

                                        <span
                                            className="
                                                text-sm
                                                font-semibold
                                                text-slate-800
                                            "
                                        >
                                            {
                                                deleteRequest.subjectName ||
                                                "—"
                                            }
                                        </span>

                                    </div>


                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            Subject Code
                                        </span>

                                        <span
                                            className="
                                                text-sm
                                                font-semibold
                                                text-slate-800
                                            "
                                        >
                                            {
                                                deleteRequest.subjectCode ||
                                                "—"
                                            }
                                        </span>

                                    </div>


                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            Old Marks
                                        </span>

                                        <span
                                            className="
                                                text-sm
                                                font-bold
                                                text-slate-800
                                            "
                                        >
                                            {
                                                deleteRequest.oldMarks ??
                                                "—"
                                            }
                                        </span>

                                    </div>

                                </div>


                                {/* WARNING */}

                                <div
                                    className="
                                        mt-4
                                        rounded-xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            gap-3
                                        "
                                    >

                                        <FiX
                                            className="
                                                mt-0.5
                                                h-5
                                                w-5
                                                shrink-0
                                                text-red-500
                                            "
                                        />

                                        <p
                                            className="
                                                text-xs
                                                leading-5
                                                text-red-700
                                            "
                                        >
                                            This action cannot
                                            be undone. The
                                            reevaluation request
                                            will be permanently
                                            removed.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-3
                                    border-t
                                    border-slate-200
                                    px-6
                                    py-4
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() => {

                                        setShowDeleteModal(
                                            false
                                        );

                                        setDeleteRequest(
                                            null
                                        );

                                    }}
                                    disabled={
                                        processingId !==
                                        null
                                    }
                                    className="
                                        rounded-md
                                        border
                                        border-slate-300
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        transition
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        processingId !==
                                        null
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-md
                                        bg-red-600
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-red-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {processingId ===
                                        deleteRequest.id ? (

                                        <>
                                            <FiRefreshCw
                                                className="
                                                    h-4
                                                    w-4
                                                    animate-spin
                                                "
                                            />

                                            Deleting...
                                        </>

                                    ) : (

                                        <>
                                            <FiTrash2
                                                className="
                                                    h-4
                                                    w-4
                                                "
                                            />

                                            Delete
                                        </>

                                    )}

                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
};


export default TeacherReevaluation;