import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    RefreshCw,
    Eye,
    X,
    FileText,
    User,
    GraduationCap,
    BookOpen,
    CalendarDays,
    Mail,
    Phone,
    Hash,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

import adminRecheckingService from "../../services/adminRecheckingService";
import adminDepartmentService from "../../services/adminDepartmentService";
import adminSemesterService from "../../services/adminSemesterService";

const AdminRechecking = () => {

    // =====================================================
    // LAYOUT
    // =====================================================

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activePage, setActivePage] = useState("Rechecking");

    // =====================================================
    // DATA
    // =====================================================

    const [requests, setRequests] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);

    // =====================================================
    // FILTERS
    // =====================================================

    const [search, setSearch] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [semesterId, setSemesterId] = useState("");
    const [status, setStatus] = useState("");

    // =====================================================
    // UI
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (page) => {
        setActivePage(page);

        if (window.innerWidth < 768) {
            setMobileOpen(false);
        }
    };

    // =====================================================
    // LOAD REQUESTS
    // =====================================================

    const loadRequests = async () => {
        try {
            setLoading(true);

            const response =
                await adminRecheckingService.getAllRequests();

            console.log(
                "ADMIN RECHECKING RESPONSE:",
                response
            );

            const data =
                Array.isArray(response?.data)
                    ? response.data
                    : [];

            setRequests(data);

        } catch (error) {

            console.error(
                "Rechecking Load Error:",
                error
            );

            setRequests([]);

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD DEPARTMENTS
    // =====================================================

    const loadDepartments = async () => {
        try {

            const response =
                await adminDepartmentService.getAllDepartments();

            console.log(
                "DEPARTMENT RESPONSE:",
                response
            );

            const data =
                Array.isArray(response?.data)
                    ? response.data
                    : [];

            setDepartments(data);

        } catch (error) {

            console.error(
                "Department Load Error:",
                error
            );

            setDepartments([]);
        }
    };

    // =====================================================
    // LOAD SEMESTERS
    // =====================================================

    const loadSemesters = async () => {
        try {

            const response =
                await adminSemesterService.getAllSemesters();

            console.log(
                "SEMESTER RESPONSE:",
                response
            );

            const data =
                Array.isArray(response?.data)
                    ? response.data
                    : [];

            setSemesters(data);

        } catch (error) {

            console.error(
                "Semester Load Error:",
                error
            );

            setSemesters([]);
        }
    };

    // =====================================================
    // LOAD ALL
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            await Promise.all([
                loadRequests(),
                loadDepartments(),
                loadSemesters(),
            ]);

        };

        loadData();

    }, []);

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = async () => {

        try {

            setRefreshing(true);

            await Promise.all([
                loadRequests(),
                loadDepartments(),
                loadSemesters(),
            ]);

        } finally {

            setRefreshing(false);
        }
    };

    // =====================================================
    // VIEW REQUEST
    // =====================================================

    const handleView = async (request) => {

        try {

            const response =
                await adminRecheckingService.getRequestById(
                    request.id
                );

            const data = response?.data || request;

            setSelectedRequest(data);
            setShowViewModal(true);

        } catch (error) {

            console.error(
                "Rechecking Details Error:",
                error
            );

            setSelectedRequest(request);
            setShowViewModal(true);
        }
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeViewModal = () => {

        setShowViewModal(false);
        setSelectedRequest(null);

    };

    // =====================================================
    // FILTER
    // =====================================================

    const filteredRequests = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();

        return requests.filter((request) => {

            // ---------------------------------------------
            // SEARCH
            // ---------------------------------------------

            const matchesSearch =
                !searchText ||
                String(request.studentName || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(request.rollNo || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(request.prnNo || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(request.email || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(request.examType || "")
                    .toLowerCase()
                    .includes(searchText) ||
                (request.subjects || []).some(
                    (subject) =>
                        String(subject.subjectCode || "")
                            .toLowerCase()
                            .includes(searchText) ||
                        String(subject.subjectName || "")
                            .toLowerCase()
                            .includes(searchText)
                );

            // ---------------------------------------------
            // DEPARTMENT
            // ---------------------------------------------

            const selectedDepartment =
                departments.find(
                    (department) =>
                        String(department.id) ===
                        String(departmentId)
                );

            const matchesDepartment =
                !departmentId ||
                String(request.departmentId || "") ===
                String(departmentId) ||
                String(request.departmentName || "")
                    .toLowerCase() ===
                String(
                    selectedDepartment?.departmentName || ""
                ).toLowerCase();

            // ---------------------------------------------
            // SEMESTER
            // ---------------------------------------------

            const selectedSemester =
                semesters.find(
                    (semester) =>
                        String(semester.id) ===
                        String(semesterId)
                );

            const matchesSemester =
                !semesterId ||
                String(request.semesterId || "") ===
                String(semesterId) ||
                String(request.semesterName || "")
                    .toLowerCase() ===
                String(
                    selectedSemester?.semesterName || ""
                ).toLowerCase();

            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            const matchesStatus =
                !status ||
                String(request.status || "")
                    .toUpperCase() ===
                status.toUpperCase();

            return (
                matchesSearch &&
                matchesDepartment &&
                matchesSemester &&
                matchesStatus
            );
        });

    }, [
        requests,
        search,
        departmentId,
        semesterId,
        status,
        departments,
        semesters,
    ]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalRequests = requests.length;

    const pendingRequests = requests.filter(
        (item) =>
            String(item.status || "")
                .toUpperCase() === "PENDING"
    ).length;

    const inReviewRequests = requests.filter(
        (item) =>
            String(item.status || "")
                .toUpperCase()
                .includes("REVIEW")
    ).length;

    const completedRequests = requests.filter(
        (item) =>
            String(item.status || "")
                .toUpperCase() === "COMPLETED"
    ).length;

    // =====================================================
    // STATUS BADGE
    // =====================================================

    const getStatusClass = (value) => {

        const current =
            String(value || "").toUpperCase();

        if (current === "PENDING") {
            return "bg-amber-50 text-amber-700 border-amber-200";
        }

        if (current.includes("REVIEW")) {
            return "bg-blue-50 text-blue-700 border-blue-200";
        }

        if (current === "COMPLETED") {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }

        if (current === "CANCELLED") {
            return "bg-red-50 text-red-700 border-red-200";
        }

        return "bg-slate-50 text-slate-600 border-slate-200";
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        try {

            return new Date(value).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        } catch {
            return value;
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen w-full bg-slate-50 overflow-x-hidden">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <AdminSidebar
                activePage={activePage}
                setActivePage={handlePageChange}
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

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

                <div
                    className="
                        w-full
                        max-w-full
                        min-w-0
                        p-4
                        sm:p-5
                        md:p-6
                        lg:p-8
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="mb-6">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div>

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            h-11
                                            w-11
                                            rounded-xl
                                            bg-indigo-50
                                            text-indigo-600
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <FileText size={22} />
                                    </div>

                                    <div>

                                        <h1
                                            className="
                                                text-xl
                                                sm:text-2xl
                                                font-bold
                                                text-slate-800
                                            "
                                        >
                                            Rechecking Requests
                                        </h1>

                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                                mt-1
                                            "
                                        >
                                            View student rechecking requests
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="
                                    h-10
                                    px-4
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-600
                                    hover:bg-slate-50
                                    text-sm
                                    font-semibold
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    disabled:opacity-60
                                "
                            >

                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>

                        </div>

                    </div>

                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            lg:grid-cols-4
                            gap-4
                            mb-6
                        "
                    >

                        <div className="bg-white border border-slate-200 rounded-2xl p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Total Requests
                            </p>

                            <p className="text-2xl font-bold text-slate-800 mt-2">
                                {totalRequests}
                            </p>

                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Pending
                            </p>

                            <p className="text-2xl font-bold text-amber-600 mt-2">
                                {pendingRequests}
                            </p>

                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4">

                            <p className="text-xs font-medium text-slate-500">
                                In Review
                            </p>

                            <p className="text-2xl font-bold text-blue-600 mt-2">
                                {inReviewRequests}
                            </p>

                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="text-2xl font-bold text-emerald-600 mt-2">
                                {completedRequests}
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        FILTER CARD
                    ================================================= */}

                    <div
                        className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-4
                            mb-6
                        "
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-4
                                gap-3
                            "
                        >

                            {/* SEARCH */}

                            <div className="relative xl:col-span-1">

                                <Search
                                    size={18}
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                        pointer-events-none
                                    "
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search student, roll no, subject..."
                                    className="
                                        w-full
                                        h-11
                                        pl-11
                                        pr-4
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-sm
                                        text-slate-700
                                        placeholder:text-slate-400
                                        outline-none
                                        transition-all
                                        duration-200
                                        focus:bg-white
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        focus:border-indigo-400
                                    "
                                />

                            </div>

                            {/* DEPARTMENT */}

                            <select
                                value={departmentId}
                                onChange={(e) =>
                                    setDepartmentId(e.target.value)
                                }
                                className="
                                    h-11
                                    px-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-indigo-100
                                    focus:border-indigo-400
                                "
                            >

                                <option value="">
                                    All Departments
                                </option>

                                {departments.map(
                                    (department) => (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {
                                                department.departmentName
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            {/* SEMESTER */}

                            <select
                                value={semesterId}
                                onChange={(e) =>
                                    setSemesterId(e.target.value)
                                }
                                className="
                                    h-11
                                    px-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-indigo-100
                                    focus:border-indigo-400
                                "
                            >

                                <option value="">
                                    All Semesters
                                </option>

                                {semesters.map(
                                    (semester) => (
                                        <option
                                            key={semester.id}
                                            value={semester.id}
                                        >
                                            {
                                                semester.semesterName
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            {/* STATUS */}

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                                className="
                                    h-11
                                    px-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-indigo-100
                                    focus:border-indigo-400
                                "
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="PENDING">
                                    Pending
                                </option>

                                <option value="IN_REVIEW">
                                    In Review
                                </option>

                                <option value="COMPLETED">
                                    Completed
                                </option>

                                <option value="CANCELLED">
                                    Cancelled
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div
                        className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            overflow-hidden
                        "
                    >

                        {/* DESKTOP */}

                        <div className="hidden md:block overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="bg-slate-50 border-b border-slate-200">

                                    <tr>

                                        <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                            #
                                        </th>

                                        <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                            Student
                                        </th>

                                        <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                            Subject
                                        </th>

                                        <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                            Department
                                        </th>

                                        <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                            Semester
                                        </th>

                                        <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                            Applied On
                                        </th>

                                        <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-right font-semibold text-slate-600">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="
                                                    px-5
                                                    py-14
                                                    text-center
                                                    text-slate-500
                                                "
                                            >

                                                <RefreshCw
                                                    size={22}
                                                    className="
                                                        animate-spin
                                                        mx-auto
                                                        mb-3
                                                    "
                                                />

                                                Loading rechecking requests...

                                            </td>

                                        </tr>

                                    ) : filteredRequests.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="
                                                    px-5
                                                    py-14
                                                    text-center
                                                    text-slate-500
                                                "
                                            >

                                                <FileText
                                                    size={28}
                                                    className="
                                                        mx-auto
                                                        mb-3
                                                        text-slate-300
                                                    "
                                                />

                                                No rechecking requests found.

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredRequests.map(
                                            (request, index) => {

                                                const subjects =
                                                    request.subjects || [];

                                                return (
                                                    <tr
                                                        key={request.id}
                                                        className="
                                                            border-b
                                                            border-slate-100
                                                            last:border-0
                                                            hover:bg-slate-50
                                                        "
                                                    >

                                                        <td className="px-5 py-4 text-slate-500">
                                                            {index + 1}
                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <div className="font-semibold text-slate-800">
                                                                {
                                                                    request.studentName ||
                                                                    "-"
                                                                }
                                                            </div>

                                                            <div className="text-xs text-slate-500 mt-1">
                                                                Roll: {
                                                                    request.rollNo ||
                                                                    "-"
                                                                }
                                                            </div>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <div className="font-medium text-slate-700">

                                                                {
                                                                    subjects.length
                                                                }{" "}
                                                                subject
                                                                {
                                                                    subjects.length !== 1
                                                                        ? "s"
                                                                        : ""
                                                                }

                                                            </div>

                                                            {subjects[0] && (
                                                                <div className="text-xs text-slate-500 mt-1">

                                                                    {
                                                                        subjects[0]
                                                                            .subjectCode
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        subjects[0]
                                                                            .subjectName
                                                                    }

                                                                </div>
                                                            )}

                                                            {subjects.length > 1 && (
                                                                <div className="text-xs text-indigo-600 mt-1">

                                                                    +
                                                                    {" "}
                                                                    {subjects.length - 1}
                                                                    {" "}
                                                                    more

                                                                </div>
                                                            )}

                                                        </td>

                                                        <td className="px-5 py-4 text-slate-600">

                                                            {
                                                                request.departmentName ||
                                                                "-"
                                                            }

                                                        </td>

                                                        <td className="px-5 py-4 text-slate-600">

                                                            {
                                                                request.semesterName ||
                                                                "-"
                                                            }

                                                        </td>

                                                        <td className="px-5 py-4 text-slate-600">

                                                            {
                                                                formatDate(
                                                                    request.appliedAt
                                                                )
                                                            }

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    items-center
                                                                    px-2.5
                                                                    py-1
                                                                    rounded-full
                                                                    border
                                                                    text-xs
                                                                    font-semibold
                                                                    ${getStatusClass(
                                                                    request.status
                                                                )}
                                                                `}
                                                            >
                                                                {
                                                                    request.status ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <div className="flex justify-end">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleView(
                                                                            request
                                                                        )
                                                                    }
                                                                    className="
                                                                        h-9
                                                                        px-3
                                                                        rounded-lg
                                                                        bg-indigo-50
                                                                        text-indigo-600
                                                                        hover:bg-indigo-100
                                                                        inline-flex
                                                                        items-center
                                                                        gap-2
                                                                        text-xs
                                                                        font-semibold
                                                                    "
                                                                >

                                                                    <Eye
                                                                        size={15}
                                                                    />

                                                                    View

                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* =================================================
                            MOBILE
                        ================================================= */}

                        <div className="md:hidden">

                            {loading ? (

                                <div className="py-14 text-center text-slate-500">

                                    <RefreshCw
                                        size={22}
                                        className="
                                            animate-spin
                                            mx-auto
                                            mb-3
                                        "
                                    />

                                    Loading...

                                </div>

                            ) : filteredRequests.length === 0 ? (

                                <div className="py-14 text-center text-slate-500">

                                    <FileText
                                        size={28}
                                        className="
                                            mx-auto
                                            mb-3
                                            text-slate-300
                                        "
                                    />

                                    No rechecking requests found.

                                </div>

                            ) : (

                                <div className="divide-y divide-slate-100">

                                    {filteredRequests.map(
                                        (request, index) => {

                                            const subjects =
                                                request.subjects || [];

                                            return (
                                                <div
                                                    key={request.id}
                                                    className="
                                                        p-4
                                                        hover:bg-slate-50
                                                    "
                                                >

                                                    <div className="flex items-start justify-between gap-3">

                                                        <div className="min-w-0">

                                                            <div className="flex items-center gap-2">

                                                                <div
                                                                    className="
                                                                        h-9
                                                                        w-9
                                                                        shrink-0
                                                                        rounded-lg
                                                                        bg-indigo-50
                                                                        text-indigo-600
                                                                        flex
                                                                        items-center
                                                                        justify-center
                                                                    "
                                                                >
                                                                    <User
                                                                        size={17}
                                                                    />
                                                                </div>

                                                                <div className="min-w-0">

                                                                    <p className="font-semibold text-slate-800 truncate">

                                                                        {
                                                                            request.studentName ||
                                                                            "-"
                                                                        }

                                                                    </p>

                                                                    <p className="text-xs text-slate-500">

                                                                        Roll: {
                                                                            request.rollNo ||
                                                                            "-"
                                                                        }

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </div>

                                                        <span
                                                            className={`
                                                                shrink-0
                                                                inline-flex
                                                                px-2
                                                                py-1
                                                                rounded-full
                                                                border
                                                                text-[10px]
                                                                font-semibold
                                                                ${getStatusClass(
                                                                request.status
                                                            )}
                                                            `}
                                                        >
                                                            {
                                                                request.status ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </div>

                                                    <div
                                                        className="
                                                            grid
                                                            grid-cols-2
                                                            gap-3
                                                            mt-4
                                                        "
                                                    >

                                                        <div>

                                                            <p className="text-[11px] text-slate-400">
                                                                Subjects
                                                            </p>

                                                            <p className="text-sm font-medium text-slate-700 mt-1">

                                                                {
                                                                    subjects.length
                                                                }

                                                            </p>

                                                        </div>

                                                        <div>

                                                            <p className="text-[11px] text-slate-400">
                                                                Applied On
                                                            </p>

                                                            <p className="text-sm font-medium text-slate-700 mt-1">

                                                                {
                                                                    formatDate(
                                                                        request.appliedAt
                                                                    )
                                                                }

                                                            </p>

                                                        </div>

                                                        <div>

                                                            <p className="text-[11px] text-slate-400">
                                                                Department
                                                            </p>

                                                            <p className="text-sm font-medium text-slate-700 mt-1 truncate">

                                                                {
                                                                    request.departmentName ||
                                                                    "-"
                                                                }

                                                            </p>

                                                        </div>

                                                        <div>

                                                            <p className="text-[11px] text-slate-400">
                                                                Semester
                                                            </p>

                                                            <p className="text-sm font-medium text-slate-700 mt-1 truncate">

                                                                {
                                                                    request.semesterName ||
                                                                    "-"
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleView(
                                                                request
                                                            )
                                                        }
                                                        className="
                                                            w-full
                                                            h-10
                                                            mt-4
                                                            rounded-xl
                                                            bg-indigo-50
                                                            text-indigo-600
                                                            hover:bg-indigo-100
                                                            text-sm
                                                            font-semibold
                                                            inline-flex
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                        "
                                                    >

                                                        <Eye size={16} />

                                                        View Request

                                                    </button>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                    {/* =================================================
                        RESULT COUNT
                    ================================================= */}

                    {!loading && (
                        <div className="mt-3 text-xs text-slate-500">

                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredRequests.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {requests.length}
                            </span>{" "}
                            requests

                        </div>
                    )}

                </div>

            </main>

            {/* =====================================================
                VIEW DETAILS MODAL
            ===================================================== */}

            {showViewModal && selectedRequest && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[120]
                        bg-slate-900/50
                        backdrop-blur-[2px]
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {
                            closeViewModal();
                        }

                    }}
                >

                    <div
                        className="
                            w-full
                            max-w-4xl
                            max-h-[90vh]
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            overflow-hidden
                            flex
                            flex-col
                        "
                    >

                        {/* HEADER */}

                        <div
                            className="
                                px-5
                                py-4
                                border-b
                                border-slate-200
                                flex
                                items-center
                                justify-between
                                shrink-0
                            "
                        >

                            <div>

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            h-10
                                            w-10
                                            rounded-xl
                                            bg-indigo-50
                                            text-indigo-600
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <FileText size={20} />
                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-slate-800">
                                            Rechecking Request
                                        </h2>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Request ID: #
                                            {
                                                selectedRequest.id
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={closeViewModal}
                                className="
                                    h-9
                                    w-9
                                    rounded-lg
                                    hover:bg-slate-100
                                    text-slate-500
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* BODY */}

                        <div className="p-5 overflow-y-auto">

                            {/* STATUS */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    gap-3
                                    mb-5
                                "
                            >

                                <div>

                                    <h3 className="text-base font-bold text-slate-800">

                                        {
                                            selectedRequest.studentName ||
                                            "-"
                                        }

                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">

                                        {
                                            selectedRequest.departmentName ||
                                            "-"
                                        }
                                        {" • "}
                                        {
                                            selectedRequest.semesterName ||
                                            "-"
                                        }

                                    </p>

                                </div>

                                <span
                                    className={`
                                        self-start
                                        inline-flex
                                        px-3
                                        py-1.5
                                        rounded-full
                                        border
                                        text-xs
                                        font-bold
                                        ${getStatusClass(
                                        selectedRequest.status
                                    )}
                                    `}
                                >
                                    {
                                        selectedRequest.status ||
                                        "-"
                                    }
                                </span>

                            </div>

                            {/* STUDENT */}

                            <div className="mb-5">

                                <div className="flex items-center gap-2 mb-3">

                                    <User
                                        size={17}
                                        className="text-indigo-600"
                                    />

                                    <h3 className="font-bold text-slate-800">
                                        Student Information
                                    </h3>

                                </div>

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        sm:grid-cols-2
                                        lg:grid-cols-3
                                        gap-3
                                    "
                                >

                                    <InfoBox
                                        icon={User}
                                        label="Student Name"
                                        value={
                                            selectedRequest.studentName
                                        }
                                    />

                                    <InfoBox
                                        icon={Hash}
                                        label="Roll Number"
                                        value={
                                            selectedRequest.rollNo
                                        }
                                    />

                                    <InfoBox
                                        icon={Hash}
                                        label="PRN Number"
                                        value={
                                            selectedRequest.prnNo
                                        }
                                    />

                                    <InfoBox
                                        icon={Mail}
                                        label="Email"
                                        value={
                                            selectedRequest.email
                                        }
                                    />

                                    <InfoBox
                                        icon={Phone}
                                        label="Mobile"
                                        value={
                                            selectedRequest.mobile
                                        }
                                    />

                                </div>

                            </div>

                            {/* ACADEMIC */}

                            <div className="mb-5">

                                <div className="flex items-center gap-2 mb-3">

                                    <GraduationCap
                                        size={17}
                                        className="text-indigo-600"
                                    />

                                    <h3 className="font-bold text-slate-800">
                                        Academic Information
                                    </h3>

                                </div>

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        sm:grid-cols-2
                                        lg:grid-cols-3
                                        gap-3
                                    "
                                >

                                    <InfoBox
                                        icon={GraduationCap}
                                        label="Department"
                                        value={
                                            selectedRequest.departmentName
                                        }
                                    />

                                    <InfoBox
                                        icon={BookOpen}
                                        label="Semester"
                                        value={
                                            selectedRequest.semesterName
                                        }
                                    />

                                    <InfoBox
                                        icon={FileText}
                                        label="Exam Type"
                                        value={
                                            selectedRequest.examType
                                        }
                                    />

                                </div>

                            </div>

                            {/* REQUEST */}

                            <div className="mb-5">

                                <div className="flex items-center gap-2 mb-3">

                                    <FileText
                                        size={17}
                                        className="text-indigo-600"
                                    />

                                    <h3 className="font-bold text-slate-800">
                                        Request Information
                                    </h3>

                                </div>

                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">

                                    <p className="text-xs font-semibold text-slate-500 mb-2">
                                        Reason
                                    </p>

                                    <p className="text-sm text-slate-700 leading-6">
                                        {
                                            selectedRequest.reason ||
                                            "No reason provided."
                                        }
                                    </p>

                                    <div
                                        className="
                                            grid
                                            grid-cols-1
                                            sm:grid-cols-2
                                            gap-4
                                            mt-4
                                            pt-4
                                            border-t
                                            border-slate-200
                                        "
                                    >

                                        <div>

                                            <p className="text-xs text-slate-500">
                                                Applied On
                                            </p>

                                            <p className="text-sm font-semibold text-slate-700 mt-1">
                                                {
                                                    formatDate(
                                                        selectedRequest.appliedAt
                                                    )
                                                }
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-500">
                                                Reviewed On
                                            </p>

                                            <p className="text-sm font-semibold text-slate-700 mt-1">
                                                {
                                                    formatDate(
                                                        selectedRequest.reviewedAt
                                                    )
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* SUBJECTS */}

                            <div>

                                <div className="flex items-center gap-2 mb-3">

                                    <BookOpen
                                        size={17}
                                        className="text-indigo-600"
                                    />

                                    <h3 className="font-bold text-slate-800">
                                        Rechecking Subjects
                                    </h3>

                                </div>

                                <div className="border border-slate-200 rounded-xl overflow-hidden">

                                    <div className="overflow-x-auto">

                                        <table className="w-full text-sm">

                                            <thead className="bg-slate-50 border-b border-slate-200">

                                                <tr>

                                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                                        Subject
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                                        Teacher
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                                        Old Marks
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                                        New Marks
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                                        Status
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {(
                                                    selectedRequest.subjects ||
                                                    []
                                                ).length === 0 ? (

                                                    <tr>

                                                        <td
                                                            colSpan="5"
                                                            className="
                                                                px-4
                                                                py-8
                                                                text-center
                                                                text-slate-500
                                                            "
                                                        >
                                                            No subjects found.
                                                        </td>

                                                    </tr>

                                                ) : (

                                                    selectedRequest.subjects.map(
                                                        (subject) => (

                                                            <tr
                                                                key={
                                                                    subject.id
                                                                }
                                                                className="
                                                                    border-b
                                                                    border-slate-100
                                                                    last:border-0
                                                                "
                                                            >

                                                                <td className="px-4 py-3">

                                                                    <div className="font-semibold text-slate-700">
                                                                        {
                                                                            subject.subjectCode ||
                                                                            "-"
                                                                        }
                                                                    </div>

                                                                    <div className="text-xs text-slate-500 mt-1">
                                                                        {
                                                                            subject.subjectName ||
                                                                            "-"
                                                                        }
                                                                    </div>

                                                                </td>

                                                                <td className="px-4 py-3 text-slate-600">

                                                                    {
                                                                        subject.teacherName ||
                                                                        "-"
                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3 font-semibold text-slate-700">

                                                                    {
                                                                        subject.oldMarks ??
                                                                        "-"
                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3 font-semibold text-slate-700">

                                                                    {
                                                                        subject.newMarks ??
                                                                        "-"
                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3">

                                                                    <span
                                                                        className={`
                                                                            inline-flex
                                                                            px-2.5
                                                                            py-1
                                                                            rounded-full
                                                                            border
                                                                            text-xs
                                                                            font-semibold
                                                                            ${getStatusClass(
                                                                            subject.status
                                                                        )}
                                                                        `}
                                                                    >
                                                                        {
                                                                            subject.status ||
                                                                            "-"
                                                                        }
                                                                    </span>

                                                                </td>

                                                            </tr>

                                                        )
                                                    )

                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div
                            className="
                                px-5
                                py-4
                                border-t
                                border-slate-200
                                flex
                                justify-end
                                shrink-0
                            "
                        >

                            <button
                                type="button"
                                onClick={closeViewModal}
                                className="
                                    h-10
                                    px-5
                                    rounded-xl
                                    bg-slate-100
                                    hover:bg-slate-200
                                    text-slate-700
                                    text-sm
                                    font-semibold
                                "
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


// =====================================================
// INFO BOX
// =====================================================

const InfoBox = ({
    icon: Icon,
    label,
    value,
}) => {

    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-3
            "
        >

            <div className="flex items-center gap-2">

                {Icon && (
                    <Icon
                        size={15}
                        className="text-slate-400"
                    />
                )}

                <span className="text-xs text-slate-500">
                    {label}
                </span>

            </div>

            <p
                className="
                    text-sm
                    font-semibold
                    text-slate-700
                    mt-2
                    break-words
                "
            >
                {value || "-"}
            </p>

        </div>
    );
};

export default AdminRechecking;