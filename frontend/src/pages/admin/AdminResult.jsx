import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Filter,
    Eye,
    Trash2,
    FileText,
    X,
    RefreshCw,
    ChevronDown,
    GraduationCap,
    Building2,
    BookOpen,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";

import adminResultService from "../../services/adminResultService";
import adminDepartmentService from "../../services/adminDepartmentService";
import adminSemesterService from "../../services/adminSemesterService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AdminResult = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [results, setResults] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [selectedResult, setSelectedResult] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [deletingId, setDeletingId] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activePage, setActivePage] = useState("Results");


    const handlePageChange = (page) => {
        setActivePage(page);

        if (window.innerWidth < 768) {
            setMobileOpen(false);
        }
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                resultResponse,
                departmentResponse,
                semesterResponse,
            ] = await Promise.all([
                adminResultService.getAllResults(),
                adminDepartmentService.getAllDepartments(),
                adminSemesterService.getAllSemesters(),
            ]);

            console.log("RESULT RESPONSE:", resultResponse);
            console.log("DEPARTMENT RESPONSE:", departmentResponse);
            console.log("SEMESTER RESPONSE:", semesterResponse);

            setResults(
                resultResponse?.data || []
            );

            setDepartments(
                departmentResponse?.data || []
            );

            setSemesters(
                semesterResponse?.data || []
            );

        } catch (err) {
            console.error(
                "Result Load Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load result data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =====================================================
    // FILTER RESULTS
    // =====================================================

    const filteredResults = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();

        return results.filter((result) => {

            const matchesSearch =
                !searchText ||
                String(result.studentName || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(result.rollNo || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(result.courseName || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(result.departmentName || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(result.semesterName || "")
                    .toLowerCase()
                    .includes(searchText);

            const matchesDepartment =
                !departmentFilter ||
                String(result.departmentId) ===
                String(departmentFilter);

            const matchesSemester =
                !semesterFilter ||
                String(result.semesterId) ===
                String(semesterFilter);

            const matchesStatus =
                !statusFilter ||
                String(result.resultStatus || "")
                    .toUpperCase() ===
                statusFilter.toUpperCase();

            return (
                matchesSearch &&
                matchesDepartment &&
                matchesSemester &&
                matchesStatus
            );
        });

    }, [
        results,
        search,
        departmentFilter,
        semesterFilter,
        statusFilter,
    ]);

    // =====================================================
    // VIEW RESULT
    // =====================================================

    const handleView = (result) => {
        setSelectedResult(result);
        setShowViewModal(true);
    };

    // =====================================================
    // DELETE CLICK
    // =====================================================

    const handleDeleteClick = (result) => {
        setSelectedResult(result);
        setShowDeleteModal(true);
    };

    // =====================================================
    // DELETE RESULT
    // =====================================================

    const handleDelete = async () => {

        if (!selectedResult?.id) {
            return;
        }

        try {

            setDeletingId(
                selectedResult.id
            );

            await adminResultService.deleteResult(
                selectedResult.id
            );

            setResults((prev) =>
                prev.filter(
                    (item) =>
                        item.id !==
                        selectedResult.id
                )
            );

            setShowDeleteModal(false);
            setSelectedResult(null);

        } catch (err) {

            console.error(
                "Delete Result Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to delete result."
            );

        } finally {

            setDeletingId(null);
        }
    };

    // =====================================================
    // MARKSHEET
    // =====================================================

    const handleMarksheet = async (result) => {

        try {

            setDownloadingId(result.id);

            const blob =
                await adminResultService.getMarksheet(
                    result.id
                );

            const url =
                window.URL.createObjectURL(blob);

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 10000);

        } catch (err) {

            console.error(
                "Marksheet Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to generate marksheet."
            );

        } finally {

            setDownloadingId(null);
        }
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setSearch("");
        setDepartmentFilter("");
        setSemesterFilter("");
        setStatusFilter("");
    };

    // =====================================================
    // STATUS
    // =====================================================

    const getStatus = (status) => {

        const value =
            String(status || "").toUpperCase();

        if (value === "PASS") {
            return {
                className:
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: <CheckCircle2 size={14} />,
            };
        }

        if (value === "FAIL") {
            return {
                className:
                    "bg-red-50 text-red-600 border-red-200",
                icon: <XCircle size={14} />,
            };
        }

        return {
            className:
                "bg-slate-50 text-slate-600 border-slate-200",
            icon: <AlertCircle size={14} />,
        };
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
            min-h-screen
            w-full
            overflow-x-hidden
            bg-slate-50
        "
        >

            {/* SIDEBAR */}
            <AdminSidebar
                activePage={activePage}
                setActivePage={handlePageChange}
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* TOPBAR */}
            <AdminTopbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* MAIN CONTENT */}
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

                <div className="
                w-full
                max-w-full
                min-w-0
                overflow-hidden
                p-4
                sm:p-5
                md:p-6
                lg:p-8
            ">

                    {/* =====================================================
                HEADER
            ===================================================== */}

                    <div className="mb-6">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            <div>

                                <div className="flex items-center gap-3">

                                    <div className="
                                h-11
                                w-11
                                rounded-xl
                                bg-indigo-100
                                text-indigo-600
                                flex
                                items-center
                                justify-center
                            ">
                                        <GraduationCap size={23} />
                                    </div>

                                    <div>
                                        <h1 className="
                                    text-2xl
                                    sm:text-3xl
                                    font-bold
                                    text-slate-800
                                ">
                                            Results
                                        </h1>

                                        <p className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                ">
                                            Manage student semester results
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={loadData}
                                disabled={loading}
                                className="
                            h-10
                            px-4
                            rounded-xl
                            bg-white
                            border
                            border-slate-200
                            text-slate-600
                            hover:bg-slate-50
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            text-sm
                            font-semibold
                            disabled:opacity-50
                        "
                            >
                                <RefreshCw
                                    size={16}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh
                            </button>

                        </div>
                    </div>


                    {/* =====================================================
                ERROR
            ===================================================== */}

                    {error && (
                        <div className="
                    mb-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                    flex
                    items-center
                    gap-2
                ">
                            <AlertCircle size={17} />

                            <span className="flex-1">
                                {error}
                            </span>

                            <button
                                type="button"
                                onClick={() => setError("")}
                            >
                                <X size={17} />
                            </button>
                        </div>
                    )}


                    {/* =====================================================
                FILTER CARD
            ===================================================== */}

                    <div className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                p-4
                sm:p-5
                mb-5
            ">

                        <div className="
                    flex
                    items-center
                    gap-2
                    mb-4
                ">
                            <Filter
                                size={18}
                                className="text-indigo-600"
                            />

                            <h2 className="
                        text-sm
                        font-bold
                        text-slate-700
                    ">
                                Search & Filters
                            </h2>
                        </div>


                        <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-5
                    gap-3
                ">

                            {/* SEARCH */}

                            <div className="
    relative
    md:col-span-2
    xl:col-span-2
">

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
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search student, roll no, course..."
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

                            <div className="relative">

                                <Building2
                                    size={16}
                                    className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                pointer-events-none
                            "
                                />

                                <select
                                    value={departmentFilter}
                                    onChange={(e) =>
                                        setDepartmentFilter(
                                            e.target.value
                                        )
                                    }
                                    className="
                                w-full
                                h-11
                                pl-9
                                pr-8
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                text-sm
                                text-slate-700
                                outline-none
                                appearance-none
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
                                                {department.departmentName}
                                            </option>
                                        )
                                    )}
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                pointer-events-none
                            "
                                />

                            </div>


                            {/* SEMESTER */}

                            <div className="relative">

                                <BookOpen
                                    size={16}
                                    className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                pointer-events-none
                            "
                                />

                                <select
                                    value={semesterFilter}
                                    onChange={(e) =>
                                        setSemesterFilter(
                                            e.target.value
                                        )
                                    }
                                    className="
                                w-full
                                h-11
                                pl-9
                                pr-8
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                text-sm
                                text-slate-700
                                outline-none
                                appearance-none
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
                                                {semester.semesterName}
                                            </option>
                                        )
                                    )}
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                pointer-events-none
                            "
                                />

                            </div>


                            {/* STATUS */}

                            <div className="relative">

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                    className="
                                w-full
                                h-11
                                px-3
                                pr-8
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                text-sm
                                text-slate-700
                                outline-none
                                appearance-none
                                focus:bg-white
                                focus:ring-2
                                focus:ring-indigo-100
                                focus:border-indigo-400
                            "
                                >
                                    <option value="">
                                        All Status
                                    </option>

                                    <option value="PASS">
                                        PASS
                                    </option>

                                    <option value="FAIL">
                                        FAIL
                                    </option>

                                </select>

                                <ChevronDown
                                    size={16}
                                    className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                pointer-events-none
                            "
                                />

                            </div>

                        </div>


                        {/* FILTER FOOTER */}

                        <div className="
                    mt-4
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                ">

                            <p className="
                        text-xs
                        text-slate-500
                    ">
                                Showing{" "}
                                <span className="
                            font-bold
                            text-slate-700
                        ">
                                    {filteredResults.length}
                                </span>{" "}
                                of{" "}
                                <span className="
                            font-bold
                            text-slate-700
                        ">
                                    {results.length}
                                </span>{" "}
                                results
                            </p>

                            {(search ||
                                departmentFilter ||
                                semesterFilter ||
                                statusFilter) && (

                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="
                                text-sm
                                font-semibold
                                text-indigo-600
                                hover:text-indigo-700
                                inline-flex
                                items-center
                                gap-1
                            "
                                    >
                                        <X size={15} />
                                        Clear Filters
                                    </button>

                                )}

                        </div>

                    </div>


                    {/* =====================================================
                TABLE
            ===================================================== */}

                    <div className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                overflow-hidden
            ">

                        {loading ? (

                            <div className="
                        min-h-[350px]
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-3
                        text-slate-500
                    ">
                                <RefreshCw
                                    size={28}
                                    className="
                                animate-spin
                                text-indigo-500
                            "
                                />

                                <p className="text-sm">
                                    Loading results...
                                </p>
                            </div>

                        ) : filteredResults.length === 0 ? (

                            <div className="
                        min-h-[350px]
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                        px-5
                    ">

                                <div className="
                            h-14
                            w-14
                            rounded-2xl
                            bg-slate-100
                            text-slate-400
                            flex
                            items-center
                            justify-center
                            mb-3
                        ">
                                    <GraduationCap size={27} />
                                </div>

                                <h3 className="
                            text-base
                            font-bold
                            text-slate-700
                        ">
                                    No Results Found
                                </h3>

                                <p className="
                            text-sm
                            text-slate-500
                            mt-1
                            max-w-md
                        ">
                                    No result records match your
                                    current search and filters.
                                </p>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="
                            w-full
                            min-w-[1050px]
                            text-left
                        ">

                                    <thead className="
                                bg-slate-50
                                border-b
                                border-slate-200
                            ">

                                        <tr>

                                            <th className="
                                        px-5
                                        py-4
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    ">
                                                Student
                                            </th>

                                            <th className="
                                        px-5
                                        py-4
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    ">
                                                Department
                                            </th>

                                            <th className="
                                        px-5
                                        py-4
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    ">
                                                Semester
                                            </th>

                                            <th className="
                                        px-5
                                        py-4
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    ">
                                                Marks
                                            </th>

                                            <th className="
                                        px-5
                                        py-4
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    ">
                                                Percentage
                                            </th>

                                            <th className="
                                        px-5
                                        py-4
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    ">
                                                SGPA
                                            </th>

                                            <th className="
                                        px-5
                                        py-4
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    ">
                                                Status
                                            </th>

                                            <th className="
                                        px-5
                                        py-4
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    ">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="
                                divide-y
                                divide-slate-100
                            ">

                                        {filteredResults.map(
                                            (result) => {

                                                const status =
                                                    getStatus(
                                                        result.resultStatus
                                                    );

                                                return (
                                                    <tr
                                                        key={result.id}
                                                        className="
                                                    hover:bg-slate-50
                                                    transition
                                                "
                                                    >

                                                        {/* STUDENT */}

                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <div>
                                                                <p className="
                                                            text-sm
                                                            font-bold
                                                            text-slate-800
                                                        ">
                                                                    {result.studentName ||
                                                                        "N/A"}
                                                                </p>

                                                                <p className="
                                                            text-xs
                                                            text-slate-500
                                                            mt-1
                                                        ">
                                                                    Roll No:{" "}
                                                                    {result.rollNo ||
                                                                        "N/A"}
                                                                </p>
                                                            </div>

                                                        </td>


                                                        {/* DEPARTMENT */}

                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <p className="
                                                        text-sm
                                                        text-slate-700
                                                        font-medium
                                                    ">
                                                                {result.departmentName ||
                                                                    "N/A"}
                                                            </p>

                                                            <p className="
                                                        text-xs
                                                        text-slate-400
                                                        mt-1
                                                    ">
                                                                {result.courseName ||
                                                                    ""}
                                                            </p>

                                                        </td>


                                                        {/* SEMESTER */}

                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <span className="
                                                        inline-flex
                                                        items-center
                                                        px-2.5
                                                        py-1
                                                        rounded-lg
                                                        bg-indigo-50
                                                        text-indigo-700
                                                        text-xs
                                                        font-semibold
                                                    ">
                                                                {result.semesterName ||
                                                                    "N/A"}
                                                            </span>

                                                        </td>


                                                        {/* MARKS */}

                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <p className="
                                                        text-sm
                                                        font-bold
                                                        text-slate-800
                                                    ">
                                                                {result.obtainedMarks ??
                                                                    0}
                                                                {" / "}
                                                                {result.totalMarks ??
                                                                    0}
                                                            </p>

                                                        </td>


                                                        {/* PERCENTAGE */}

                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <span className="
                                                        text-sm
                                                        font-bold
                                                        text-slate-700
                                                    ">
                                                                {result.percentage !=
                                                                    null
                                                                    ? `${Number(
                                                                        result.percentage
                                                                    ).toFixed(
                                                                        2
                                                                    )}%`
                                                                    : "—"}
                                                            </span>

                                                        </td>


                                                        {/* SGPA */}

                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <span className="
                                                        text-sm
                                                        font-bold
                                                        text-indigo-600
                                                    ">
                                                                {result.sgpa !=
                                                                    null
                                                                    ? Number(
                                                                        result.sgpa
                                                                    ).toFixed(
                                                                        2
                                                                    )
                                                                    : "—"}
                                                            </span>

                                                        </td>


                                                        {/* STATUS */}

                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <span
                                                                className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            px-2.5
                                                            py-1
                                                            rounded-full
                                                            border
                                                            text-xs
                                                            font-bold
                                                            ${status.className}
                                                        `}
                                                            >
                                                                {status.icon}

                                                                {result.resultStatus ||
                                                                    "N/A"}
                                                            </span>

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    ">

                                                                {/* VIEW */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleView(
                                                                            result
                                                                        )
                                                                    }
                                                                    className="
                                                                h-9
                                                                w-9
                                                                rounded-lg
                                                                bg-indigo-50
                                                                text-indigo-600
                                                                hover:bg-indigo-100
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                                    title="View Result"
                                                                >
                                                                    <Eye
                                                                        size={16}
                                                                    />
                                                                </button>


                                                                {/* MARKSHEET */}

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        downloadingId ===
                                                                        result.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleMarksheet(
                                                                            result
                                                                        )
                                                                    }
                                                                    className="
                                                                h-9
                                                                w-9
                                                                rounded-lg
                                                                bg-emerald-50
                                                                text-emerald-600
                                                                hover:bg-emerald-100
                                                                flex
                                                                items-center
                                                                justify-center
                                                                disabled:opacity-50
                                                            "
                                                                    title="View Marksheet"
                                                                >
                                                                    {downloadingId ===
                                                                        result.id ? (
                                                                        <RefreshCw
                                                                            size={16}
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <FileText
                                                                            size={16}
                                                                        />
                                                                    )}
                                                                </button>


                                                                {/* DELETE */}

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        deletingId ===
                                                                        result.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleDeleteClick(
                                                                            result
                                                                        )
                                                                    }
                                                                    className="
                                                                h-9
                                                                w-9
                                                                rounded-lg
                                                                bg-red-50
                                                                text-red-500
                                                                hover:bg-red-100
                                                                flex
                                                                items-center
                                                                justify-center
                                                                disabled:opacity-50
                                                            "
                                                                    title="Delete Result"
                                                                >
                                                                    <Trash2
                                                                        size={16}
                                                                    />
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>


                    {/* =====================================================
                VIEW RESULT MODAL
            ===================================================== */}

                    {showViewModal && selectedResult && (

                        <div
                            className="
                        fixed
                        inset-0
                        z-[100]
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
                                    setShowViewModal(false);
                                    setSelectedResult(null);
                                }

                            }}
                        >

                            <div className="
                        w-full
                        max-w-4xl
                        max-h-[90vh]
                        bg-white
                        rounded-2xl
                        shadow-2xl
                        overflow-hidden
                        flex
                        flex-col
                    ">

                                {/* HEADER */}

                                <div className="
                            px-5
                            py-4
                            border-b
                            border-slate-200
                            flex
                            items-center
                            justify-between
                        ">

                                    <div>
                                        <h2 className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                ">
                                            Result Details
                                        </h2>

                                        <p className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                ">
                                            {selectedResult.studentName}
                                            {" • "}
                                            {selectedResult.semesterName}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowViewModal(false);
                                            setSelectedResult(null);
                                        }}
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

                                <div className="
                            overflow-y-auto
                            p-5
                        ">

                                    {/* SUMMARY */}

                                    <div className="
                                grid
                                grid-cols-2
                                md:grid-cols-4
                                gap-3
                                mb-5
                            ">

                                        <div className="
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                    p-4
                                ">
                                            <p className="
                                        text-xs
                                        text-slate-500
                                    ">
                                                Total Marks
                                            </p>

                                            <p className="
                                        text-xl
                                        font-bold
                                        text-slate-800
                                        mt-1
                                    ">
                                                {selectedResult.totalMarks ??
                                                    0}
                                            </p>
                                        </div>

                                        <div className="
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                    p-4
                                ">
                                            <p className="
                                        text-xs
                                        text-slate-500
                                    ">
                                                Obtained
                                            </p>

                                            <p className="
                                        text-xl
                                        font-bold
                                        text-indigo-600
                                        mt-1
                                    ">
                                                {selectedResult.obtainedMarks ??
                                                    0}
                                            </p>
                                        </div>

                                        <div className="
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                    p-4
                                ">
                                            <p className="
                                        text-xs
                                        text-slate-500
                                    ">
                                                Percentage
                                            </p>

                                            <p className="
                                        text-xl
                                        font-bold
                                        text-slate-800
                                        mt-1
                                    ">
                                                {selectedResult.percentage !=
                                                    null
                                                    ? `${Number(
                                                        selectedResult.percentage
                                                    ).toFixed(2)}%`
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div className="
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                    p-4
                                ">
                                            <p className="
                                        text-xs
                                        text-slate-500
                                    ">
                                                SGPA
                                            </p>

                                            <p className="
                                        text-xl
                                        font-bold
                                        text-indigo-600
                                        mt-1
                                    ">
                                                {selectedResult.sgpa !=
                                                    null
                                                    ? Number(
                                                        selectedResult.sgpa
                                                    ).toFixed(2)
                                                    : "—"}
                                            </p>
                                        </div>

                                    </div>


                                    {/* STUDENT INFO */}

                                    <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-4
                                mb-6
                            ">

                                        <div>
                                            <p className="
                                        text-xs
                                        text-slate-400
                                        mb-1
                                    ">
                                                Student
                                            </p>

                                            <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                                {selectedResult.studentName ||
                                                    "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="
                                        text-xs
                                        text-slate-400
                                        mb-1
                                    ">
                                                Roll Number
                                            </p>

                                            <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                                {selectedResult.rollNo ||
                                                    "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="
                                        text-xs
                                        text-slate-400
                                        mb-1
                                    ">
                                                Department
                                            </p>

                                            <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                                {selectedResult.departmentName ||
                                                    "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="
                                        text-xs
                                        text-slate-400
                                        mb-1
                                    ">
                                                Semester
                                            </p>

                                            <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                                {selectedResult.semesterName ||
                                                    "N/A"}
                                            </p>
                                        </div>

                                    </div>


                                    {/* SUBJECT TABLE */}

                                    <div>

                                        <h3 className="
                                    text-sm
                                    font-bold
                                    text-slate-700
                                    mb-3
                                ">
                                            Subject-wise Marks
                                        </h3>

                                        {selectedResult.subjects?.length >
                                            0 ? (

                                            <div className="
                                        border
                                        border-slate-200
                                        rounded-xl
                                        overflow-x-auto
                                    ">

                                                <table className="
                                            w-full
                                            min-w-[750px]
                                            text-left
                                        ">

                                                    <thead className="
                                                bg-slate-50
                                                border-b
                                                border-slate-200
                                            ">
                                                        <tr>

                                                            <th className="
                                                        px-4
                                                        py-3
                                                        text-xs
                                                        font-bold
                                                        text-slate-500
                                                    ">
                                                                Subject
                                                            </th>

                                                            <th className="
                                                        px-4
                                                        py-3
                                                        text-xs
                                                        font-bold
                                                        text-slate-500
                                                    ">
                                                                Credits
                                                            </th>

                                                            <th className="
                                                        px-4
                                                        py-3
                                                        text-xs
                                                        font-bold
                                                        text-slate-500
                                                    ">
                                                                Marks
                                                            </th>

                                                            <th className="
                                                        px-4
                                                        py-3
                                                        text-xs
                                                        font-bold
                                                        text-slate-500
                                                    ">
                                                                %
                                                            </th>

                                                            <th className="
                                                        px-4
                                                        py-3
                                                        text-xs
                                                        font-bold
                                                        text-slate-500
                                                    ">
                                                                Grade
                                                            </th>

                                                            <th className="
                                                        px-4
                                                        py-3
                                                        text-xs
                                                        font-bold
                                                        text-slate-500
                                                    ">
                                                                Grade Point
                                                            </th>

                                                        </tr>
                                                    </thead>

                                                    <tbody className="
                                                divide-y
                                                divide-slate-100
                                            ">

                                                        {selectedResult.subjects.map(
                                                            (subject) => (
                                                                <tr
                                                                    key={
                                                                        subject.resultSubjectId ||
                                                                        subject.subjectId
                                                                    }
                                                                >

                                                                    <td className="
                                                                px-4
                                                                py-3
                                                            ">
                                                                        <p className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-700
                                                                ">
                                                                            {
                                                                                subject.subjectName
                                                                            }
                                                                        </p>

                                                                        <p className="
                                                                    text-xs
                                                                    text-slate-400
                                                                    mt-0.5
                                                                ">
                                                                            {
                                                                                subject.subjectCode
                                                                            }
                                                                        </p>
                                                                    </td>

                                                                    <td className="
                                                                px-4
                                                                py-3
                                                                text-sm
                                                                text-slate-600
                                                            ">
                                                                        {
                                                                            subject.credits ??
                                                                            "—"
                                                                        }
                                                                    </td>

                                                                    <td className="
                                                                px-4
                                                                py-3
                                                                text-sm
                                                                font-semibold
                                                                text-slate-700
                                                            ">
                                                                        {
                                                                            subject.obtainedMarks ??
                                                                            0
                                                                        }
                                                                        {" / "}
                                                                        {
                                                                            subject.totalMarks ??
                                                                            0
                                                                        }
                                                                    </td>

                                                                    <td className="
                                                                px-4
                                                                py-3
                                                                text-sm
                                                                text-slate-600
                                                            ">
                                                                        {subject.percentage !=
                                                                            null
                                                                            ? `${Number(
                                                                                subject.percentage
                                                                            ).toFixed(
                                                                                2
                                                                            )}%`
                                                                            : "—"}
                                                                    </td>

                                                                    <td className="
                                                                px-4
                                                                py-3
                                                            ">
                                                                        <span className="
                                                                    px-2.5
                                                                    py-1
                                                                    rounded-lg
                                                                    bg-indigo-50
                                                                    text-indigo-700
                                                                    text-xs
                                                                    font-bold
                                                                ">
                                                                            {
                                                                                subject.grade
                                                                            }
                                                                        </span>
                                                                    </td>

                                                                    <td className="
                                                                px-4
                                                                py-3
                                                                text-sm
                                                                font-bold
                                                                text-indigo-600
                                                            ">
                                                                        {
                                                                            subject.gradePoint ??
                                                                            "—"
                                                                        }
                                                                    </td>

                                                                </tr>
                                                            )
                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        ) : (

                                            <div className="
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-6
                                        text-center
                                        text-sm
                                        text-slate-500
                                    ">
                                                No subject details available.
                                            </div>

                                        )}

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="
                            px-5
                            py-4
                            border-t
                            border-slate-200
                            flex
                            flex-col-reverse
                            sm:flex-row
                            sm:justify-end
                            gap-3
                        ">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowViewModal(false);
                                            setSelectedResult(null);
                                        }}
                                        className="
                                    h-10
                                    px-5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    hover:bg-slate-50
                                    text-sm
                                    font-semibold
                                    text-slate-600
                                "
                                    >
                                        Close
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            downloadingId ===
                                            selectedResult.id
                                        }
                                        onClick={() =>
                                            handleMarksheet(
                                                selectedResult
                                            )
                                        }
                                        className="
                                    h-10
                                    px-5
                                    rounded-xl
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    text-white
                                    text-sm
                                    font-semibold
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    disabled:opacity-50
                                "
                                    >

                                        {downloadingId ===
                                            selectedResult.id ? (
                                            <>
                                                <RefreshCw
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <FileText size={16} />
                                                View Marksheet
                                            </>
                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* =====================================================
                DELETE MODAL
            ===================================================== */}

                    {showDeleteModal &&
                        selectedResult && (

                            <div
                                className="
                            fixed
                            inset-0
                            z-[110]
                            bg-slate-900/50
                            backdrop-blur-[2px]
                            flex
                            items-center
                            justify-center
                            p-4
                        "
                                onMouseDown={(e) => {

                                    if (
                                        e.target ===
                                        e.currentTarget &&
                                        !deletingId
                                    ) {
                                        setShowDeleteModal(
                                            false
                                        );
                                        setSelectedResult(
                                            null
                                        );
                                    }

                                }}
                            >

                                <div className="
                            w-full
                            max-w-md
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            overflow-hidden
                        ">

                                    <div className="
                                p-5
                            ">

                                        <div className="
                                    h-12
                                    w-12
                                    rounded-xl
                                    bg-red-50
                                    text-red-500
                                    flex
                                    items-center
                                    justify-center
                                    mb-4
                                ">
                                            <Trash2 size={22} />
                                        </div>

                                        <h2 className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                ">
                                            Delete Result?
                                        </h2>

                                        <p className="
                                    text-sm
                                    text-slate-500
                                    mt-2
                                    leading-6
                                ">
                                            Are you sure you want to
                                            delete the result of{" "}
                                            <span className="
                                        font-semibold
                                        text-slate-700
                                    ">
                                                {selectedResult.studentName}
                                            </span>{" "}
                                            for{" "}
                                            <span className="
                                        font-semibold
                                        text-slate-700
                                    ">
                                                {selectedResult.semesterName}
                                            </span>
                                            ? This action cannot be
                                            undone.
                                        </p>

                                    </div>


                                    <div className="
                                px-5
                                py-4
                                bg-slate-50
                                border-t
                                border-slate-200
                                flex
                                flex-col-reverse
                                sm:flex-row
                                sm:justify-end
                                gap-3
                            ">

                                        <button
                                            type="button"
                                            disabled={!!deletingId}
                                            onClick={() => {
                                                setShowDeleteModal(
                                                    false
                                                );
                                                setSelectedResult(
                                                    null
                                                );
                                            }}
                                            className="
                                        h-10
                                        px-5
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        hover:bg-slate-50
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        disabled:opacity-50
                                    "
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            disabled={!!deletingId}
                                            onClick={
                                                handleDelete
                                            }
                                            className="
                                        h-10
                                        px-5
                                        rounded-xl
                                        bg-red-600
                                        hover:bg-red-700
                                        text-white
                                        text-sm
                                        font-semibold
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        disabled:opacity-50
                                    "
                                        >

                                            {deletingId ? (
                                                <>
                                                    <RefreshCw
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2
                                                        size={16}
                                                    />
                                                    Delete Result
                                                </>
                                            )}

                                        </button>

                                    </div>

                                </div>

                            </div>
                        )}

                </div>
            </main>
        </div>
    );
};

export default AdminResult;