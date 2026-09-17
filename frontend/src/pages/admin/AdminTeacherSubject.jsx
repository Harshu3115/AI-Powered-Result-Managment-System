import React, { useEffect, useMemo, useState } from "react";

import {
    Search,
    Plus,
    Trash2,
    X,
    Users,
    BookOpen,
    GraduationCap,
    Building2,
    RefreshCw,
    AlertCircle,
    UserRound,
    Edit3,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

import adminTeacherService from "../../services/adminTeacherService";
import adminSubjectService from "../../services/adminSubjectService";
import adminTeacherSubjectService from "../../services/adminTeacherSubjectService";
import adminDepartmentService from "../../services/adminDepartmentService";
import adminSemesterService from "../../services/adminSemesterService";
import { toast } from "react-toastify";


const AdminTeacherSubject = () => {

    // =====================================================
    // SIDEBAR STATE
    // =====================================================

    const [collapsed, setCollapsed] = useState(false);

    const [mobileOpen, setMobileOpen] = useState(false);


    // =====================================================
    // DATA
    // =====================================================

    const [teachers, setTeachers] = useState([]);

    const [subjects, setSubjects] = useState([]);

    const [assignments, setAssignments] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);


    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);


    const [showEditModal, setShowEditModal] = useState(false);

    const [editingAssignment, setEditingAssignment] =
        useState(null);

    const [editForm, setEditForm] = useState({
        teacherId: "",
        subjectId: "",
    });

    const [updating, setUpdating] = useState(false);


    // =====================================================
    // FILTER STATE
    // =====================================================

    const [search, setSearch] = useState("");

    const [teacherFilter, setTeacherFilter] = useState("");

    const [subjectFilter, setSubjectFilter] = useState("");

    const [departmentFilter, setDepartmentFilter] = useState("");

    const [semesterFilter, setSemesterFilter] = useState("");


    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({
        teacherId: "",
        subjectId: "",
    });


    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                teacherResponse,
                subjectResponse,
                assignmentResponse,
                departmentResponse,
                semesterResponse,
            ] = await Promise.all([
                adminTeacherService.getTeachers(0, 1000),
                adminSubjectService.getAllSubjects(),
                adminTeacherSubjectService.getAllAssignments(),
                adminDepartmentService.getAllDepartments(),
                adminSemesterService.getAllSemesters(),
            ]);


            // =================================================
            // TEACHERS
            // =================================================

            const teacherData =
                teacherResponse?.data?.content ??
                teacherResponse?.content ??
                teacherResponse?.data ??
                teacherResponse ??
                [];

            setTeachers(
                Array.isArray(teacherData)
                    ? teacherData
                    : []
            );


            // =================================================
            // SUBJECTS
            // =================================================

            const subjectData =
                subjectResponse?.data ??
                subjectResponse ??
                [];

            setSubjects(
                Array.isArray(subjectData)
                    ? subjectData
                    : []
            );

            // =================================================
            // DEPARTMENTS
            // =================================================

            const departmentData =
                departmentResponse?.data ??
                departmentResponse ??
                [];

            setDepartments(
                Array.isArray(departmentData)
                    ? departmentData
                    : []
            );

            // =================================================
            // SEMESTERS
            // =================================================

            const semesterData =
                semesterResponse?.data ??
                semesterResponse ??
                [];

            setSemesters(
                Array.isArray(semesterData)
                    ? semesterData
                    : []
            );


            // =================================================
            // ASSIGNMENTS
            // =================================================

            const assignmentData =
                assignmentResponse?.data ??
                assignmentResponse ??
                [];

            const enrichedAssignments = Array.isArray(assignmentData)
                ? assignmentData.map((assignment) => {

                    const subject = subjectData.find(
                        (s) =>
                            String(s.id) ===
                            String(assignment.subjectId)
                    );

                    return {
                        ...assignment,

                        // Department
                        departmentId:
                            assignment.departmentId ??
                            subject?.departmentId ??
                            subject?.department?.id ??
                            null,

                        departmentName:
                            assignment.departmentName ??
                            subject?.departmentName ??
                            subject?.department?.departmentName ??
                            subject?.department?.name ??
                            null,

                        // Semester
                        semesterId:
                            assignment.semesterId ??
                            subject?.semesterId ??
                            subject?.semester?.id ??
                            null,

                        semesterName:
                            assignment.semesterName ??
                            subject?.semesterName ??
                            subject?.semester?.semesterName ??
                            subject?.semester?.name ??
                            null,
                    };
                })
                : [];

            setAssignments(enrichedAssignments);


            console.log(
                "ENRICHED ASSIGNMENTS:",
                enrichedAssignments
            );

            console.log(
                "SUBJECT DATA:",
                subjectData
            );


            console.log(
                "Teachers:",
                teacherData
            );

            console.log(
                "Subjects:",
                subjectData
            );

            console.log(
                "Assignments:",
                assignmentData
            );

        } catch (err) {

            console.error(
                "Teacher Subject Load Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load teacher assignments."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);


    // =====================================================
    // FILTER ASSIGNMENTS
    // =====================================================

    // =====================================================
    // FILTER ASSIGNMENTS
    // =====================================================

    const filteredAssignments = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return assignments.filter((item) => {

            // -------------------------------------------------
            // SEARCHABLE CONTENT
            // -------------------------------------------------

            const searchableText = [
                item.id,

                // Teacher
                item.teacherId,
                item.teacherName,
                item.teacherCode,
                item.teacherEmail,

                // Subject
                item.subjectId,
                item.subjectCode,
                item.subjectName,
                item.credits,

                // Department
                item.departmentId,
                item.departmentName,

                // Semester
                item.semesterId,
                item.semesterName,
            ]
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined &&
                        String(value).trim() !== ""
                )
                .map((value) =>
                    String(value).toLowerCase()
                )
                .join(" ");

            const matchesSearch =
                !keyword ||
                searchableText.includes(keyword);

            // -------------------------------------------------
            // TEACHER FILTER
            // -------------------------------------------------

            const matchesTeacher =
                !teacherFilter ||
                String(item.teacherId) ===
                String(teacherFilter);

            // -------------------------------------------------
            // SUBJECT FILTER
            // -------------------------------------------------

            const matchesSubject =
                !subjectFilter ||
                String(item.subjectId) ===
                String(subjectFilter);

            // -------------------------------------------------
            // DEPARTMENT FILTER
            // -------------------------------------------------

            const matchesDepartment =
                !departmentFilter ||
                String(item.departmentId ?? "") ===
                String(departmentFilter);

            // -------------------------------------------------
            // SEMESTER FILTER
            // -------------------------------------------------

            const matchesSemester =
                !semesterFilter ||
                String(item.semesterId ?? "") ===
                String(semesterFilter);

            return (
                matchesSearch &&
                matchesTeacher &&
                matchesSubject &&
                matchesDepartment &&
                matchesSemester
            );
        });
    }, [
        assignments,
        search,
        teacherFilter,
        subjectFilter,
        departmentFilter,
        semesterFilter,
    ]);


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearch("");

        setTeacherFilter("");

        setSubjectFilter("");

        setDepartmentFilter("");

        setSemesterFilter("");
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleFormChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm(
            (prev) => ({
                ...prev,
                [name]: value,
            })
        );
    };


    // =====================================================
    // OPEN MODAL
    // =====================================================

    const openModal = () => {

        setForm({
            teacherId: "",
            subjectId: "",
        });

        setShowModal(true);
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        setForm({
            teacherId: "",
            subjectId: "",
        });
    };


    // =====================================================
    // ASSIGN TEACHER
    // =====================================================

    const handleAssign = async (e) => {

        e.preventDefault();


        if (!form.teacherId) {

            toast.error(
                "Please select a teacher."
            );

            return;
        }


        if (!form.subjectId) {

            toast.error(
                "Please select a subject."
            );

            return;
        }


        try {

            setSaving(true);


            const response =
                await adminTeacherSubjectService
                    .assignSubject(
                        form.teacherId,
                        form.subjectId
                    );


            if (response?.success === false) {

                toast.error(
                    response.message ||
                    "Failed to assign subject."
                );

                return;
            }


            toast.success(
                response?.message ||
                "Subject assigned successfully."
            );


            closeModal();


            await loadData();

        } catch (err) {

            console.error(
                "Assign Teacher Error:",
                err
            );


            toast.error(
                err?.response?.data?.message ||
                "Failed to assign teacher to subject."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // DELETE ASSIGNMENT
    // =====================================================

    const handleDelete = (assignment) => {
        setSelectedAssignment(assignment);
        setShowDeleteModal(true);
    };

    // =====================================================
    // CONFIRM DELETE ASSIGNMENT
    // =====================================================

    const confirmDeleteAssignment = async () => {

        if (!selectedAssignment) {
            return;
        }

        try {

            setDeletingId(selectedAssignment.id);

            const response =
                await adminTeacherSubjectService.deleteAssignment(
                    selectedAssignment.id
                );

            if (response?.success === false) {

                toast.error(
                    response.message ||
                    "Failed to delete assignment."
                );

                return;
            }

            toast.success(
                response?.message ||
                "Assignment deleted successfully."
            );

            setShowDeleteModal(false);
            setSelectedAssignment(null);

            await loadData();

        } catch (err) {

            console.error(
                "Delete Assignment Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Failed to delete assignment."
            );

        } finally {

            setDeletingId(null);

        }
    };

    const closeDeleteModal = () => {

        if (deletingId !== null) {
            return;
        }

        setShowDeleteModal(false);
        setSelectedAssignment(null);
    };


    // =====================================================
    // SIDEBAR MOBILE CLOSE
    // =====================================================

    const handleMobileClose = () => {

        setMobileOpen(false);

    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const handleEdit = (assignment) => {

        setEditingAssignment(assignment);

        setEditForm({
            teacherId: assignment.teacherId
                ? String(assignment.teacherId)
                : "",

            subjectId: assignment.subjectId
                ? String(assignment.subjectId)
                : "",
        });

        setShowEditModal(true);
    };


    const handleEditFormChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // UPDATE ASSIGNMENT
    // =====================================================

    const handleUpdateAssignment = async (e) => {

        e.preventDefault();

        if (!editForm.teacherId) {

            toast.error(
                "Please select a teacher."
            );

            return;
        }

        try {

            setUpdating(true);

            const response =
                await adminTeacherSubjectService.updateAssignment(
                    editingAssignment.id,
                    editForm.teacherId,
                    editForm.subjectId
                );


            if (response?.success === false) {

                toast.error(
                    response.message ||
                    "Failed to update assignment."
                );

                return;
            }


            toast.success(
                response?.message ||
                "Assignment updated successfully."
            );


            setShowEditModal(false);
            setEditingAssignment(null);

            setEditForm({
                teacherId: "",
                subjectId: "",
            });


            await loadData();

        } catch (err) {

            console.error(
                "Update Assignment Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Failed to update assignment."
            );

        } finally {

            setUpdating(false);
        }
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
                collapsed={collapsed}
                setCollapsed={setCollapsed}
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
                MOBILE OVERLAY
            ================================================= */}

            {mobileOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/30
                        md:hidden
                    "
                    onClick={
                        handleMobileClose
                    }
                />

            )}


            {/* =================================================
                MAIN CONTENT
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

                <div
                    className="
                        p-4
                        sm:p-5
                        lg:p-6
                        xl:p-7
                        max-w-[1600px]
                        mx-auto
                    "
                >

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div
                        className="
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
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        h-10
                                        w-10
                                        rounded-xl
                                        bg-indigo-100
                                        text-indigo-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <GraduationCap
                                        size={21}
                                    />
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
                                        Teacher Assignment
                                    </h1>

                                    <p
                                        className="
                                            text-xs
                                            sm:text-sm
                                            text-slate-500
                                            mt-0.5
                                        "
                                    >
                                        Manage teachers assigned to subjects
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ADD BUTTON */}

                        <button
                            type="button"
                            onClick={openModal}
                            className="
                                w-full
                                sm:w-auto
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                h-11
                                px-5
                                rounded-xl
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                text-sm
                                font-semibold
                                shadow-sm
                                transition
                                active:scale-[0.98]
                            "
                        >

                            <Plus size={18} />

                            Assign Teacher

                        </button>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            gap-3
                            sm:gap-4
                            mt-5
                        "
                    >

                        {/* ASSIGNMENTS */}

                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-2xl
                                p-4
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        Total Assignments
                                    </p>

                                    <p
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-800
                                            mt-1
                                        "
                                    >
                                        {assignments.length}
                                    </p>

                                </div>

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

                                    <BookOpen
                                        size={21}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* TEACHERS */}

                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-2xl
                                p-4
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        Total Teachers
                                    </p>

                                    <p
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-800
                                            mt-1
                                        "
                                    >
                                        {teachers.length}
                                    </p>

                                </div>

                                <div
                                    className="
                                        h-11
                                        w-11
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Users
                                        size={21}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* SUBJECTS */}

                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-2xl
                                p-4
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        Total Subjects
                                    </p>

                                    <p
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-800
                                            mt-1
                                        "
                                    >
                                        {subjects.length}
                                    </p>

                                </div>

                                <div
                                    className="
                                        h-11
                                        w-11
                                        rounded-xl
                                        bg-emerald-50
                                        text-emerald-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <BookOpen
                                        size={21}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FILTER SECTION
                    ================================================= */}

                    <div
                        className="
                            mt-5
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-4
                            sm:p-5
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                xl:flex-row
                                xl:items-end
                                gap-3
                            "
                        >

                            {/* SEARCH */}

                            <div
                                className="
                                    w-full
                                    xl:flex-1
                                "
                            >

                                <label
                                    className="
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                        mb-1.5
                                    "
                                >
                                    Search
                                </label>

                                {/* SEARCH */}

                                <div className="w-full xl:flex-1 min-w-0">



                                    <div className="relative w-full">

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
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Search teacher, subject, code..."
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
                focus:ring-2
                focus:ring-indigo-100
                focus:border-indigo-400
                transition
            "
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* TEACHER */}

                            <div className="w-full xl:w-[190px]">

                                <label
                                    className="
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                        mb-1.5
                                    "
                                >
                                    Teacher
                                </label>

                                <select
                                    value={teacherFilter}
                                    onChange={(e) =>
                                        setTeacherFilter(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        h-11
                                        px-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        focus:border-indigo-400
                                    "
                                >

                                    <option value="">
                                        All Teachers
                                    </option>

                                    {teachers.map(
                                        (teacher) => (

                                            <option
                                                key={
                                                    teacher.id
                                                }
                                                value={
                                                    teacher.id
                                                }
                                            >
                                                {(
                                                    teacher.firstName ||
                                                    ""
                                                )}{" "}
                                                {(
                                                    teacher.lastName ||
                                                    ""
                                                )}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* SUBJECT */}

                            <div className="w-full xl:w-[190px]">

                                <label
                                    className="
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                        mb-1.5
                                    "
                                >
                                    Subject
                                </label>

                                <select
                                    value={subjectFilter}
                                    onChange={(e) =>
                                        setSubjectFilter(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        h-11
                                        px-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        focus:border-indigo-400
                                    "
                                >

                                    <option value="">
                                        All Subjects
                                    </option>

                                    {subjects.map(
                                        (subject) => (

                                            <option
                                                key={
                                                    subject.id
                                                }
                                                value={
                                                    subject.id
                                                }
                                            >
                                                {subject.subjectCode
                                                    ? `${subject.subjectCode} - `
                                                    : ""}
                                                {subject.subjectName}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* DEPARTMENT */}

                            <div className="w-full xl:w-[190px]">

                                <label
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                        mb-1.5
                                    "
                                >

                                    <Building2
                                        size={13}
                                    />

                                    Department

                                </label>

                                <select
                                    value={departmentFilter}
                                    onChange={(e) =>
                                        setDepartmentFilter(e.target.value)
                                    }
                                    className="
        w-full
        h-11
        px-3
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        text-sm
        text-slate-700
        outline-none
        focus:ring-2
        focus:ring-indigo-100
        focus:border-indigo-400
    "
                                >
                                    <option value="">
                                        All Departments
                                    </option>

                                    {departments.length === 0 ? (
                                        <option disabled>
                                            No departments available
                                        </option>
                                    ) : (
                                        departments.map((department) => (
                                            <option
                                                key={department.id}
                                                value={department.id}
                                            >
                                                {department.departmentName || department.name}
                                            </option>
                                        ))
                                    )}
                                </select>

                            </div>


                            {/* SEMESTER */}

                            <div className="w-full xl:w-[170px]">

                                <label
                                    className="
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                        mb-1.5
                                    "
                                >
                                    Semester
                                </label>

                                <select
                                    value={semesterFilter}
                                    onChange={(e) =>
                                        setSemesterFilter(e.target.value)
                                    }
                                    className="
        w-full
        h-11
        px-3
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        text-sm
        text-slate-700
        outline-none
        focus:ring-2
        focus:ring-indigo-100
        focus:border-indigo-400
    "
                                >
                                    <option value="">
                                        All Semesters
                                    </option>

                                    {semesters.length === 0 ? (
                                        <option disabled>
                                            No semesters available
                                        </option>
                                    ) : (
                                        semesters.map((semester) => (
                                            <option
                                                key={semester.id}
                                                value={semester.id}
                                            >
                                                {semester.semesterName || semester.name}
                                            </option>
                                        ))
                                    )}
                                </select>

                            </div>


                            {/* CLEAR */}

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    h-11
                                    px-4
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    hover:bg-slate-50
                                    text-slate-600
                                    text-sm
                                    font-medium
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    whitespace-nowrap
                                "
                            >

                                <X size={16} />

                                Clear

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            className="
                                mt-5
                                bg-red-50
                                border
                                border-red-200
                                rounded-xl
                                p-4
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <AlertCircle
                                size={20}
                                className="
                                    text-red-500
                                    shrink-0
                                    mt-0.5
                                "
                            />

                            <div className="flex-1">

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-red-700
                                    "
                                >
                                    Unable to load assignments
                                </p>

                                <p
                                    className="
                                        text-sm
                                        text-red-600
                                        mt-1
                                    "
                                >
                                    {error}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={loadData}
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-sm
                                    font-semibold
                                    text-red-700
                                    hover:text-red-800
                                "
                            >

                                <RefreshCw
                                    size={15}
                                />

                                Retry

                            </button>

                        </div>

                    )}


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div
                        className="
                            mt-5
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            shadow-sm
                            overflow-hidden
                        "
                    >

                        {/* TABLE HEADER */}

                        <div
                            className="
                                px-4
                                sm:px-5
                                py-4
                                border-b
                                border-slate-200
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-2
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-base
                                        sm:text-lg
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    Teacher Subject Assignments
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        sm:text-sm
                                        text-slate-500
                                        mt-0.5
                                    "
                                >
                                    Showing{" "}
                                    <span className="font-semibold">
                                        {
                                            filteredAssignments.length
                                        }
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold">
                                        {
                                            assignments.length
                                        }
                                    </span>{" "}
                                    assignments
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={loadData}
                                disabled={loading}
                                className="
                                    self-start
                                    sm:self-auto
                                    h-9
                                    px-3
                                    rounded-lg
                                    border
                                    border-slate-200
                                    hover:bg-slate-50
                                    text-slate-600
                                    text-xs
                                    font-medium
                                    inline-flex
                                    items-center
                                    gap-2
                                    disabled:opacity-50
                                "
                            >

                                <RefreshCw
                                    size={14}
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
                            LOADING
                        ================================================= */}

                        {loading ? (

                            <div
                                className="
                                    py-16
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
                                "
                            >

                                <RefreshCw
                                    size={28}
                                    className="
                                        text-indigo-500
                                        animate-spin
                                    "
                                />

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        font-medium
                                        text-slate-600
                                    "
                                >
                                    Loading assignments...
                                </p>

                            </div>

                        ) : filteredAssignments.length === 0 ? (

                            /* =================================================
                               EMPTY
                            ================================================= */

                            <div
                                className="
                                    py-16
                                    px-5
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        h-14
                                        w-14
                                        rounded-2xl
                                        bg-slate-100
                                        text-slate-400
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <BookOpen
                                        size={25}
                                    />

                                </div>

                                <h3
                                    className="
                                        mt-4
                                        text-base
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    No assignments found
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                        max-w-md
                                    "
                                >
                                    {assignments.length === 0
                                        ? "No teacher has been assigned to a subject yet."
                                        : "No assignment matches your current filters."}
                                </p>


                                {assignments.length > 0 && (

                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="
                                            mt-4
                                            text-sm
                                            font-semibold
                                            text-indigo-600
                                            hover:text-indigo-700
                                        "
                                    >
                                        Clear filters
                                    </button>

                                )}

                            </div>

                        ) : (

                            <>
                                {/* =================================================
                                    DESKTOP TABLE
                                ================================================= */}

                                <div
                                    className="
                                        hidden
                                        md:block
                                        overflow-x-auto
                                    "
                                >

                                    <table
                                        className="
                                            w-full
                                            min-w-[1050px]
                                        "
                                    >

                                        <thead>

                                            <tr
                                                className="
                                                    bg-slate-50
                                                    border-b
                                                    border-slate-200
                                                "
                                            >

                                                <th
                                                    className="
                                                        px-5
                                                        py-3
                                                        text-left
                                                        text-xs
                                                        font-semibold
                                                        text-slate-500
                                                        uppercase
                                                        tracking-wide
                                                    "
                                                >
                                                    #
                                                </th>

                                                <th
                                                    className="
                                                        px-5
                                                        py-3
                                                        text-left
                                                        text-xs
                                                        font-semibold
                                                        text-slate-500
                                                        uppercase
                                                        tracking-wide
                                                    "
                                                >
                                                    Teacher
                                                </th>

                                                <th
                                                    className="
                                                        px-5
                                                        py-3
                                                        text-left
                                                        text-xs
                                                        font-semibold
                                                        text-slate-500
                                                        uppercase
                                                        tracking-wide
                                                    "
                                                >
                                                    Subject
                                                </th>

                                                <th
                                                    className="
                                                        px-5
                                                        py-3
                                                        text-left
                                                        text-xs
                                                        font-semibold
                                                        text-slate-500
                                                        uppercase
                                                        tracking-wide
                                                    "
                                                >
                                                    Department
                                                </th>

                                                <th
                                                    className="
                                                        px-5
                                                        py-3
                                                        text-left
                                                        text-xs
                                                        font-semibold
                                                        text-slate-500
                                                        uppercase
                                                        tracking-wide
                                                    "
                                                >
                                                    Semester
                                                </th>

                                                <th
                                                    className="
                                                        px-5
                                                        py-3
                                                        text-left
                                                        text-xs
                                                        font-semibold
                                                        text-slate-500
                                                        uppercase
                                                        tracking-wide
                                                    "
                                                >
                                                    Credits
                                                </th>

                                                <th
                                                    className="
                                                        px-5
                                                        py-3
                                                        text-right
                                                        text-xs
                                                        font-semibold
                                                        text-slate-500
                                                        uppercase
                                                        tracking-wide
                                                    "
                                                >
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {filteredAssignments.map(
                                                (
                                                    assignment,
                                                    index
                                                ) => (

                                                    <tr
                                                        key={
                                                            assignment.id
                                                        }
                                                        className="
                                                            border-b
                                                            border-slate-100
                                                            last:border-0
                                                            hover:bg-slate-50
                                                            transition
                                                        "
                                                    >

                                                        {/* NUMBER */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                                text-sm
                                                                text-slate-500
                                                            "
                                                        >
                                                            {index + 1}
                                                        </td>


                                                        {/* TEACHER */}

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
                                                                    gap-3
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        h-10
                                                                        w-10
                                                                        rounded-full
                                                                        bg-indigo-100
                                                                        text-indigo-600
                                                                        flex
                                                                        items-center
                                                                        justify-center
                                                                        font-bold
                                                                        text-sm
                                                                        shrink-0
                                                                    "
                                                                >
                                                                    {(
                                                                        assignment.teacherName ||
                                                                        "T"
                                                                    )
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div
                                                                    className="
                                                                        min-w-0
                                                                    "
                                                                >

                                                                    <p
                                                                        className="
                                                                            text-sm
                                                                            font-semibold
                                                                            text-slate-700
                                                                            truncate
                                                                        "
                                                                    >
                                                                        {
                                                                            assignment.teacherName ||
                                                                            "Unknown Teacher"
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                            text-xs
                                                                            text-slate-400
                                                                            truncate
                                                                            mt-0.5
                                                                        "
                                                                    >
                                                                        {
                                                                            assignment.teacherCode ||
                                                                            `ID: ${assignment.teacherId}`
                                                                        }
                                                                    </p>

                                                                    {assignment.teacherEmail && (

                                                                        <p
                                                                            className="
                                                                                text-xs
                                                                                text-slate-400
                                                                                truncate
                                                                            "
                                                                        >
                                                                            {
                                                                                assignment.teacherEmail
                                                                            }
                                                                        </p>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* SUBJECT */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-700
                                                                "
                                                            >
                                                                {
                                                                    assignment.subjectName ||
                                                                    "-"
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-indigo-500
                                                                    font-medium
                                                                    mt-0.5
                                                                "
                                                            >
                                                                {
                                                                    assignment.subjectCode ||
                                                                    "-"
                                                                }
                                                            </p>

                                                        </td>


                                                        {/* DEPARTMENT */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            {assignment.departmentName ? (

                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-1.5
                                                                        px-2.5
                                                                        py-1.5
                                                                        rounded-lg
                                                                        bg-blue-50
                                                                        text-blue-700
                                                                        text-xs
                                                                        font-medium
                                                                    "
                                                                >

                                                                    <Building2
                                                                        size={13}
                                                                    />

                                                                    {
                                                                        assignment.departmentName
                                                                    }

                                                                </span>

                                                            ) : (

                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        text-slate-400
                                                                    "
                                                                >
                                                                    -
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* SEMESTER */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            {assignment.semesterName ? (

                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        px-2.5
                                                                        py-1.5
                                                                        rounded-lg
                                                                        bg-purple-50
                                                                        text-purple-700
                                                                        text-xs
                                                                        font-medium
                                                                    "
                                                                >
                                                                    {
                                                                        assignment.semesterName
                                                                    }
                                                                </span>

                                                            ) : (

                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        text-slate-400
                                                                    "
                                                                >
                                                                    -
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* CREDITS */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            {assignment.credits !== null &&
                                                                assignment.credits !== undefined ? (

                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        px-2.5
                                                                        py-1.5
                                                                        rounded-lg
                                                                        bg-emerald-50
                                                                        text-emerald-700
                                                                        text-xs
                                                                        font-semibold
                                                                    "
                                                                >
                                                                    {
                                                                        assignment.credits
                                                                    }
                                                                </span>

                                                            ) : (

                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        text-slate-400
                                                                    "
                                                                >
                                                                    -
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* ACTION */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                                text-right
                                                            "
                                                        >

                                                            <div className="flex items-center justify-end gap-2">

                                                                {/* EDIT */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEdit(assignment)
                                                                    }
                                                                    disabled={
                                                                        deletingId === assignment.id ||
                                                                        updating
                                                                    }
                                                                    className="
            h-9
            w-9
            rounded-lg
            bg-indigo-50
            text-indigo-600
            hover:bg-indigo-100
            inline-flex
            items-center
            justify-center
            transition
            disabled:opacity-50
        "
                                                                    title="Edit assignment"
                                                                >

                                                                    <Edit3 size={16} />

                                                                </button>


                                                                {/* DELETE */}

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        deletingId === assignment.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(assignment)
                                                                    }
                                                                    className="
            h-9
            w-9
            rounded-lg
            bg-red-50
            text-red-500
            hover:bg-red-100
            inline-flex
            items-center
            justify-center
            transition
            disabled:opacity-50
        "
                                                                    title="Delete assignment"
                                                                >

                                                                    {deletingId === assignment.id ? (

                                                                        <RefreshCw
                                                                            size={16}
                                                                            className="animate-spin"
                                                                        />

                                                                    ) : (

                                                                        <Trash2 size={16} />

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
                                    MOBILE CARDS
                                ================================================= */}

                                <div
                                    className="
                                        md:hidden
                                        p-3
                                        sm:p-4
                                        space-y-3
                                    "
                                >

                                    {filteredAssignments.map(
                                        (
                                            assignment,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    assignment.id
                                                }
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-slate-200
                                                    bg-white
                                                    p-4
                                                    shadow-sm
                                                "
                                            >

                                                {/* CARD HEADER */}

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                            min-w-0
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                h-11
                                                                w-11
                                                                rounded-full
                                                                bg-indigo-100
                                                                text-indigo-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                                font-bold
                                                                shrink-0
                                                            "
                                                        >
                                                            {(
                                                                assignment.teacherName ||
                                                                "T"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div
                                                            className="
                                                                min-w-0
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-bold
                                                                    text-slate-800
                                                                    truncate
                                                                "
                                                            >
                                                                {
                                                                    assignment.teacherName ||
                                                                    "Unknown Teacher"
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-slate-400
                                                                    mt-0.5
                                                                    truncate
                                                                "
                                                            >
                                                                {assignment.teacherCode ||
                                                                    `Teacher ID: ${assignment.teacherId}`}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div className="flex items-center gap-2 shrink-0">

                                                        {/* EDIT */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEdit(assignment)}
                                                            disabled={updating}
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
            transition
            disabled:opacity-50
        "
                                                            title="Edit assignment"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>

                                                        {/* DELETE */}
                                                        <button
                                                            type="button"
                                                            disabled={deletingId === assignment.id}
                                                            onClick={() => handleDelete(assignment)}
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
            shrink-0
            disabled:opacity-50
        "
                                                            title="Delete assignment"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>

                                                    </div>

                                                </div>


                                                {/* SUBJECT */}

                                                <div
                                                    className="
                                                        mt-4
                                                        rounded-xl
                                                        bg-slate-50
                                                        p-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                h-9
                                                                w-9
                                                                rounded-lg
                                                                bg-white
                                                                text-indigo-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                                shrink-0
                                                            "
                                                        >

                                                            <BookOpen
                                                                size={17}
                                                            />

                                                        </div>

                                                        <div
                                                            className="
                                                                min-w-0
                                                            "
                                                        >

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
                                                                    text-sm
                                                                    font-bold
                                                                    text-slate-700
                                                                    mt-0.5
                                                                "
                                                            >
                                                                {
                                                                    assignment.subjectName ||
                                                                    "-"
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-indigo-600
                                                                    font-semibold
                                                                    mt-0.5
                                                                "
                                                            >
                                                                {
                                                                    assignment.subjectCode ||
                                                                    "-"
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* DETAILS */}

                                                <div
                                                    className="
                                                        grid
                                                        grid-cols-2
                                                        gap-2
                                                        mt-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            rounded-xl
                                                            border
                                                            border-slate-100
                                                            bg-white
                                                            p-3
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                text-slate-400
                                                            "
                                                        >
                                                            Department
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                font-semibold
                                                                text-slate-700
                                                                mt-1
                                                                break-words
                                                            "
                                                        >
                                                            {
                                                                assignment.departmentName ||
                                                                "-"
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className="
                                                            rounded-xl
                                                            border
                                                            border-slate-100
                                                            bg-white
                                                            p-3
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                text-slate-400
                                                            "
                                                        >
                                                            Semester
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                font-semibold
                                                                text-slate-700
                                                                mt-1
                                                            "
                                                        >
                                                            {
                                                                assignment.semesterName ||
                                                                "-"
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className="
                                                            rounded-xl
                                                            border
                                                            border-slate-100
                                                            bg-white
                                                            p-3
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                text-slate-400
                                                            "
                                                        >
                                                            Credits
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                font-semibold
                                                                text-slate-700
                                                                mt-1
                                                            "
                                                        >
                                                            {
                                                                assignment.credits ??
                                                                "-"
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className="
                                                            rounded-xl
                                                            border
                                                            border-slate-100
                                                            bg-white
                                                            p-3
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                text-slate-400
                                                            "
                                                        >
                                                            Assignment #
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                font-semibold
                                                                text-slate-700
                                                                mt-1
                                                            "
                                                        >
                                                            {index + 1}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* EMAIL */}

                                                {assignment.teacherEmail && (

                                                    <div
                                                        className="
                                                            mt-3
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-xs
                                                            text-slate-500
                                                        "
                                                    >

                                                        <UserRound
                                                            size={14}
                                                        />

                                                        <span
                                                            className="
                                                                truncate
                                                            "
                                                        >
                                                            {
                                                                assignment.teacherEmail
                                                            }
                                                        </span>

                                                    </div>

                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            </>

                        )}

                    </div>

                </div>

            </main>

            {/* =====================================================
    DELETE CONFIRMATION MODAL
===================================================== */}

            {showDeleteModal && selectedAssignment && (

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
                            e.target === e.currentTarget &&
                            deletingId === null
                        ) {
                            closeDeleteModal();
                        }

                    }}
                >

                    <div
                        className="
                w-full
                max-w-md
                bg-white
                rounded-2xl
                shadow-2xl
                overflow-hidden
                animate-[fadeIn_0.2s_ease-out]
            "
                    >

                        {/* =========================
                MODAL HEADER
            ========================= */}

                        <div
                            className="
                    px-5
                    sm:px-6
                    py-5
                    flex
                    items-start
                    gap-4
                "
                        >

                            {/* DELETE ICON */}

                            <div
                                className="
                        h-11
                        w-11
                        rounded-xl
                        bg-red-50
                        text-red-500
                        flex
                        items-center
                        justify-center
                        shrink-0
                    "
                            >
                                <Trash2 size={21} />
                            </div>


                            {/* TITLE */}

                            <div className="flex-1 min-w-0">

                                <h2
                                    className="
                            text-lg
                            font-bold
                            text-slate-800
                        "
                                >
                                    Remove Assignment?
                                </h2>

                                <p
                                    className="
                            text-sm
                            text-slate-500
                            mt-1
                            leading-5
                        "
                                >
                                    Are you sure you want to remove this
                                    teacher from this subject?
                                </p>

                            </div>


                            {/* CLOSE */}

                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={deletingId !== null}
                                className="
                        h-8
                        w-8
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        hover:bg-slate-100
                        hover:text-slate-600
                        transition
                        disabled:opacity-50
                    "
                            >
                                <X size={18} />
                            </button>

                        </div>


                        {/* =========================
                ASSIGNMENT DETAILS
            ========================= */}

                        <div className="px-5 sm:px-6">

                            <div
                                className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                    "
                            >

                                {/* TEACHER */}

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                h-10
                                w-10
                                rounded-full
                                bg-indigo-100
                                text-indigo-600
                                flex
                                items-center
                                justify-center
                                font-bold
                                text-sm
                                shrink-0
                            "
                                    >
                                        {(
                                            selectedAssignment.teacherName ||
                                            "T"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">

                                        <p
                                            className="
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    truncate
                                "
                                        >
                                            {selectedAssignment.teacherName ||
                                                "Unknown Teacher"}
                                        </p>

                                        <p
                                            className="
                                    text-xs
                                    text-slate-500
                                    mt-0.5
                                    truncate
                                "
                                        >
                                            {selectedAssignment.teacherCode ||
                                                `Teacher ID: ${selectedAssignment.teacherId}`}
                                        </p>

                                    </div>

                                </div>


                                {/* SUBJECT */}

                                <div
                                    className="
                            mt-4
                            pt-4
                            border-t
                            border-slate-200
                        "
                                >

                                    <p
                                        className="
                                text-[11px]
                                font-medium
                                text-slate-400
                                uppercase
                                tracking-wide
                            "
                                    >
                                        Subject
                                    </p>

                                    <p
                                        className="
                                text-sm
                                font-semibold
                                text-slate-700
                                mt-1
                            "
                                    >
                                        {selectedAssignment.subjectName ||
                                            "Unknown Subject"}
                                    </p>

                                    {selectedAssignment.subjectCode && (

                                        <p
                                            className="
                                    text-xs
                                    text-indigo-600
                                    font-medium
                                    mt-0.5
                                "
                                        >
                                            {selectedAssignment.subjectCode}
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* =========================
                WARNING
            ========================= */}

                        <div
                            className="
                    px-5
                    sm:px-6
                    pt-4
                "
                        >

                            <div
                                className="
                        flex
                        items-start
                        gap-2
                        rounded-lg
                        bg-red-50
                        border
                        border-red-100
                        px-3
                        py-2.5
                    "
                            >

                                <AlertCircle
                                    size={16}
                                    className="
                            text-red-500
                            mt-0.5
                            shrink-0
                        "
                                />

                                <p
                                    className="
                            text-xs
                            text-red-600
                            leading-5
                        "
                                >
                                    This action cannot be undone. The teacher
                                    will no longer be assigned to this subject.
                                </p>

                            </div>

                        </div>


                        {/* =========================
                ACTION BUTTONS
            ========================= */}

                        <div
                            className="
                    px-5
                    sm:px-6
                    py-5
                    flex
                    flex-col-reverse
                    sm:flex-row
                    sm:justify-end
                    gap-2.5
                "
                        >

                            {/* CANCEL */}

                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={deletingId !== null}
                                className="
                        h-11
                        px-5
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        hover:bg-slate-50
                        text-slate-600
                        text-sm
                        font-semibold
                        transition
                        disabled:opacity-50
                    "
                            >
                                Cancel
                            </button>


                            {/* DELETE */}

                            <button
                                type="button"
                                onClick={confirmDeleteAssignment}
                                disabled={deletingId !== null}
                                className="
                        h-11
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
                        transition
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                            >

                                {deletingId !== null ? (

                                    <>
                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Removing...
                                    </>

                                ) : (

                                    <>
                                        <Trash2 size={16} />

                                        Remove Assignment
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
    EDIT ASSIGNMENT MODAL
===================================================== */}

            {showEditModal && editingAssignment && (
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
                        if (e.target === e.currentTarget && !updating) {
                            setShowEditModal(false);
                            setEditingAssignment(null);
                        }
                    }}
                >

                    <div
                        className="
                w-full
                max-w-lg
                bg-white
                rounded-2xl
                shadow-2xl
                overflow-hidden
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
                "
                        >

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Edit Assignment
                                </h2>

                                <p className="text-xs text-slate-500 mt-1">
                                    Update teacher and subject assignment
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={updating}
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingAssignment(null);
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
                        disabled:opacity-50
                    "
                            >
                                <X size={18} />
                            </button>

                        </div>


                        {/* FORM */}
                        <form
                            onSubmit={handleUpdateAssignment}
                            className="p-5 space-y-5"
                        >

                            {/* TEACHER */}
                            <div>

                                <label
                                    className="
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                            mb-2
                        "
                                >
                                    Teacher
                                </label>

                                <select
                                    name="teacherId"
                                    value={editForm.teacherId}
                                    onChange={handleEditFormChange}
                                    disabled={updating}
                                    className="
                            w-full
                            h-11
                            px-3
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-sm
                            text-slate-700
                            outline-none
                            focus:ring-2
                            focus:ring-indigo-100
                            focus:border-indigo-400
                            disabled:bg-slate-50
                        "
                                >

                                    <option value="">
                                        Select Teacher
                                    </option>

                                    {teachers.map((teacher) => (
                                        <option
                                            key={teacher.id}
                                            value={teacher.id}
                                        >
                                            {teacher.firstName || ""}{" "}
                                            {teacher.lastName || ""}
                                        </option>
                                    ))}

                                </select>

                            </div>


                            {/* SUBJECT */}
                            <div>

                                <label
                                    className="
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                            mb-2
                        "
                                >
                                    Subject
                                </label>

                                <select
                                    name="subjectId"
                                    value={editForm.subjectId}
                                    onChange={handleEditFormChange}
                                    disabled={updating}
                                    className="
                            w-full
                            h-11
                            px-3
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-sm
                            text-slate-700
                            outline-none
                            focus:ring-2
                            focus:ring-indigo-100
                            focus:border-indigo-400
                            disabled:bg-slate-50
                        "
                                >

                                    <option value="">
                                        Select Subject
                                    </option>

                                    {subjects.map((subject) => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.subjectCode
                                                ? `${subject.subjectCode} - `
                                                : ""}
                                            {subject.subjectName}
                                        </option>
                                    ))}

                                </select>

                            </div>


                            {/* BUTTONS */}
                            <div
                                className="
                        pt-2
                        flex
                        flex-col-reverse
                        sm:flex-row
                        sm:justify-end
                        gap-3
                    "
                            >

                                <button
                                    type="button"
                                    disabled={updating}
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingAssignment(null);
                                    }}
                                    className="
                            w-full
                            sm:w-auto
                            h-11
                            px-5
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            hover:bg-slate-50
                            text-slate-600
                            text-sm
                            font-semibold
                            disabled:opacity-50
                        "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="
                            w-full
                            sm:w-auto
                            h-11
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

                                    {updating ? (
                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />

                                            Updating...
                                        </>
                                    ) : (
                                        "Update Assignment"
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =====================================================
                ASSIGN MODAL
            ===================================================== */}

            {showModal && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        bg-slate-900/40
                        backdrop-blur-[2px]
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget &&
                            !saving
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div
                        className="
                            w-full
                            max-w-lg
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            overflow-hidden
                        "
                    >

                        {/* MODAL HEADER */}

                        <div
                            className="
                                px-5
                                sm:px-6
                                py-4
                                border-b
                                border-slate-200
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    Assign Teacher
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        mt-0.5
                                    "
                                >
                                    Assign a teacher to a subject
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="
                                    h-9
                                    w-9
                                    rounded-lg
                                    hover:bg-slate-100
                                    text-slate-500
                                    flex
                                    items-center
                                    justify-center
                                    disabled:opacity-50
                                "
                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <form
                            onSubmit={handleAssign}
                            className="p-5 sm:p-6"
                        >

                            {/* TEACHER */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    Teacher
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <select
                                    name="teacherId"
                                    value={
                                        form.teacherId
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    disabled={saving}
                                    className="
                                        w-full
                                        h-12
                                        px-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        focus:border-indigo-400
                                        disabled:bg-slate-50
                                    "
                                >

                                    <option value="">
                                        Select Teacher
                                    </option>

                                    {teachers.map(
                                        (teacher) => {

                                            const name =
                                                `${teacher.firstName || ""} ${teacher.lastName || ""}`
                                                    .trim();

                                            return (

                                                <option
                                                    key={
                                                        teacher.id
                                                    }
                                                    value={
                                                        teacher.id
                                                    }
                                                >
                                                    {name ||
                                                        `Teacher #${teacher.id}`}
                                                    {teacher.teacherCode
                                                        ? ` - ${teacher.teacherCode}`
                                                        : ""}
                                                </option>

                                            );

                                        }
                                    )}

                                </select>

                            </div>


                            {/* SUBJECT */}

                            <div className="mt-4">

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    Subject
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <select
                                    name="subjectId"
                                    value={
                                        form.subjectId
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    disabled={saving}
                                    className="
                                        w-full
                                        h-12
                                        px-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        focus:border-indigo-400
                                        disabled:bg-slate-50
                                    "
                                >

                                    <option value="">
                                        Select Subject
                                    </option>

                                    {subjects.map(
                                        (subject) => (

                                            <option
                                                key={
                                                    subject.id
                                                }
                                                value={
                                                    subject.id
                                                }
                                            >
                                                {subject.subjectCode
                                                    ? `${subject.subjectCode} - `
                                                    : ""}
                                                {
                                                    subject.subjectName
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* SELECTED INFORMATION */}

                            {form.teacherId &&
                                form.subjectId && (

                                    <div
                                        className="
                                            mt-5
                                            rounded-xl
                                            bg-indigo-50
                                            border
                                            border-indigo-100
                                            p-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-indigo-600
                                                uppercase
                                                tracking-wide
                                            "
                                        >
                                            Assignment Preview
                                        </p>


                                        <div
                                            className="
                                                mt-2
                                                grid
                                                grid-cols-1
                                                sm:grid-cols-2
                                                gap-3
                                            "
                                        >

                                            <div>

                                                <p
                                                    className="
                                                        text-[11px]
                                                        text-slate-400
                                                    "
                                                >
                                                    Teacher
                                                </p>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                        mt-0.5
                                                    "
                                                >
                                                    {(() => {

                                                        const teacher =
                                                            teachers.find(
                                                                (item) =>
                                                                    String(
                                                                        item.id
                                                                    ) ===
                                                                    String(
                                                                        form.teacherId
                                                                    )
                                                            );

                                                        if (!teacher) {
                                                            return "-";
                                                        }

                                                        return `${teacher.firstName || ""} ${teacher.lastName || ""}`
                                                            .trim();

                                                    })()}
                                                </p>

                                            </div>


                                            <div>

                                                <p
                                                    className="
                                                        text-[11px]
                                                        text-slate-400
                                                    "
                                                >
                                                    Subject
                                                </p>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                        mt-0.5
                                                    "
                                                >
                                                    {(() => {

                                                        const subject =
                                                            subjects.find(
                                                                (item) =>
                                                                    String(
                                                                        item.id
                                                                    ) ===
                                                                    String(
                                                                        form.subjectId
                                                                    )
                                                            );

                                                        if (!subject) {
                                                            return "-";
                                                        }

                                                        return subject.subjectName;

                                                    })()}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )}


                            {/* ACTIONS */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-col-reverse
                                    sm:flex-row
                                    sm:justify-end
                                    gap-2
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={saving}
                                    className="
                                        h-11
                                        px-5
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        hover:bg-slate-50
                                        text-slate-600
                                        text-sm
                                        font-semibold
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        !form.teacherId ||
                                        !form.subjectId
                                    }
                                    className="
                                        h-11
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
                                        disabled:cursor-not-allowed
                                    "
                                >

                                    {saving ? (

                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />

                                            Assigning...
                                        </>

                                    ) : (

                                        <>
                                            <Plus
                                                size={17}
                                            />

                                            Assign Teacher
                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminTeacherSubject;