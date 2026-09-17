import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Users,
    ChevronLeft,
    ChevronRight,
    Loader2,
    UserRound,
} from "lucide-react";

import { toast } from "react-toastify";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import TeacherFormModal from "../../components/admin/TeacherFormModal";

import adminTeacherService from "../../services/adminTeacherService";
import adminDepartmentService from "../../services/adminDepartmentService";


const PAGE_SIZE = 10;


const AdminTeachers = () => {

    // =====================================================
    // SIDEBAR
    // =====================================================

    const [collapsed, setCollapsed] = useState(false);

    const [mobileOpen, setMobileOpen] = useState(false);


    // =====================================================
    // TEACHERS
    // =====================================================

    const [teachers, setTeachers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);


    // =====================================================
    // SEARCH / FILTER
    // =====================================================

    const [search, setSearch] = useState("");

    const [departmentFilter, setDepartmentFilter] =
        useState("");


    // =====================================================
    // DEPARTMENTS
    // =====================================================

    const [departments, setDepartments] = useState([]);


    // =====================================================
    // MODAL
    // =====================================================

    const [showModal, setShowModal] = useState(false);

    const [editingTeacher, setEditingTeacher] =
        useState(null);


    // =====================================================
    // MESSAGE
    // =====================================================

    const [message, setMessage] = useState(null);


    // =====================================================
    // LOAD DEPARTMENTS
    // =====================================================

    useEffect(() => {

        loadDepartments();

    }, []);


    const loadDepartments = async () => {

        try {

            const response =
                await adminDepartmentService.getAllDepartments();

            console.log(
                "Admin Departments API:",
                response
            );

            const data =
                response?.data;

            if (Array.isArray(data)) {

                setDepartments(data);

            } else if (
                Array.isArray(data?.content)
            ) {

                setDepartments(
                    data.content
                );

            } else {

                setDepartments([]);

            }

        } catch (error) {

            console.error(
                "Load departments error:",
                error
            );

            setDepartments([]);

        }

    };


    // =====================================================
    // LOAD TEACHERS
    // =====================================================

    useEffect(() => {

        loadTeachers();

    }, [currentPage]);


    const loadTeachers = async () => {

        setLoading(true);

        try {

            const response =
                await adminTeacherService.getTeachers(
                    currentPage,
                    PAGE_SIZE
                );

            console.log(
                "Admin Teachers API:",
                response
            );

            const pageData =
                response?.data;

            setTeachers(
                Array.isArray(
                    pageData?.content
                )
                    ? pageData.content
                    : []
            );

            setTotalPages(
                pageData?.totalPages || 0
            );

            setTotalElements(
                pageData?.totalElements || 0
            );

        } catch (error) {

            console.error(
                "Load teachers error:",
                error
            );

            setTeachers([]);

            setTotalPages(0);

            setTotalElements(0);

            showMessage(
                "Failed to load teachers.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEARCH + DEPARTMENT FILTER
    // =====================================================

    const filteredTeachers = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();

        return teachers.filter((teacher) => {

            const matchesSearch =
                !searchValue ||
                teacher.teacherCode
                    ?.toLowerCase()
                    .includes(searchValue) ||
                teacher.firstName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                teacher.lastName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                teacher.email
                    ?.toLowerCase()
                    .includes(searchValue) ||
                teacher.username
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesDepartment =
                !departmentFilter ||
                String(
                    teacher.departmentId
                ) === String(
                    departmentFilter
                );

            return (
                matchesSearch &&
                matchesDepartment
            );

        });

    }, [
        teachers,
        search,
        departmentFilter,
    ]);


    // =====================================================
    // MESSAGE
    // =====================================================

    const showMessage = (
        text,
        type = "success"
    ) => {

        setMessage({
            text,
            type,
        });

        setTimeout(() => {

            setMessage(null);

        }, 3000);

    };


    // =====================================================
    // ADD TEACHER
    // =====================================================

    const handleAdd = () => {

        setEditingTeacher(null);

        setShowModal(true);

    };


    // =====================================================
    // EDIT TEACHER
    // =====================================================

    const handleEdit = async (teacher) => {

        try {

            setLoading(true);

            const response =
                await adminTeacherService
                    .getTeacherById(
                        teacher.id
                    );

            setEditingTeacher(
                response?.data || teacher
            );

            setShowModal(true);

        } catch (error) {

            console.error(
                "Get teacher error:",
                error
            );

            showMessage(
                "Unable to load teacher details.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SAVE TEACHER
    // =====================================================

    const handleSubmit = async (formData) => {
        setSaving(true);

        try {
            let response;

            if (editingTeacher) {
                response =
                    await adminTeacherService.updateTeacher(
                        editingTeacher.id,
                        formData
                    );
            } else {
                response =
                    await adminTeacherService.addTeacher(
                        formData
                    );
            }

            // ==========================================
            // GET BACKEND RESPONSE
            // ==========================================

            const responseData = response?.data;

            const successMessage =
                responseData?.message ||
                (
                    editingTeacher
                        ? "Teacher updated successfully."
                        : "Teacher added successfully."
                );

            // ==========================================
            // SUCCESS TOAST
            // ==========================================

            toast.success(successMessage);

            // ==========================================
            // UPDATE TABLE DIRECTLY
            // ==========================================

            if (editingTeacher) {

                const updatedTeacher =
                    responseData?.data;

                if (updatedTeacher) {

                    setTeachers((prevTeachers) =>
                        prevTeachers.map((teacher) =>
                            teacher.id === editingTeacher.id
                                ? updatedTeacher
                                : teacher
                        )
                    );
                }

            } else {

                // New teacher added
                await loadTeachers();
            }

            // ==========================================
            // CLOSE MODAL
            // ==========================================

            setShowModal(false);
            setEditingTeacher(null);

        } catch (error) {

            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Something went wrong. Please try again.";

            toast.error(errorMessage);

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // DELETE TEACHER
    // =====================================================

    const handleDelete = async (teacher) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`
            );

        if (!confirmed) {
            return;
        }

        setDeletingId(teacher.id);

        try {

            await adminTeacherService
                .deleteTeacher(
                    teacher.id
                );

            showMessage(
                "Teacher deleted successfully."
            );

            // If last item on a page was deleted
            if (
                teachers.length === 1 &&
                currentPage > 0
            ) {

                setCurrentPage(
                    currentPage - 1
                );

            } else {

                await loadTeachers();

            }

        } catch (error) {

            console.error(
                "Delete teacher error:",
                error
            );

            const backendMessage =
                error?.response?.data?.message ||
                "Unable to delete teacher.";

            showMessage(
                backendMessage,
                "error"
            );

        } finally {

            setDeletingId(null);

        }

    };


    // =====================================================
    // DEPARTMENT NAME
    // =====================================================

    const getDepartmentName = (
        teacher
    ) => {

        if (
            teacher.departmentName
        ) {
            return teacher.departmentName;
        }

        const department =
            departments.find(
                (item) =>
                    String(item.id) ===
                    String(
                        teacher.departmentId
                    )
            );

        return (
            department?.name ||
            department?.departmentName ||
            "—"
        );

    };


    // =====================================================
    // PAGE RANGE
    // =====================================================

    const startRecord =
        totalElements === 0
            ? 0
            : currentPage * PAGE_SIZE + 1;

    const endRecord =
        Math.min(
            (currentPage + 1) *
            PAGE_SIZE,
            totalElements
        );


    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const pageNumbers = [];

    for (
        let i = 0;
        i < totalPages;
        i++
    ) {

        pageNumbers.push(i);

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <AdminSidebar
                activePage="Teachers"
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                setActivePage={() => { }}
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
        pt-[72px]
        min-h-screen
        w-full
        min-w-0
        overflow-x-hidden
        transition-all
        duration-300

        ${collapsed
                        ? "md:ml-[76px] md:w-[calc(100%-76px)]"
                        : "md:ml-[260px] md:w-[calc(100%-260px)]"
                    }
    `}
            >

                <div className="p-6 md:p-8">

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
                                        bg-indigo-50
                                        text-indigo-600
                                    "
                                >
                                    <Users
                                        size={22}
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
                                        Teachers
                                    </h1>

                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        Manage faculty
                                        members and
                                        their accounts.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <button
                            onClick={handleAdd}
                            className="
                                flex
                                h-11
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-indigo-600
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-indigo-700
                            "
                        >
                            <Plus size={18} />

                            Add Teacher
                        </button>

                    </div>


                    {/* =================================================
                        MESSAGE
                    ================================================= */}

                    {message && (

                        <div
                            className={`
                                mb-5
                                rounded-xl
                                border
                                px-4
                                py-3
                                text-sm
                                font-medium
                                ${message.type ===
                                    "error"
                                    ? "border-red-200 bg-red-50 text-red-600"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-600"
                                }
                            `}
                        >
                            {message.text}
                        </div>

                    )}


                    {/* =================================================
                        SEARCH / FILTER
                    ================================================= */}

                    <div
                        className="
                            mb-5
                            flex
                            flex-col
                            gap-3
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                            sm:flex-row
                        "
                    >

                        {/* SEARCH */}

                        <div
                            className="
                                flex
                                h-11
                                flex-1
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-3
                            "
                        >

                            <Search
                                size={18}
                                className="
                                    shrink-0
                                    text-slate-400
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search Teacher..."
                                className="
                                    min-w-0
                                    flex-1
                                    bg-transparent
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    placeholder:text-slate-400
                                "
                            />

                        </div>


                        {/* DEPARTMENT */}

                        <select
                            value={
                                departmentFilter
                            }
                            onChange={(e) => {

                                setDepartmentFilter(
                                    e.target.value
                                );

                            }}
                            className="
                                h-11
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-sm
                                text-slate-600
                                outline-none
                                focus:border-indigo-500
                            "
                        >

                            <option value="">
                                All Departments
                            </option>

                            {departments.map(
                                (department) => (

                                    <option
                                        key={
                                            department.id
                                        }
                                        value={
                                            department.id
                                        }
                                    >
                                        {
                                            department.name ||
                                            department.departmentName
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =================================================
                        TABLE
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

                        <div className="overflow-x-auto">

                            <table
                                className="
                                    w-full
                                    min-w-[950px]
                                "
                            >

                                <thead>

                                    <tr
                                        className="
                                            border-b
                                            border-slate-200
                                            bg-slate-50
                                        "
                                    >

                                        <th
                                            className="
                                                px-5
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            Teacher
                                        </th>

                                        <th
                                            className="
                                                px-5
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            Code
                                        </th>

                                        <th
                                            className="
                                                px-5
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            Department
                                        </th>

                                        <th
                                            className="
                                                px-5
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            Designation
                                        </th>

                                        <th
                                            className="
                                                px-5
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            Experience
                                        </th>

                                        <th
                                            className="
                                                px-5
                                                py-4
                                                text-right
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {/* LOADING */}

                                    {loading && (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="
                                                    py-16
                                                    text-center
                                                "
                                            >

                                                <Loader2
                                                    size={28}
                                                    className="
                                                        mx-auto
                                                        animate-spin
                                                        text-indigo-600
                                                    "
                                                />

                                                <p
                                                    className="
                                                        mt-3
                                                        text-sm
                                                        text-slate-500
                                                    "
                                                >
                                                    Loading
                                                    teachers...
                                                </p>

                                            </td>

                                        </tr>

                                    )}


                                    {/* EMPTY */}

                                    {!loading &&
                                        filteredTeachers.length ===
                                        0 && (

                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="
                                                        py-16
                                                        text-center
                                                    "
                                                >

                                                    <UserRound
                                                        size={36}
                                                        className="
                                                            mx-auto
                                                            text-slate-300
                                                        "
                                                    />

                                                    <p
                                                        className="
                                                            mt-3
                                                            font-medium
                                                            text-slate-600
                                                        "
                                                    >
                                                        No teachers
                                                        found
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-slate-400
                                                        "
                                                    >
                                                        Try changing
                                                        your search
                                                        or filter.
                                                    </p>

                                                </td>

                                            </tr>

                                        )}


                                    {/* TEACHERS */}

                                    {!loading &&
                                        filteredTeachers.map(
                                            (teacher) => (

                                                <tr
                                                    key={
                                                        teacher.id
                                                    }
                                                    className="
                                                        border-b
                                                        border-slate-100
                                                        transition
                                                        hover:bg-slate-50
                                                    "
                                                >

                                                    {/* TEACHER */}

                                                    <td className="px-5 py-4">

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
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-indigo-50
                                                                    font-semibold
                                                                    text-indigo-600
                                                                "
                                                            >

                                                                {teacher.firstName
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase()}

                                                            </div>

                                                            <div>

                                                                <p
                                                                    className="
                                                                        text-sm
                                                                        font-semibold
                                                                        text-slate-700
                                                                    "
                                                                >
                                                                    {
                                                                        teacher.firstName
                                                                    }{" "}
                                                                    {
                                                                        teacher.lastName
                                                                    }
                                                                </p>

                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        text-slate-400
                                                                    "
                                                                >
                                                                    {
                                                                        teacher.email
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CODE */}

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className="
                                                                rounded-lg
                                                                bg-slate-100
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                text-slate-600
                                                            "
                                                        >
                                                            {
                                                                teacher.teacherCode
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* DEPARTMENT */}

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className="
                                                                text-sm
                                                                text-slate-600
                                                            "
                                                        >
                                                            {
                                                                getDepartmentName(
                                                                    teacher
                                                                )
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* DESIGNATION */}

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className="
                                                                text-sm
                                                                text-slate-600
                                                            "
                                                        >
                                                            {
                                                                teacher.designation ||
                                                                "—"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* EXPERIENCE */}

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className="
                                                                text-sm
                                                                text-slate-600
                                                            "
                                                        >
                                                            {
                                                                teacher.experience ??
                                                                0
                                                            }{" "}
                                                            years
                                                        </span>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td className="px-5 py-4">

                                                        <div
                                                            className="
                                                                flex
                                                                justify-end
                                                                gap-2
                                                            "
                                                        >

                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        teacher
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    text-slate-500
                                                                    hover:bg-indigo-50
                                                                    hover:text-indigo-600
                                                                "
                                                                title="Edit Teacher"
                                                            >
                                                                <Edit3
                                                                    size={17}
                                                                />
                                                            </button>


                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        teacher
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    teacher.id
                                                                }
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    text-slate-500
                                                                    hover:bg-red-50
                                                                    hover:text-red-600
                                                                    disabled:opacity-50
                                                                "
                                                                title="Delete Teacher"
                                                            >

                                                                {deletingId ===
                                                                    teacher.id ? (
                                                                    <Loader2
                                                                        size={
                                                                            17
                                                                        }
                                                                        className="
                                                                            animate-spin
                                                                        "
                                                                    />
                                                                ) : (
                                                                    <Trash2
                                                                        size={
                                                                            17
                                                                        }
                                                                    />
                                                                )}

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                border-t
                                border-slate-200
                                px-5
                                py-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Showing{" "}
                                <span
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    {startRecord}
                                </span>
                                {" - "}
                                <span
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    {endRecord}
                                </span>
                                {" "}of{" "}
                                <span
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    {totalElements}
                                </span>
                            </p>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                "
                            >

                                {/* PREVIOUS */}

                                <button
                                    disabled={
                                        currentPage ===
                                        0 ||
                                        loading
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (prev) =>
                                                Math.max(
                                                    0,
                                                    prev - 1
                                                )
                                        )
                                    }
                                    className="
                                        flex
                                        h-9
                                        items-center
                                        gap-1
                                        rounded-lg
                                        border
                                        border-slate-200
                                        px-3
                                        text-sm
                                        text-slate-600
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >

                                    <ChevronLeft
                                        size={16}
                                    />

                                    <span className="hidden sm:inline">
                                        Previous
                                    </span>

                                </button>


                                {/* PAGE NUMBERS */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >

                                    {pageNumbers.map(
                                        (page) => (

                                            <button
                                                key={page}
                                                onClick={() =>
                                                    setCurrentPage(
                                                        page
                                                    )
                                                }
                                                className={`
                                                    h-9
                                                    min-w-9
                                                    rounded-lg
                                                    px-2
                                                    text-sm
                                                    font-medium
                                                    ${currentPage ===
                                                        page
                                                        ? "bg-indigo-600 text-white"
                                                        : "text-slate-600 hover:bg-slate-100"
                                                    }
                                                `}
                                            >
                                                {page + 1}
                                            </button>

                                        )
                                    )}

                                </div>


                                {/* NEXT */}

                                <button
                                    disabled={
                                        currentPage >=
                                        totalPages -
                                        1 ||
                                        loading ||
                                        totalPages ===
                                        0
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (prev) =>
                                                prev + 1
                                        )
                                    }
                                    className="
                                        flex
                                        h-9
                                        items-center
                                        gap-1
                                        rounded-lg
                                        border
                                        border-slate-200
                                        px-3
                                        text-sm
                                        text-slate-600
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >

                                    <span className="hidden sm:inline">
                                        Next
                                    </span>

                                    <ChevronRight
                                        size={16}
                                    />

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </main>


            {/* =================================================
                TEACHER MODAL
            ================================================= */}

            <TeacherFormModal
                isOpen={showModal}
                onClose={() => {

                    if (!saving) {

                        setShowModal(false);

                        setEditingTeacher(
                            null
                        );

                    }

                }}
                onSubmit={
                    handleSubmit
                }
                editingTeacher={
                    editingTeacher
                }
                departments={
                    departments
                }
                loading={
                    saving
                }
            />

        </div>
    );
};


export default AdminTeachers;