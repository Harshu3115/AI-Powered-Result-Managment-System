import React, { useEffect, useState } from "react";
import {
    FiRefreshCw,
    FiCheck,
    FiX,
    FiClock,
    FiTrash2
} from "react-icons/fi";
import { toast } from "react-toastify";

import teacherService from "../../services/teacherService";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";
import { Navigate } from "react-router-dom";

const TeacherRechecking = () => {
    const [recheckingRequests, setRecheckingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState("");
    const [dashboard, setDashboard] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Review modal
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Complete modal
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRequest, setDeleteRequest] = useState(null);

    const [reviewResult, setReviewResult] = useState("");
    const [newExternalMarks, setNewExternalMarks] = useState("");
    const [teacherMessage, setTeacherMessage] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    // Sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ==========================================
    // FETCH RECHECKING REQUESTS
    // ==========================================

    const fetchRecheckingRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await teacherService.getRecheckingRequests();

            console.log(
                "Teacher Rechecking Response:",
                response
            );

            if (response?.success) {
                setRecheckingRequests(
                    response.data || []
                );
            } else {
                setError(
                    response?.message ||
                    "Failed to fetch rechecking requests."
                );
            }
        } catch (err) {
            console.error(
                "Rechecking API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load rechecking requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecheckingRequests();
    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged out successfully");

        setTimeout(() => {
            Navigate("/login");
        }, 500);
    };


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


    const handleDelete = async () => {

        if (!deleteRequest?.id) {
            toast.error("Invalid rechecking request.");
            return;
        }

        try {

            setProcessingId(deleteRequest.id);

            const response =
                await teacherService.deleteRecheckingRequest(
                    deleteRequest.id
                );

            if (response?.success) {

                toast.success(
                    response.message ||
                    "Rechecking request deleted successfully."
                );

                setRecheckingRequests((prev) =>
                    prev.filter(
                        (item) =>
                            item.id !== deleteRequest.id
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
                "Delete Rechecking Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Failed to delete rechecking request."
            );

        } finally {

            setProcessingId(null);
        }
    };

    // ==========================================
    // REVIEW
    // ==========================================

    const handleReview = async (approved) => {
        if (!selectedRequest) return;

        try {
            setProcessingId(selectedRequest.id);

            const response =
                await teacherService.reviewRecheckingRequest(
                    selectedRequest.id,
                    approved
                );

            console.log(
                "Review Response:",
                response
            );

            if (response?.success) {

                setShowReviewModal(false);

                if (approved) {
                    setSelectedRequest(response.data);

                    setReviewResult("");
                    setNewExternalMarks("");
                    setTeacherMessage("");

                    setShowCompleteModal(true);
                } else {
                    setSelectedRequest(null);

                    await fetchRecheckingRequests();
                }
            } else {
                toast.errot(
                    response?.message ||
                    "Unable to review request."
                );
            }

        } catch (err) {
            console.error(
                "Review Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Failed to review request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    // ==========================================
    // COMPLETE
    // ==========================================

    const handleComplete = async () => {
        if (!selectedRequest) return;

        if (!reviewResult) {
            toast.error("Please select the review result.");
            return;
        }

        if (!teacherMessage.trim()) {
            toast.error("Please enter a teacher message.");
            return;
        }

        let marks;

        if (reviewResult === "MARKS_INCREASED") {
            if (
                newExternalMarks === "" ||
                newExternalMarks === null
            ) {
                toast.error("Please enter new external marks.");
                return;
            }

            marks = Number(newExternalMarks);

            if (
                Number.isNaN(marks) ||
                marks < 0 ||
                marks > 60
            ) {
                toast.error(
                    "External marks must be between 0 and 60."
                );
                return;
            }

            if (
                marks <= Number(selectedRequest.oldMarks)
            ) {
                toast.error(
                    "New marks must be greater than old marks."
                );
                return;
            }
        } else {
            // NO_CHANGE
            marks = Number(selectedRequest.oldMarks);
        }

        try {
            setProcessingId(selectedRequest.id);

            const response =
                await teacherService.completeRechecking(
                    selectedRequest.id,
                    {
                        reviewResult,
                        newMarks: marks,
                        teacherMessage:
                            teacherMessage.trim()
                    }
                );

            console.log(
                "Complete Rechecking Response:",
                response
            );

            if (response?.success) {
                toast.success(
                    response.message ||
                    "Rechecking completed successfully."
                );

                setShowCompleteModal(false);
                setSelectedRequest(null);

                setReviewResult("");
                setNewExternalMarks("");
                setTeacherMessage("");

                await fetchRecheckingRequests();
            } else {
                alert(
                    response?.message ||
                    "Unable to complete rechecking."
                );
            }
        } catch (err) {
            console.error(
                "Complete Rechecking Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Failed to complete rechecking."
            );
        } finally {
            setProcessingId(null);
        }
    };

    // ==========================================
    // STATUS BADGE
    // ==========================================

    const getStatusBadge = (status) => {

        const normalized =
            String(status || "")
                .toUpperCase();

        if (normalized === "PENDING") {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <FiClock />
                    Pending
                </span>
            );
        }

        if (normalized === "APPROVED") {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <FiCheck />
                    Approved
                </span>
            );
        }

        if (normalized === "REJECTED") {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    <FiX />
                    Rejected
                </span>
            );
        }

        return (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {status || "Unknown"}
            </span>
        );
    };

    // ==========================================
    // OPEN REVIEW MODAL
    // ==========================================

    const openReviewModal = (request) => {
        setSelectedRequest(request);
        setShowReviewModal(true);
    };

    const openDeleteModal = (request) => {
        setDeleteRequest(request);
        setShowDeleteModal(true);
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =====================================
                SIDEBAR
            ====================================== */}

            <TeacherSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
            />

            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <div
                className={`min-h-screen transition-all duration-300 ${sidebarCollapsed
                    ? "lg:ml-[84px]"
                    : "lg:ml-[272px]"
                    }`}
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

                {/* PAGE CONTENT */}

                <main className="w-full px-6 pt-[96px] pb-6 sm:px-8 lg:px-8">

                    {/* HEADER */}

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                                    <FiRefreshCw className="h-5 w-5" />
                                </div>

                                <h1 className="text-2xl font-bold text-slate-800">
                                    Rechecking Requests
                                </h1>
                            </div>

                            <p className="text-sm text-slate-500">
                                Review and manage student
                                rechecking requests.
                            </p>
                        </div>

                        <button
                            onClick={
                                fetchRecheckingRequests
                            }
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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

                    {/* ERROR */}

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* TABLE CARD */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-200 px-5 py-4">
                            <h2 className="font-semibold text-slate-800">
                                Pending Requests
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Requests assigned to you for
                                review.
                            </p>
                        </div>

                        {/* LOADING */}

                        {loading ? (
                            <div className="flex min-h-[300px] items-center justify-center">
                                <div className="text-center">

                                    <FiRefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin text-indigo-600" />

                                    <p className="text-sm text-slate-500">
                                        Loading rechecking
                                        requests...
                                    </p>

                                </div>
                            </div>
                        ) : recheckingRequests.length === 0 ? (

                            /* EMPTY */

                            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                                <div className="mb-4 rounded-full bg-slate-100 p-4">
                                    <FiRefreshCw className="h-7 w-7 text-slate-400" />
                                </div>

                                <h3 className="font-semibold text-slate-700">
                                    No Rechecking Requests
                                </h3>

                                <p className="mt-1 max-w-md text-sm text-slate-500">
                                    There are currently no
                                    pending rechecking requests
                                    assigned to you.
                                </p>

                            </div>

                        ) : (

                            /* TABLE */

                            <div className="overflow-x-auto">

                                <table className="min-w-[1050px] w-full">

                                    <thead>
                                        <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

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

                                    <tbody className="divide-y divide-slate-100">

                                        {recheckingRequests.map(
                                            (request, index) => (

                                                <tr
                                                    key={
                                                        request.id
                                                    }
                                                    className="transition hover:bg-slate-50"
                                                >

                                                    <td className="px-5 py-4 text-sm font-medium text-slate-500">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-5 py-4">

                                                        <div className="font-semibold text-slate-800">
                                                            {
                                                                request.subjectName ||
                                                                "—"
                                                            }
                                                        </div>

                                                        <div className="mt-1 text-xs text-slate-500">
                                                            {
                                                                request.subjectCode ||
                                                                "—"
                                                            }
                                                        </div>

                                                    </td>

                                                    <td className="px-5 py-4">

                                                        <span className="font-semibold text-slate-700">
                                                            {
                                                                request.oldMarks ??
                                                                "—"
                                                            }
                                                        </span>

                                                        <span className="text-xs text-slate-400">
                                                            {" "}
                                                            / 100
                                                        </span>

                                                    </td>

                                                    <td className="px-5 py-4">

                                                        {request.newMarks !==
                                                            null &&
                                                            request.newMarks !==
                                                            undefined ? (
                                                            <span className="font-semibold text-emerald-600">
                                                                {
                                                                    request.newMarks
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400">
                                                                —
                                                            </span>
                                                        )}

                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {getStatusBadge(
                                                            request.status
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-slate-600">
                                                        {
                                                            request.reviewResult ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-center gap-2">

                                                            {/* REVIEW */}
                                                            <button
                                                                onClick={() =>
                                                                    openReviewModal(request)
                                                                }
                                                                disabled={
                                                                    request.status?.toUpperCase() !==
                                                                    "PENDING" ||
                                                                    processingId === request.id
                                                                }
                                                                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                Review
                                                            </button>

                                                            {/* DELETE */}
                                                            <button
                                                                onClick={() => openDeleteModal(request)}
                                                                disabled={processingId === request.id}
                                                                title="Delete request"
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <FiTrash2 className="h-4 w-4" />
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

            {/* =====================================
                REVIEW MODAL
            ====================================== */}

            {showReviewModal &&
                selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

                        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                            {/* MODAL HEADER */}

                            <div className="border-b border-slate-200 px-6 py-5">

                                <h2 className="text-lg font-bold text-slate-800">
                                    Review Rechecking Request
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review the student's request
                                    before proceeding.
                                </p>

                            </div>

                            {/* MODAL BODY */}

                            <div className="space-y-4 px-6 py-5">

                                <div className="grid grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Subject
                                        </p>

                                        <p className="mt-1 font-semibold text-slate-800">
                                            {
                                                selectedRequest.subjectName ||
                                                "—"
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Subject Code
                                        </p>

                                        <p className="mt-1 font-semibold text-slate-800">
                                            {
                                                selectedRequest.subjectCode ||
                                                "—"
                                            }
                                        </p>
                                    </div>

                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Current Marks
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-800">
                                        {
                                            selectedRequest.oldMarks ??
                                            "—"
                                        }

                                        <span className="ml-1 text-sm font-medium text-slate-400">
                                            / 100
                                        </span>
                                    </p>

                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Student's Request
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Please review the
                                        student's answer sheet
                                        and decide whether the
                                        request should be
                                        approved.
                                    </p>

                                </div>

                            </div>

                            {/* MODAL FOOTER */}

                            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

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
                                        processingId !== null
                                    }
                                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() =>
                                        handleReview(false)
                                    }
                                    disabled={
                                        processingId !== null
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                                >
                                    <FiX />
                                    Reject
                                </button>

                                <button
                                    onClick={() =>
                                        handleReview(true)
                                    }
                                    disabled={
                                        processingId !== null
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    <FiCheck />
                                    Approve
                                </button>

                            </div>

                        </div>
                    </div>
                )}

            {/* =====================================
                COMPLETE MODAL
            ====================================== */}

            {showCompleteModal &&
                selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

                        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <h2 className="text-lg font-bold text-slate-800">
                                    Complete Rechecking
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter the revised external
                                    marks.
                                </p>

                            </div>

                            <div className="space-y-5 px-6 py-6">

                                {/* OLD MARKS */}
                                <div className="rounded-xl bg-slate-50 p-4">

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-slate-500">
                                            Old External Marks
                                        </span>

                                        <span className="font-bold text-slate-800">
                                            {selectedRequest.oldMarks} / 60
                                        </span>

                                    </div>

                                </div>


                                {/* REVIEW RESULT */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Review Result
                                    </label>

                                    {/* REVIEW RESULT TOGGLE */}
                                    <div>
                                        <label className="mb-3 block text-sm font-semibold text-slate-700">
                                            Review Result
                                        </label>

                                        <div className="grid grid-cols-2 gap-3">

                                            {/* MARKS INCREASED */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReviewResult("MARKS_INCREASED");
                                                    setNewExternalMarks("");
                                                }}
                                                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${reviewResult === "MARKS_INCREASED"
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <FiCheck className="h-4 w-4" />
                                                    Marks Increased
                                                </div>
                                            </button>

                                            {/* NO CHANGE */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReviewResult("NO_CHANGE");
                                                    setNewExternalMarks(
                                                        String(selectedRequest.oldMarks)
                                                    );
                                                }}
                                                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${reviewResult === "NO_CHANGE"
                                                    ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100"
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <FiX className="h-4 w-4" />
                                                    No Change
                                                </div>
                                            </button>

                                        </div>
                                    </div>

                                </div>


                                {/* NEW MARKS */}
                                {reviewResult === "MARKS_INCREASED" && (
                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            New External Marks
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="60"
                                            value={newExternalMarks}
                                            onChange={(e) =>
                                                setNewExternalMarks(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter marks out of 60"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />

                                        <p className="mt-2 text-xs text-slate-400">
                                            New marks must be greater than old
                                            marks and cannot exceed 60.
                                        </p>

                                    </div>
                                )}


                                {/* NO CHANGE INFO */}
                                {reviewResult === "NO_CHANGE" && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                                        <p className="text-sm font-medium text-amber-800">
                                            No marks change
                                        </p>

                                        <p className="mt-1 text-xs text-amber-700">
                                            The student's marks will remain{" "}
                                            <strong>
                                                {selectedRequest.oldMarks}
                                            </strong>
                                            .
                                        </p>

                                    </div>
                                )}


                                {/* TEACHER MESSAGE */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Teacher Message
                                    </label>

                                    <textarea
                                        rows={4}
                                        maxLength={1000}
                                        value={teacherMessage}
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
                                        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                    <div className="mt-1 text-right text-xs text-slate-400">
                                        {teacherMessage.length}/1000
                                    </div>

                                </div>

                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                                <button
                                    onClick={() => {
                                        setShowCompleteModal(
                                            false
                                        );
                                        setSelectedRequest(
                                            null
                                        );
                                        setNewExternalMarks(
                                            ""
                                        );
                                    }}
                                    disabled={
                                        processingId !== null
                                    }
                                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={
                                        handleComplete
                                    }
                                    disabled={
                                        processingId !== null
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processingId !==
                                        null ? (
                                        <>
                                            <FiRefreshCw className="animate-spin" />
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


            {/* =====================================
    DELETE CONFIRMATION MODAL
====================================== */}

            {showDeleteModal && deleteRequest && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4">

                    <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl">

                        {/* HEADER */}
                        <div className="border-b border-slate-200 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                                    <FiTrash2 className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Delete Rechecking Request
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Confirm deletion
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* BODY */}
                        <div className="px-6 py-6">

                            <p className="text-sm leading-6 text-slate-600">
                                Are you sure you want to delete this
                                rechecking request?
                            </p>

                            {/* REQUEST INFO */}
                            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

                                <div className="flex items-center justify-between">

                                    <span className="text-xs font-medium text-slate-500">
                                        Subject
                                    </span>

                                    <span className="text-sm font-semibold text-slate-800">
                                        {deleteRequest.subjectName || "—"}
                                    </span>

                                </div>


                                <div className="mt-3 flex items-center justify-between">

                                    <span className="text-xs font-medium text-slate-500">
                                        Subject Code
                                    </span>

                                    <span className="text-sm font-semibold text-slate-800">
                                        {deleteRequest.subjectCode || "—"}
                                    </span>

                                </div>


                                <div className="mt-3 flex items-center justify-between">

                                    <span className="text-xs font-medium text-slate-500">
                                        Old Marks
                                    </span>

                                    <span className="text-sm font-bold text-slate-800">
                                        {deleteRequest.oldMarks ?? "—"}
                                    </span>

                                </div>

                            </div>


                            {/* WARNING */}
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">

                                <div className="flex gap-3">

                                    <FiX className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                                    <p className="text-xs leading-5 text-red-700">
                                        This action cannot be undone.
                                        The rechecking request will be
                                        permanently removed.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* FOOTER */}
                        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                            {/* CANCEL */}
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteRequest(null);
                                }}
                                disabled={processingId !== null}
                                className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            {/* DELETE */}
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={processingId !== null}
                                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {processingId === deleteRequest.id ? (
                                    <>
                                        <FiRefreshCw className="h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 className="h-4 w-4" />
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

export default TeacherRechecking;