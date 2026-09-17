import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    BookOpen,
    GraduationCap,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

import adminSemesterService from "../../services/adminSemesterService";
import adminCourseService from "../../services/adminCourseService";
import adminDepartmentService from "../../services/adminDepartmentService";

const AdminSemesters = () => {
    // =====================================================
    // SIDEBAR
    // =====================================================

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // =====================================================
    // DATA
    // =====================================================

    const [semesters, setSemesters] = useState([]);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);


    // =====================================================
    // UNIQUE DEPARTMENTS
    // =====================================================


    const [loading, setLoading] = useState(true);

    // =====================================================
    // SEARCH / FILTER
    // =====================================================

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState("");



    // =====================================================
    // MODAL
    // =====================================================

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [editingSemester, setEditingSemester] = useState(null);
    const [deletingSemester, setDeletingSemester] = useState(null);

    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] = useState({
        semesterNumber: "",
        semesterName: "",
        courseId: "",
        examMode: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                semesterResponse,
                courseResponse,
                departmentResponse,
            ] = await Promise.all([
                adminSemesterService.getAllSemesters(),
                adminCourseService.getAllCourses(),
                adminDepartmentService.getAllDepartments(),
            ]);

            console.log(
                "Semester API:",
                semesterResponse
            );

            console.log(
                "Course API:",
                courseResponse
            );

            setSemesters(
                semesterResponse?.data || []
            );

            setCourses(
                courseResponse?.data || []
            );

            setDepartments(
                departmentResponse?.data || []
            );

        } catch (err) {
            console.error(
                "Failed to load semester data:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load semester data."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FILTER
    // =====================================================

    // =====================================================
    // FILTER SEMESTERS
    // =====================================================

    const filteredSemesters = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return semesters.filter((semester) => {

            // -------------------------------------------------
            // FIND COURSE
            // -------------------------------------------------

            const course = courses.find(
                (item) =>
                    String(item.id) ===
                    String(semester.courseId)
            );

            // -------------------------------------------------
            // DEPARTMENT NAME
            // -------------------------------------------------

            const departmentName =
                semester.departmentName ||
                course?.departmentName ||
                "";

            // -------------------------------------------------
            // SEARCH
            // -------------------------------------------------

            const searchableText = [
                semester.id,
                semester.semesterNumber,
                semester.semesterName,
                semester.courseId,
                semester.courseName,
                departmentName,
                course?.courseCode,
                course?.courseName,
                course?.description,
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
                !searchValue ||
                searchableText.includes(searchValue);

            // -------------------------------------------------
            // DEPARTMENT FILTER
            // -------------------------------------------------

            const matchesDepartment =
                !departmentFilter ||
                String(
                    semester.departmentId ??
                    course?.departmentId ??
                    ""
                ) === String(departmentFilter);

            // -------------------------------------------------
            // COURSE FILTER
            // -------------------------------------------------

            const matchesCourse =
                !courseFilter ||
                String(semester.courseId) ===
                String(courseFilter);

            return (
                matchesSearch &&
                matchesDepartment &&
                matchesCourse
            );
        });
    }, [
        semesters,
        courses,
        search,
        departmentFilter,
        courseFilter,
    ]);


    const handleDepartmentChange = (e) => {
        const value = e.target.value;

        setDepartmentFilter(value);

        // Reset selected course when department changes
        setCourseFilter("");

    };

    const handleCourseFilterChange = (e) => {
        setCourseFilter(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };


    // =====================================================
    // COURSES BY SELECTED DEPARTMENT
    // =====================================================

    const filteredCoursesForDropdown = useMemo(() => {
        if (!departmentFilter) {
            return courses;
        }

        return courses.filter(
            (course) =>
                String(course.departmentId) ===
                String(departmentFilter)
        );
    }, [courses, departmentFilter]);

    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const handleAdd = () => {
        setEditingSemester(null);

        setFormData({
            semesterNumber: "",
            semesterName: "",
            courseId: "",
            examMode: "",
        });

        setError("");
        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const handleEdit = (semester) => {
        setEditingSemester(semester);

        setFormData({
            semesterNumber: semester.semesterNumber ?? "",
            semesterName: semester.semesterName ?? "",
            courseId: semester.courseId ?? "",
            examMode: semester.examMode ?? "",
        });

        setError("");
        setShowModal(true);
    };

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
    // SAVE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!formData.semesterNumber) {
            setError(
                "Semester number is required."
            );
            return;
        }

        const semesterNumber =
            Number(formData.semesterNumber);

        if (
            semesterNumber < 1 ||
            semesterNumber > 10
        ) {
            setError(
                "Semester number must be between 1 and 10."
            );
            return;
        }

        if (!formData.courseId) {
            setError(
                "Please select a course."
            );
            return;
        }

        // -----------------------------
        // EXACT BACKEND PAYLOAD
        // -----------------------------

        const payload = {
            semesterNumber,
            semesterName:
                formData.semesterName.trim(),
            courseId:
                Number(formData.courseId),
            examMode: formData.examMode,
        };

        try {
            setSaving(true);

            if (editingSemester) {
                await adminSemesterService.updateSemester(
                    editingSemester.id,
                    payload
                );
            } else {
                await adminSemesterService.addSemester(
                    payload
                );
            }

            setShowModal(false);

            setEditingSemester(null);

            await loadData();

        } catch (err) {
            console.error(
                "Save semester error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to save semester."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleDeleteClick = (semester) => {
        setDeletingSemester(semester);
        setShowDeleteModal(true);
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async () => {
        if (!deletingSemester) {
            return;
        }

        try {
            setSaving(true);

            await adminSemesterService.deleteSemester(
                deletingSemester.id
            );

            setShowDeleteModal(false);
            setDeletingSemester(null);

            await loadData();

        } catch (err) {
            console.error(
                "Delete semester error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to delete semester."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // CLOSE MOBILE SIDEBAR
    // =====================================================

    const handleMobileClose = () => {
        setMobileOpen(false);
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                onClose={handleMobileClose}
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

                    ${collapsed
                        ? "md:ml-[76px]"
                        : "md:ml-[260px]"
                    }
                `}
            >
                <div className="
                    p-4
                    sm:p-5
                    lg:p-6
                ">

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

                        <div>
                            <h1 className="
                                text-xl
                                sm:text-2xl
                                font-bold
                                text-slate-800
                            ">
                                Semesters
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                Manage course semesters
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
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
                                hover:bg-indigo-700
                                transition
                                w-full
                                sm:w-auto
                            "
                        >
                            <Plus size={18} />

                            Add Semester
                        </button>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && !showModal && (
                        <div className="
                            mt-5
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-600
                        ">
                            {error}
                        </div>
                    )}

                    {/* =====================================================
    FILTERS
===================================================== */}

                    <div className="
    mt-5
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-4
">

                        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-[minmax(280px,1fr)_220px_260px]
        gap-3
    ">

                            {/* =================================================
            SEARCH
        ================================================= */}

                            <div className="
            relative
            flex
            items-center
            h-11
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            transition
            focus-within:border-indigo-400
            focus-within:ring-2
            focus-within:ring-indigo-100
        ">

                                <Search
                                    size={18}
                                    className="
                    ml-3
                    shrink-0
                    text-slate-400
                    pointer-events-none
                "
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="
                    Search semester, course or department...
                "
                                    autoComplete="off"
                                    className="
                    h-full
                    w-full
                    bg-transparent
                    px-3
                    outline-none
                    text-sm
                    text-slate-700
                    placeholder:text-slate-400
                "
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="
                        mr-2
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        hover:bg-slate-200
                        hover:text-slate-600
                        transition
                    "
                                        title="Clear search"
                                    >
                                        <X size={15} />
                                    </button>
                                )}

                            </div>

                            {/* =================================================
            DEPARTMENT FILTER
        ================================================= */}

                            <select
                                value={departmentFilter}
                                onChange={handleDepartmentChange}
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
    "
                            >
                                <option value="">
                                    All Departments
                                </option>

                                {departments.map((department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.departmentName}
                                    </option>
                                ))}
                            </select>



                            {/* =================================================
            COURSE FILTER
        ================================================= */}

                            <select
                                value={courseFilter}
                                onChange={handleCourseFilterChange}
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
            "
                            >

                                <option value="">
                                    All Courses
                                </option>

                                {filteredCoursesForDropdown.map((course) => (
                                    <option
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.courseName}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* =================================================
        ACTIVE FILTER INFO
    ================================================= */}

                        {(search || departmentFilter || courseFilter) && (
                            <div className="
            mt-3
            flex
            flex-wrap
            items-center
            gap-2
        ">

                                <span className="
                text-xs
                text-slate-400
            ">
                                    Active filters:
                                </span>

                                {search && (
                                    <span className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-indigo-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-indigo-600
                ">
                                        Search: "{search}"
                                    </span>
                                )}

                                {departmentFilter && (
                                    <span className="
                    inline-flex
                    items-center
                    rounded-lg
                    bg-blue-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-blue-600
                ">
                                        Department: {
                                            departments.find(
                                                (department) =>
                                                    String(department.id) ===
                                                    String(departmentFilter)
                                            )?.departmentName || "Selected"
                                        }
                                    </span>
                                )}

                                {courseFilter && (
                                    <span className="
                    inline-flex
                    items-center
                    rounded-lg
                    bg-emerald-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-emerald-600
                ">
                                        Course: {
                                            courses.find(
                                                (course) =>
                                                    String(course.id) ===
                                                    String(courseFilter)
                                            )?.courseName || "Selected"
                                        }
                                    </span>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setDepartmentFilter("");
                                        setCourseFilter("");
                                    }}
                                    className="
                    ml-auto
                    text-xs
                    font-medium
                    text-red-500
                    hover:text-red-600
                "
                                >
                                    Clear All
                                </button>

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="
                        mt-5
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                    ">

                        {/* DESKTOP TABLE */}

                        <div className="
                            hidden
                            md:block
                            overflow-x-auto
                        ">

                            <table className="
                                w-full
                                min-w-[800px]
                            ">

                                <thead>
                                    <tr className="
                                        border-b
                                        border-slate-200
                                        bg-slate-50
                                    ">

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            #
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Semester
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Exam Mode
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Course
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Department
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-right
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {loading ? (
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
                                                Loading semesters...
                                            </td>
                                        </tr>
                                    ) : filteredSemesters.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="
                                                    px-5
                                                    py-12
                                                    text-center
                                                "
                                            >
                                                <GraduationCap
                                                    size={38}
                                                    className="
                                                        mx-auto
                                                        text-slate-300
                                                    "
                                                />

                                                <p className="
                                                    mt-3
                                                    text-sm
                                                    font-medium
                                                    text-slate-600
                                                ">
                                                    No semester records found
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    Try changing your search or filter.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSemesters.map(
                                            (semester, index) => (
                                                <tr
                                                    key={
                                                        semester.id
                                                    }
                                                    className="
                                                        border-b
                                                        border-slate-100
                                                        last:border-0
                                                        hover:bg-slate-50
                                                    "
                                                >

                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-500
                                                    ">
                                                        {index + 1}
                                                    </td>

                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">
                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        ">

                                                            <div className="
                                                                h-9
                                                                w-9
                                                                rounded-lg
                                                                bg-indigo-50
                                                                text-indigo-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                            ">
                                                                <BookOpen
                                                                    size={18}
                                                                />
                                                            </div>

                                                            <div>
                                                                <p className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-700
                                                                ">
                                                                    Semester{" "}
                                                                    {
                                                                        semester.semesterNumber
                                                                    }
                                                                </p>

                                                                <p className="
                                                                    text-xs
                                                                    text-slate-400
                                                                ">
                                                                    {
                                                                        semester.semesterName ||
                                                                        "—"
                                                                    }
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </td>

                                                    {/* EXAM MODE */}
                                                    <td className="
    px-5
    py-4
    text-sm
    font-medium
    text-slate-700
">
                                                        <span className="
        inline-flex
        rounded-lg
        bg-indigo-50
        px-3
        py-1.5
        text-xs
        font-semibold
        text-indigo-700
    ">
                                                            {semester.examMode
                                                                ? `${semester.examMode} Semester Examination`
                                                                : "—"}
                                                        </span>
                                                    </td>



                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        font-medium
                                                        text-slate-700
                                                    ">
                                                        {
                                                            semester.courseName ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-500
                                                    ">
                                                        {
                                                            semester.departmentName ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">
                                                        <div className="
                                                            flex
                                                            justify-end
                                                            gap-2
                                                        ">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        semester
                                                                    )
                                                                }
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-indigo-600
                                                                    hover:bg-indigo-50
                                                                "
                                                                title="Edit"
                                                            >
                                                                <Pencil
                                                                    size={17}
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        semester
                                                                    )
                                                                }
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-red-600
                                                                    hover:bg-red-50
                                                                "
                                                                title="Delete"
                                                            >
                                                                <Trash2
                                                                    size={17}
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
                            MOBILE CARDS
                        ================================================= */}

                        <div className="
                            md:hidden
                            divide-y
                            divide-slate-100
                        ">

                            {loading ? (
                                <div className="
                                    px-4
                                    py-12
                                    text-center
                                    text-sm
                                    text-slate-500
                                ">
                                    Loading semesters...
                                </div>
                            ) : filteredSemesters.length === 0 ? (
                                <div className="
                                    px-4
                                    py-12
                                    text-center
                                ">
                                    <GraduationCap
                                        size={38}
                                        className="
                                            mx-auto
                                            text-slate-300
                                        "
                                    />

                                    <p className="
                                        mt-3
                                        text-sm
                                        font-medium
                                        text-slate-600
                                    ">
                                        No semester records found
                                    </p>
                                </div>
                            ) : (
                                filteredSemesters.map(
                                    (semester) => (
                                        <div
                                            key={
                                                semester.id
                                            }
                                            className="
                                                p-4
                                            "
                                        >

                                            <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    min-w-0
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
                                                    ">
                                                        <BookOpen
                                                            size={19}
                                                        />
                                                    </div>

                                                    <div className="
                                                        min-w-0
                                                    ">
                                                        <p className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-700
                                                        ">
                                                            Semester{" "}
                                                            {
                                                                semester.semesterNumber
                                                            }
                                                        </p>

                                                        <p className="
                                                            mt-0.5
                                                            truncate
                                                            text-xs
                                                            text-slate-400
                                                        ">
                                                            {
                                                                semester.semesterName ||
                                                                "No name"
                                                            }
                                                        </p>
                                                    </div>

                                                </div>

                                                <div className="
                                                    flex
                                                    shrink-0
                                                    gap-1
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                semester
                                                            )
                                                        }
                                                        className="
                                                            h-9
                                                            w-9
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-indigo-600
                                                            hover:bg-indigo-50
                                                        "
                                                    >
                                                        <Pencil
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                semester
                                                            )
                                                        }
                                                        className="
                                                            h-9
                                                            w-9
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-red-600
                                                            hover:bg-red-50
                                                        "
                                                    >
                                                        <Trash2
                                                            size={16}
                                                        />
                                                    </button>

                                                </div>

                                            </div>

                                            <div className="
                                                mt-4
                                                grid
                                                grid-cols-1
                                                gap-2
                                            ">

                                                <div className="
                                                    rounded-xl
                                                    bg-slate-50
                                                    px-3
                                                    py-2.5
                                                ">
                                                    <p className="
                                                        text-[11px]
                                                        text-slate-400
                                                    ">
                                                        Course
                                                    </p>

                                                    <p className="
                                                        mt-0.5
                                                        text-sm
                                                        font-medium
                                                        text-slate-700
                                                    ">
                                                        {
                                                            semester.courseName ||
                                                            "—"
                                                        }
                                                    </p>
                                                </div>

                                                <div className="
                                                    rounded-xl
                                                    bg-slate-50
                                                    px-3
                                                    py-2.5
                                                ">
                                                    <p className="
                                                        text-[11px]
                                                        text-slate-400
                                                    ">
                                                        Department
                                                    </p>

                                                    <p className="
                                                        mt-0.5
                                                        text-sm
                                                        font-medium
                                                        text-slate-700
                                                    ">
                                                        {
                                                            semester.departmentName ||
                                                            "—"
                                                        }
                                                    </p>
                                                </div>

                                            </div>

                                        </div>
                                    )
                                )
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        RECORD COUNT
                    ================================================= */}

                    <div className="
                        mt-3
                        text-xs
                        text-slate-400
                    ">
                        Showing{" "}
                        {filteredSemesters.length}{" "}
                        of{" "}
                        {semesters.length}{" "}
                        semesters
                    </div>

                </div>
            </main>

            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            {showModal && (
                <div className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    bg-slate-900/40
                    p-4
                ">

                    <div
                        className="
                            w-full
                            max-w-lg
                            overflow-hidden
                            rounded-2xl
                            bg-white
                            shadow-2xl
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-200
                            px-5
                            py-4
                        ">

                            <div>
                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                ">
                                    {editingSemester
                                        ? "Edit Semester"
                                        : "Add Semester"}
                                </h2>

                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-slate-400
                                ">
                                    {editingSemester
                                        ? "Update semester details"
                                        : "Create a new semester"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="
                                    h-9
                                    w-9
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    text-slate-400
                                    hover:bg-slate-100
                                    hover:text-slate-600
                                "
                            >
                                <X size={19} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="p-5"
                        >

                            {error && (
                                <div className="
                                    mb-4
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-red-600
                                ">
                                    {error}
                                </div>
                            )}

                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                            ">

                                {/* SEMESTER NUMBER */}

                                <div>
                                    <label className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    ">
                                        Semester Number
                                        <span className="text-red-500">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="semesterNumber"
                                        min="1"
                                        max="10"
                                        value={
                                            formData.semesterNumber
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="1"
                                        className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            px-3
                                            text-sm
                                            outline-none
                                            focus:border-indigo-500
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />
                                </div>

                                {/* SEMESTER NAME */}

                                <div>
                                    <label className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    ">
                                        Semester Name
                                    </label>

                                    <input
                                        type="text"
                                        name="semesterName"
                                        value={
                                            formData.semesterName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="First Semester"
                                        className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            px-3
                                            text-sm
                                            outline-none
                                            focus:border-indigo-500
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />
                                </div>

                            </div>


                            <div className="mt-4">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Exam Mode <span className="text-red-500">*</span>
                                </label>

                                <select
                                    name="examMode"
                                    value={formData.examMode}
                                    onChange={handleChange}
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">Select Exam Mode</option>

                                    <option value="SUMMER">
                                        Summer
                                    </option>

                                    <option value="WINTER">
                                        Winter
                                    </option>
                                </select>
                            </div>

                            {/* COURSE */}

                            <div className="mt-4">

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Course
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <select
                                    name="courseId"
                                    value={
                                        formData.courseId
                                    }
                                    onChange={
                                        handleChange
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
                                        focus:border-indigo-500
                                        focus:ring-2
                                        focus:ring-indigo-100
                                    "
                                >
                                    <option value="">
                                        Select Course
                                    </option>

                                    {filteredCoursesForDropdown.map((course) => (
                                        <option
                                            key={course.id}
                                            value={course.id}
                                        >
                                            {course.courseName}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            {/* BUTTONS */}

                            <div className="
                                mt-6
                                flex
                                flex-col-reverse
                                sm:flex-row
                                sm:justify-end
                                gap-2
                            ">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                    className="
                                        h-11
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-5
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
                                    disabled={saving}
                                    className="
                                        h-11
                                        rounded-xl
                                        bg-indigo-600
                                        px-5
                                        text-sm
                                        font-semibold
                                        text-white
                                        hover:bg-indigo-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingSemester
                                            ? "Update Semester"
                                            : "Add Semester"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =====================================================
                DELETE MODAL
            ===================================================== */}

            {showDeleteModal && (
                <div className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    bg-slate-900/40
                    p-4
                ">

                    <div className="
                        w-full
                        max-w-sm
                        rounded-2xl
                        bg-white
                        p-5
                        shadow-2xl
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-50
                            text-red-600
                        ">
                            <Trash2 size={20} />
                        </div>

                        <h2 className="
                            mt-4
                            text-lg
                            font-bold
                            text-slate-800
                        ">
                            Delete Semester?
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-500
                        ">
                            Are you sure you want to delete{" "}
                            <span className="
                                font-semibold
                                text-slate-700
                            ">
                                Semester{" "}
                                {
                                    deletingSemester?.semesterNumber
                                }
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="
                            mt-6
                            flex
                            flex-col-reverse
                            sm:flex-row
                            sm:justify-end
                            gap-2
                        ">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(
                                        false
                                    );
                                    setDeletingSemester(
                                        null
                                    );
                                }}
                                className="
                                    h-11
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-5
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
                                onClick={
                                    handleDelete
                                }
                                disabled={saving}
                                className="
                                    h-11
                                    rounded-xl
                                    bg-red-600
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-red-700
                                    disabled:opacity-60
                                "
                            >
                                {saving
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminSemesters;