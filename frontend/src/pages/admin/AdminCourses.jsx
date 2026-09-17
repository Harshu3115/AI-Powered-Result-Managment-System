import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    RefreshCcw,
    Pencil,
    Trash2,
    X,
    BookOpen,
    Building2,
    Clock3,
} from "lucide-react";
import { toast } from "react-toastify";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

import adminCourseService from "../../services/adminCourseService";
import adminDepartmentService from "../../services/adminDepartmentService";

const AdminCourses = () => {

    // =====================================================
    // SIDEBAR
    // =====================================================

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // =====================================================
    // DATA
    // =====================================================

    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(false);

    // =====================================================
    // SEARCH / FILTER
    // =====================================================

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] =
        useState("ALL");

    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage, setCoursesPerPage] =
        useState(10);

    // =====================================================
    // MODAL
    // =====================================================

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [editingCourse, setEditingCourse] =
        useState(null);

    const [deletingCourse, setDeletingCourse] =
        useState(null);

    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] = useState({
        courseCode: "",
        courseName: "",
        duration: "",
        description: "",
        departmentId: "",
    });

    // =====================================================
    // LOAD COURSES
    // =====================================================

    const loadCourses = async () => {

        try {

            setLoading(true);

            const response =
                await adminCourseService.getAllCourses();

            console.log("COURSE API:", response);

            const courseList =
                Array.isArray(response?.data)
                    ? response.data
                    : [];

            setCourses(courseList);

        } catch (error) {

            console.error(
                "Failed to load courses:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load courses."
            );

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
                await adminDepartmentService
                    .getAllDepartments();

            console.log(
                "DEPARTMENT API:",
                response
            );

            const departmentList =
                Array.isArray(response?.data)
                    ? response.data
                    : [];

            setDepartments(departmentList);

        } catch (error) {

            console.error(
                "Failed to load departments:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load departments."
            );

        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadCourses();
        loadDepartments();

    }, []);

    // =====================================================
    // FILTER COURSES
    // =====================================================

    const filteredCourses = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return courses.filter((course) => {
            if (!searchValue) {
                return (
                    departmentFilter === "ALL" ||
                    String(course.departmentId) ===
                    String(departmentFilter)
                );
            }

            const searchableText = [
                course.id,
                course.courseCode,
                course.courseName,
                course.departmentName,
                course.description,
                course.duration,
            ]
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined
                )
                .map((value) =>
                    String(value).toLowerCase()
                )
                .join(" ");

            const matchesSearch =
                searchableText.includes(searchValue);

            const matchesDepartment =
                departmentFilter === "ALL" ||
                String(course.departmentId) ===
                String(departmentFilter);

            return (
                matchesSearch &&
                matchesDepartment
            );
        });
    }, [
        courses,
        search,
        departmentFilter,
    ]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        filteredCourses.length /
        coursesPerPage
    );

    const startIndex =
        (currentPage - 1) *
        coursesPerPage;

    const currentCourses =
        filteredCourses.slice(
            startIndex,
            startIndex + coursesPerPage
        );

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // OPEN ADD
    // =====================================================

    const handleAdd = () => {

        setEditingCourse(null);

        setFormData({
            courseCode: "",
            courseName: "",
            duration: "",
            description: "",
            departmentId: "",
        });

        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const handleEdit = (course) => {

        setEditingCourse(course);

        setFormData({
            courseCode:
                course.courseCode || "",

            courseName:
                course.courseName || "",

            duration:
                course.duration ?? "",

            description:
                course.description || "",

            departmentId:
                course.departmentId || "",
        });

        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        if (loading) {
            return;
        }

        setShowModal(false);
        setEditingCourse(null);

        setFormData({
            courseCode: "",
            courseName: "",
            duration: "",
            description: "",
            departmentId: "",
        });
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.courseCode.trim()) {

            toast.error(
                "Course Code is required."
            );

            return;
        }

        if (!formData.courseName.trim()) {

            toast.error(
                "Course Name is required."
            );

            return;
        }

        if (!formData.departmentId) {

            toast.error(
                "Please select a department."
            );

            return;
        }

        if (
            formData.duration === "" ||
            Number(formData.duration) <= 0
        ) {

            toast.error(
                "Please enter a valid duration."
            );

            return;
        }

        const payload = {
            courseCode:
                formData.courseCode.trim(),

            courseName:
                formData.courseName.trim(),

            duration:
                Number(formData.duration),

            description:
                formData.description.trim(),

            departmentId:
                Number(formData.departmentId),
        };

        try {

            setLoading(true);

            let response;

            if (editingCourse) {

                response =
                    await adminCourseService
                        .updateCourse(
                            editingCourse.id,
                            payload
                        );

            } else {

                response =
                    await adminCourseService
                        .addCourse(payload);

            }

            if (response?.success === false) {

                toast.error(
                    response?.message ||
                    "Operation failed."
                );

                return;
            }

            toast.success(
                response?.message ||
                (
                    editingCourse
                        ? "Course Updated Successfully"
                        : "Course Added Successfully"
                )
            );

            closeModal();

            await loadCourses();

        } catch (error) {

            console.error(
                "Course save error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to save course."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // DELETE CONFIRM
    // =====================================================

    const handleDeleteClick = (course) => {

        setDeletingCourse(course);
        setShowDeleteModal(true);
    };

    // =====================================================
    // DELETE COURSE
    // =====================================================

    const handleDelete = async () => {

        if (!deletingCourse) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await adminCourseService
                    .deleteCourse(
                        deletingCourse.id
                    );

            if (response?.success === false) {

                toast.error(
                    response?.message ||
                    "Failed to delete course."
                );

                return;
            }

            toast.success(
                response?.message ||
                "Course Deleted Successfully"
            );

            setShowDeleteModal(false);
            setDeletingCourse(null);

            await loadCourses();

        } catch (error) {

            console.error(
                "Delete course error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete course."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const changePage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);
    };

    // =====================================================
    // SEARCH CHANGE
    // =====================================================

    const handleSearchChange = (e) => {

        setSearch(e.target.value);
        setCurrentPage(1);
    };

    // =====================================================
    // DEPARTMENT FILTER
    // =====================================================

    const handleDepartmentFilter = (e) => {

        setDepartmentFilter(
            e.target.value
        );

        setCurrentPage(1);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <AdminSidebar
                activePage="Courses"
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
                    pt-[72px]
                    min-h-screen
                    transition-all
                    duration-300
                    ml-0
                    ${collapsed
                        ? "lg:ml-[76px]"
                        : "lg:ml-[260px]"
                    }
                `}
            >

                <div className="
                    p-3
                    sm:p-4
                    md:p-6
                    lg:p-8
                ">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                        mb-5
                        sm:mb-7
                    ">

                        <div>

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    h-11
                                    w-11
                                    rounded-xl
                                    bg-indigo-50
                                    text-indigo-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <BookOpen
                                        size={22}
                                    />
                                </div>

                                <div>

                                    <h1 className="
                                        text-xl
                                        sm:text-2xl
                                        font-bold
                                        text-slate-800
                                    ">
                                        Courses
                                    </h1>

                                    <p className="
                                        text-xs
                                        sm:text-sm
                                        text-slate-500
                                        mt-0.5
                                    ">
                                        Manage courses
                                        and their departments
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="
                            flex
                            w-full
                            sm:w-auto
                            gap-2
                        ">

                            <button
                                type="button"
                                disabled={loading}
                                onClick={async () => {
                                    await Promise.all([
                                        loadCourses(),
                                        loadDepartments(),
                                    ]);
                                }}
                                className="
                                    flex-1
                                    sm:flex-none
                                    h-10
                                    px-3
                                    sm:px-4
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-600
                                    text-sm
                                    font-medium
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    hover:bg-slate-50
                                    transition
                                    disabled:opacity-50
                                "
                            >

                                <RefreshCcw
                                    size={16}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                <span>
                                    Refresh
                                </span>

                            </button>

                            <button
                                type="button"
                                onClick={handleAdd}
                                className="
                                    flex-1
                                    sm:flex-none
                                    h-10
                                    px-3
                                    sm:px-4
                                    rounded-xl
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    text-white
                                    text-sm
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    shadow-sm
                                    transition
                                "
                            >

                                <Plus size={18} />

                                <span>
                                    Add Course
                                </span>

                            </button>

                        </div>

                    </div>

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-3
                        sm:gap-5
                        mb-5
                        sm:mb-7
                    ">

                        <div className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-4
                            sm:p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        sm:text-sm
                                        text-slate-500
                                    ">
                                        Total Courses
                                    </p>

                                    <p className="
                                        text-2xl
                                        sm:text-3xl
                                        font-bold
                                        text-slate-800
                                        mt-1
                                    ">
                                        {courses.length}
                                    </p>

                                </div>

                                <div className="
                                    h-10
                                    w-10
                                    rounded-xl
                                    bg-indigo-50
                                    text-indigo-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <BookOpen
                                        size={19}
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-4
                            sm:p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        sm:text-sm
                                        text-slate-500
                                    ">
                                        Departments
                                    </p>

                                    <p className="
                                        text-2xl
                                        sm:text-3xl
                                        font-bold
                                        text-slate-800
                                        mt-1
                                    ">
                                        {departments.length}
                                    </p>

                                </div>

                                <div className="
                                    h-10
                                    w-10
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <Building2
                                        size={19}
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-4
                            sm:p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        sm:text-sm
                                        text-slate-500
                                    ">
                                        Showing
                                    </p>

                                    <p className="
                                        text-2xl
                                        sm:text-3xl
                                        font-bold
                                        text-slate-800
                                        mt-1
                                    ">
                                        {filteredCourses.length}
                                    </p>

                                </div>

                                <div className="
                                    h-10
                                    w-10
                                    rounded-xl
                                    bg-emerald-50
                                    text-emerald-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <Clock3
                                        size={19}
                                    />
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        overflow-hidden
                    ">

                        {/* FILTERS */}

                        <div className="
                            p-3
                            sm:p-4
                            lg:p-5
                            border-b
                            border-slate-200
                        ">

                            <div className="
                                flex
                                flex-col
                                lg:flex-row
                                gap-3
                            ">

                                {/* SEARCH */}
                                <div className="relative w-full lg:flex-1">

                                    <Search
                                        size={18}
                                        className="
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-slate-400
            pointer-events-none
        "
                                    />

                                    <input
                                        type="search"
                                        value={search}
                                        onChange={handleSearchChange}
                                        placeholder="Search courses..."
                                        autoComplete="off"
                                        className="
            h-11
            w-full
            pl-10
            pr-10
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
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
        "
                                    />

                                    {/* CLEAR SEARCH */}
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch("");
                                                setCurrentPage(1);
                                            }}
                                            className="
                absolute
                right-2.5
                top-1/2
                -translate-y-1/2
                h-7
                w-7
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-400
                hover:text-slate-600
                hover:bg-slate-100
                transition
            "
                                            aria-label="Clear search"
                                        >
                                            <X size={15} />
                                        </button>
                                    )}

                                </div>

                                {/* DEPARTMENT */}

                                <select
                                    value={
                                        departmentFilter
                                    }
                                    onChange={
                                        handleDepartmentFilter
                                    }
                                    className="
                                        h-11
                                        w-full
                                        lg:w-[240px]
                                        px-4
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-sm
                                        text-slate-600
                                        outline-none
                                        focus:border-indigo-400
                                    "
                                >

                                    <option value="ALL">
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
                                                    department.departmentName
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="
                            w-full
                            overflow-x-auto
                        ">

                            <table className="
                                w-full
                                min-w-[850px]
                                lg:min-w-full
                            ">

                                <thead>

                                    <tr className="
                                        border-b
                                        border-slate-200
                                        bg-slate-50
                                    ">

                                        <th className="
                                            px-4
                                            sm:px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        ">
                                            #
                                        </th>

                                        <th className="
                                            px-4
                                            sm:px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        ">
                                            COURSE
                                        </th>

                                        <th className="
                                            px-4
                                            sm:px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        ">
                                            CODE
                                        </th>

                                        <th className="
                                            px-4
                                            sm:px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        ">
                                            DEPARTMENT
                                        </th>

                                        <th className="
                                            px-4
                                            sm:px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        ">
                                            DURATION
                                        </th>

                                        <th className="
                                            px-4
                                            sm:px-5
                                            py-4
                                            text-right
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        ">
                                            ACTION
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {loading &&
                                        courses.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="
                                                    px-5
                                                    py-12
                                                    text-center
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >
                                                Loading courses...
                                            </td>

                                        </tr>

                                    ) : currentCourses.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="
                                                    px-5
                                                    py-12
                                                    text-center
                                                "
                                            >

                                                <div className="
                                                    flex
                                                    flex-col
                                                    items-center
                                                    justify-center
                                                ">

                                                    <div className="
                                                        h-12
                                                        w-12
                                                        rounded-full
                                                        bg-slate-100
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-slate-400
                                                    ">
                                                        <BookOpen
                                                            size={22}
                                                        />
                                                    </div>

                                                    <p className="
                                                        mt-3
                                                        text-sm
                                                        font-medium
                                                        text-slate-600
                                                    ">
                                                        No courses found
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-400
                                                    ">
                                                        Try changing your
                                                        search or filter.
                                                    </p>

                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        currentCourses.map(
                                            (course, index) => (

                                                <tr
                                                    key={
                                                        course.id
                                                    }
                                                    className="
                                                        border-b
                                                        border-slate-100
                                                        last:border-0
                                                        hover:bg-slate-50
                                                        transition
                                                    "
                                                >

                                                    <td className="
                                                        px-4
                                                        sm:px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-500
                                                    ">
                                                        {startIndex +
                                                            index +
                                                            1}
                                                    </td>

                                                    <td className="
                                                        px-4
                                                        sm:px-5
                                                        py-4
                                                    ">

                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        ">

                                                            <div className="
                                                                h-10
                                                                w-10
                                                                shrink-0
                                                                rounded-xl
                                                                bg-indigo-50
                                                                text-indigo-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                                font-semibold
                                                            ">
                                                                {course
                                                                    .courseName
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase() ||
                                                                    "C"}
                                                            </div>

                                                            <div>

                                                                <p className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-700
                                                                ">
                                                                    {
                                                                        course.courseName
                                                                    }
                                                                </p>

                                                                <p className="
                                                                    text-xs
                                                                    text-slate-400
                                                                    mt-0.5
                                                                    max-w-[280px]
                                                                    truncate
                                                                ">
                                                                    {
                                                                        course.description ||
                                                                        "No description"
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td className="
                                                        px-4
                                                        sm:px-5
                                                        py-4
                                                    ">

                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            px-2.5
                                                            py-1
                                                            rounded-lg
                                                            bg-slate-100
                                                            text-slate-600
                                                            text-xs
                                                            font-semibold
                                                        ">
                                                            {
                                                                course.courseCode
                                                            }
                                                        </span>

                                                    </td>

                                                    <td className="
                                                        px-4
                                                        sm:px-5
                                                        py-4
                                                    ">

                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        ">

                                                            <Building2
                                                                size={15}
                                                                className="
                                                                    text-slate-400
                                                                "
                                                            />

                                                            <span className="
                                                                text-sm
                                                                text-slate-600
                                                            ">
                                                                {
                                                                    course.departmentName ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="
                                                        px-4
                                                        sm:px-5
                                                        py-4
                                                    ">

                                                        <span className="
                                                            text-sm
                                                            text-slate-600
                                                        ">
                                                            {
                                                                course.duration
                                                            }{" "}
                                                            Years
                                                        </span>

                                                    </td>

                                                    <td className="
                                                        px-4
                                                        sm:px-5
                                                        py-4
                                                    ">

                                                        <div className="
                                                            flex
                                                            justify-end
                                                            items-center
                                                            gap-2
                                                        ">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        course
                                                                    )
                                                                }
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    border
                                                                    border-slate-200
                                                                    text-slate-500
                                                                    hover:text-indigo-600
                                                                    hover:bg-indigo-50
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    transition
                                                                "
                                                                title="Edit"
                                                            >
                                                                <Pencil
                                                                    size={16}
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        course
                                                                    )
                                                                }
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    border
                                                                    border-slate-200
                                                                    text-slate-500
                                                                    hover:text-red-600
                                                                    hover:bg-red-50
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    transition
                                                                "
                                                                title="Delete"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div className="
                            px-3
                            sm:px-5
                            py-4
                            border-t
                            border-slate-200
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                        ">

                            <p className="
                                text-xs
                                sm:text-sm
                                text-slate-500
                            ">

                                Showing{" "}

                                {filteredCourses.length === 0
                                    ? 0
                                    : startIndex + 1}

                                {" "}to{" "}

                                {Math.min(
                                    startIndex +
                                    currentCourses.length,
                                    filteredCourses.length
                                )}

                                {" "}of{" "}

                                {filteredCourses.length}

                                {" "}courses

                            </p>

                            <div className="
                                flex
                                items-center
                                gap-1
                                self-end
                                sm:self-auto
                            ">

                                <button
                                    type="button"
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        changePage(
                                            currentPage - 1
                                        )
                                    }
                                    className="
                                        h-9
                                        px-3
                                        rounded-lg
                                        border
                                        border-slate-200
                                        text-sm
                                        text-slate-500
                                        disabled:opacity-40
                                        hover:bg-slate-50
                                    "
                                >
                                    Previous
                                </button>

                                {Array.from(
                                    {
                                        length:
                                            totalPages,
                                    },
                                    (_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                                changePage(
                                                    index + 1
                                                )
                                            }
                                            className={`
                                                h-9
                                                min-w-9
                                                px-2
                                                rounded-lg
                                                text-sm
                                                font-medium
                                                ${currentPage ===
                                                    index + 1
                                                    ? "bg-indigo-600 text-white"
                                                    : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                                                }
                                            `}
                                        >
                                            {index + 1}
                                        </button>
                                    )
                                )}

                                <button
                                    type="button"
                                    disabled={
                                        currentPage ===
                                        totalPages ||
                                        totalPages === 0
                                    }
                                    onClick={() =>
                                        changePage(
                                            currentPage + 1
                                        )
                                    }
                                    className="
                                        h-9
                                        px-3
                                        rounded-lg
                                        border
                                        border-slate-200
                                        text-sm
                                        text-slate-500
                                        disabled:opacity-40
                                        hover:bg-slate-50
                                    "
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

            {/* =========================================================
                ADD / EDIT MODAL
            ========================================================= */}

            {showModal && (

                <div className="
                    fixed
                    inset-0
                    z-[200]
                    bg-slate-900/40
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    p-3
                    sm:p-5
                ">

                    <div className="
                        w-full
                        max-w-lg
                        max-h-[90vh]
                        overflow-y-auto
                        bg-white
                        rounded-2xl
                        shadow-2xl
                    ">

                        {/* MODAL HEADER */}

                        <div className="
                            px-5
                            sm:px-6
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
                                    {editingCourse
                                        ? "Edit Course"
                                        : "Add Course"}
                                </h2>

                                <p className="
                                    text-xs
                                    text-slate-400
                                    mt-0.5
                                ">
                                    {editingCourse
                                        ? "Update course details"
                                        : "Enter course details"}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
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
                                <X size={19} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="p-5 sm:p-6"
                        >

                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                            ">

                                {/* COURSE CODE */}

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                        mb-1.5
                                    ">
                                        Course Code
                                        <span className="text-red-500">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        name="courseCode"
                                        value={
                                            formData.courseCode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. BCA101"
                                        className="
                                            h-11
                                            w-full
                                            px-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            text-sm
                                            outline-none
                                            focus:border-indigo-400
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                </div>

                                {/* COURSE NAME */}

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                        mb-1.5
                                    ">
                                        Course Name
                                        <span className="text-red-500">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        name="courseName"
                                        value={
                                            formData.courseName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Bachelor of Computer Applications"
                                        className="
                                            h-11
                                            w-full
                                            px-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            text-sm
                                            outline-none
                                            focus:border-indigo-400
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                </div>

                                {/* DEPARTMENT */}

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                        mb-1.5
                                    ">
                                        Department
                                        <span className="text-red-500">
                                            {" "}*
                                        </span>
                                    </label>

                                    <select
                                        name="departmentId"
                                        value={
                                            formData.departmentId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="
                                            h-11
                                            w-full
                                            px-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            text-sm
                                            text-slate-600
                                            outline-none
                                            focus:border-indigo-400
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    >

                                        <option value="">
                                            Select Department
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
                                                        department.departmentName
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                {/* DURATION */}

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                        mb-1.5
                                    ">
                                        Duration
                                        <span className="text-red-500">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="duration"
                                        min="1"
                                        value={
                                            formData.duration
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 3"
                                        className="
                                            h-11
                                            w-full
                                            px-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            text-sm
                                            outline-none
                                            focus:border-indigo-400
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                </div>

                                {/* DESCRIPTION */}

                                <div className="sm:col-span-2">

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                        mb-1.5
                                    ">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={4}
                                        placeholder="Enter course description..."
                                        className="
                                            w-full
                                            px-3
                                            py-2.5
                                            rounded-xl
                                            border
                                            border-slate-200
                                            text-sm
                                            outline-none
                                            resize-none
                                            focus:border-indigo-400
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                </div>

                            </div>

                            {/* BUTTONS */}

                            <div className="
                                flex
                                flex-col-reverse
                                sm:flex-row
                                sm:justify-end
                                gap-2
                                mt-6
                            ">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="
                                        h-11
                                        px-5
                                        rounded-xl
                                        border
                                        border-slate-200
                                        text-sm
                                        font-medium
                                        text-slate-600
                                        hover:bg-slate-50
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        h-11
                                        px-5
                                        rounded-xl
                                        bg-indigo-600
                                        hover:bg-indigo-700
                                        text-white
                                        text-sm
                                        font-semibold
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        disabled:opacity-50
                                    "
                                >

                                    {loading && (
                                        <RefreshCcw
                                            size={16}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingCourse
                                        ? "Update Course"
                                        : "Add Course"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =========================================================
                DELETE MODAL
            ========================================================= */}

            {showDeleteModal && deletingCourse && (

                <div className="
                    fixed
                    inset-0
                    z-[210]
                    bg-slate-900/40
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    p-4
                ">

                    <div className="
                        w-full
                        max-w-md
                        bg-white
                        rounded-2xl
                        shadow-2xl
                        p-5
                        sm:p-6
                    ">

                        <div className="
                            flex
                            items-start
                            gap-4
                        ">

                            <div className="
                                h-11
                                w-11
                                shrink-0
                                rounded-xl
                                bg-red-50
                                text-red-600
                                flex
                                items-center
                                justify-center
                            ">
                                <Trash2
                                    size={20}
                                />
                            </div>

                            <div>

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                ">
                                    Delete Course?
                                </h2>

                                <p className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                ">
                                    Are you sure you want
                                    to delete{" "}
                                    <span className="
                                        font-semibold
                                        text-slate-700
                                    ">
                                        {
                                            deletingCourse.courseName
                                        }
                                    </span>
                                    ?
                                </p>

                                <p className="
                                    text-xs
                                    text-red-500
                                    mt-2
                                ">
                                    This action cannot be
                                    undone.
                                </p>

                            </div>

                        </div>

                        <div className="
                            flex
                            flex-col-reverse
                            sm:flex-row
                            sm:justify-end
                            gap-2
                            mt-6
                        ">

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletingCourse(null);
                                }}
                                className="
                                    h-10
                                    px-5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-50
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleDelete}
                                className="
                                    h-10
                                    px-5
                                    rounded-xl
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    text-sm
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    disabled:opacity-50
                                "
                            >

                                {loading && (
                                    <RefreshCcw
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}

                                Delete Course

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminCourses;