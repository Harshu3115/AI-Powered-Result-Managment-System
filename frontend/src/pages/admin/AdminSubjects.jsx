import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    BookOpen,
    X,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Filter,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

import adminSubjectService from "../../services/adminSubjectService";
import adminDepartmentService from "../../services/adminDepartmentService";
import adminSemesterService from "../../services/adminSemesterService";

const AdminSubjects = () => {

    // =====================================================
    // SIDEBAR
    // =====================================================

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // =====================================================
    // DATA
    // =====================================================

    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);

    // =====================================================
    // UI STATES
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [departmentFilter, setDepartmentFilter] =
        useState("");

    const [semesterFilter, setSemesterFilter] =
        useState("");

    // =====================================================
    // MODAL
    // =====================================================

    const [showModal, setShowModal] = useState(false);

    const [editingSubject, setEditingSubject] =
        useState(null);

    const [saving, setSaving] = useState(false);

    const [deleteId, setDeleteId] = useState(null);

    // =====================================================
    // FORM
    // =====================================================

    const emptyForm = {
        subjectCode: "",
        subjectName: "",
        credits: "",
        internalMaxMarks: "",
        externalMaxMarks: "",
        passingMarks: "",
        subjectType: "THEORY",
        semesterId: "",
    };

    const [form, setForm] =
        useState(emptyForm);

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                subjectResponse,
                departmentResponse,
                semesterResponse,
            ] = await Promise.all([
                adminSubjectService.getAllSubjects(),
                adminDepartmentService.getAllDepartments(),
                adminSemesterService.getAllSemesters(),
            ]);

            console.log(
                "SUBJECT API:",
                subjectResponse
            );

            console.log(
                "DEPARTMENT API:",
                departmentResponse
            );

            console.log(
                "SEMESTER API:",
                semesterResponse
            );

            setSubjects(
                subjectResponse?.data || []
            );

            setDepartments(
                departmentResponse?.data || []
            );

            setSemesters(
                semesterResponse?.data || []
            );

        } catch (err) {

            console.error(
                "Failed to load subject data:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load subject data."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =====================================================
    // DEPARTMENT MAP
    // =====================================================

    const departmentMap = useMemo(() => {

        const map = new Map();

        departments.forEach((department) => {

            map.set(
                String(department.id),
                department
            );

        });

        return map;

    }, [departments]);

    // =====================================================
    // AVAILABLE SEMESTERS
    // =====================================================

    const availableSemesters = useMemo(() => {

        // ---------------------------------------------
        // If no department selected
        // ---------------------------------------------

        if (!departmentFilter) {

            return semesters;

        }

        const selectedDepartment =
            departmentMap.get(
                String(departmentFilter)
            );

        const selectedDepartmentName =
            selectedDepartment?.departmentName
                ?.toLowerCase()
                ?.trim();

        // ---------------------------------------------
        // First try semester.departmentId
        // ---------------------------------------------

        const byDepartmentId =
            semesters.filter((semester) => {

                return (
                    semester.departmentId !==
                    null &&
                    semester.departmentId !==
                    undefined &&
                    String(
                        semester.departmentId
                    ) === String(
                        departmentFilter
                    )
                );

            });

        if (byDepartmentId.length > 0) {

            return byDepartmentId;

        }

        // ---------------------------------------------
        // Fallback departmentName
        // ---------------------------------------------

        if (selectedDepartmentName) {

            const byDepartmentName =
                semesters.filter(
                    (semester) => {

                        const name =
                            semester.departmentName
                                ?.toLowerCase()
                                ?.trim();

                        return (
                            name ===
                            selectedDepartmentName
                        );

                    }
                );

            if (
                byDepartmentName.length > 0
            ) {

                return byDepartmentName;

            }
        }

        // ---------------------------------------------
        // Final fallback:
        // derive semesters from subjects
        // ---------------------------------------------

        const semesterMap = new Map();

        subjects.forEach((subject) => {

            if (
                String(
                    subject.departmentId
                ) !==
                String(
                    departmentFilter
                )
            ) {
                return;
            }

            if (
                subject.semesterId ===
                null ||
                subject.semesterId ===
                undefined
            ) {
                return;
            }

            semesterMap.set(
                String(subject.semesterId),
                {
                    id: subject.semesterId,
                    semesterName:
                        subject.semesterName,
                    departmentId:
                        subject.departmentId,
                    departmentName:
                        subject.departmentName,
                }
            );

        });

        return Array.from(
            semesterMap.values()
        );

    }, [
        semesters,
        subjects,
        departmentFilter,
        departmentMap,
    ]);

    // =====================================================
    // FILTER SUBJECTS
    // =====================================================

    const filteredSubjects = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();

        return subjects.filter(
            (subject) => {

                // -------------------------------------
                // SEARCH
                // -------------------------------------

                const searchableText = [
                    subject.subjectCode,
                    subject.subjectName,
                    subject.subjectType,
                    subject.semesterName,
                    subject.courseName,
                    subject.departmentName,
                ]
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined
                    )
                    .join(" ")
                    .toLowerCase();

                const matchesSearch =
                    !searchValue ||
                    searchableText.includes(
                        searchValue
                    );

                // -------------------------------------
                // DEPARTMENT
                // -------------------------------------

                const matchesDepartment =
                    !departmentFilter ||
                    String(
                        subject.departmentId
                    ) ===
                    String(
                        departmentFilter
                    );

                // -------------------------------------
                // SEMESTER
                // -------------------------------------

                const matchesSemester =
                    !semesterFilter ||
                    String(
                        subject.semesterId
                    ) ===
                    String(
                        semesterFilter
                    );

                return (
                    matchesSearch &&
                    matchesDepartment &&
                    matchesSemester
                );

            }
        );

    }, [
        subjects,
        search,
        departmentFilter,
        semesterFilter,
    ]);

    // =====================================================
    // CHANGE DEPARTMENT FILTER
    // =====================================================

    const handleDepartmentFilterChange = (
        e
    ) => {

        const value = e.target.value;

        setDepartmentFilter(value);

        // Reset semester
        setSemesterFilter("");

    };

    // =====================================================
    // RESET FILTER
    // =====================================================

    const resetFilters = () => {

        setSearch("");
        setDepartmentFilter("");
        setSemesterFilter("");

    };

    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {

        setEditingSubject(null);

        setForm(emptyForm);

        setShowModal(true);

    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (subject) => {

        setEditingSubject(subject);

        setForm({
            subjectCode:
                subject.subjectCode || "",

            subjectName:
                subject.subjectName || "",

            credits:
                subject.credits ?? "",

            internalMaxMarks:
                subject.internalMaxMarks ?? "",

            externalMaxMarks:
                subject.externalMaxMarks ?? "",

            passingMarks:
                subject.passingMarks ?? "",

            subjectType:
                subject.subjectType ||
                "THEORY",

            semesterId:
                subject.semesterId || "",
        });

        setShowModal(true);

    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        if (saving) return;

        setShowModal(false);

        setEditingSubject(null);

        setForm(emptyForm);

    };

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleFormChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    // =====================================================
    // SAVE SUBJECT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const payload = {
                subjectCode:
                    form.subjectCode.trim(),

                subjectName:
                    form.subjectName.trim(),

                credits:
                    Number(form.credits),

                internalMaxMarks:
                    Number(
                        form.internalMaxMarks
                    ),

                externalMaxMarks:
                    Number(
                        form.externalMaxMarks
                    ),

                passingMarks:
                    Number(
                        form.passingMarks
                    ),

                subjectType:
                    form.subjectType,

                semesterId:
                    Number(
                        form.semesterId
                    ),
            };

            if (editingSubject) {

                await adminSubjectService.updateSubject(
                    editingSubject.id,
                    payload
                );

            } else {

                await adminSubjectService.addSubject(
                    payload
                );

            }

            closeModal();

            await loadData();

        } catch (err) {

            console.error(
                "Save subject error:",
                err
            );

            alert(
                err?.response?.data?.message ||
                "Failed to save subject."
            );

        } finally {

            setSaving(false);

        }
    };

    // =====================================================
    // DELETE SUBJECT
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this subject?"
            );

        if (!confirmed) return;

        try {

            setDeleteId(id);

            await adminSubjectService.deleteSubject(
                id
            );

            await loadData();

        } catch (err) {

            console.error(
                "Delete subject error:",
                err
            );

            alert(
                err?.response?.data?.message ||
                "Failed to delete subject."
            );

        } finally {

            setDeleteId(null);

        }
    };

    // =====================================================
    // FORM SEMESTERS
    // =====================================================

    const formSemesters = useMemo(() => {

        if (!form.departmentId) {
            return availableSemesters;
        }

        return availableSemesters;

    }, [
        availableSemesters,
        form.departmentId,
    ]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalSubjects =
        subjects.length;

    const theorySubjects =
        subjects.filter(
            (subject) =>
                subject.subjectType ===
                "THEORY"
        ).length;

    const practicalSubjects =
        subjects.filter(
            (subject) =>
                subject.subjectType ===
                "PRACTICAL"
        ).length;

    const projectSubjects =
        subjects.filter(
            (subject) =>
                subject.subjectType ===
                "PROJECT"
        ).length;

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
                        ? "md:ml-[76px]"
                        : "md:ml-[260px]"
                    }
                `}
            >

                <div className="
                    p-4
                    sm:p-5
                    md:p-6
                    lg:p-7
                ">

                    {/* =================================================
                        HEADER
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
                                    flex
                                    items-center
                                    justify-center
                                    text-indigo-600
                                ">
                                    <BookOpen
                                        size={23}
                                    />
                                </div>

                                <div>

                                    <h1 className="
                                        text-2xl
                                        sm:text-3xl
                                        font-bold
                                        text-slate-800
                                    ">
                                        Subjects
                                    </h1>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    ">
                                        Manage academic
                                        subjects by
                                        department and
                                        semester.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={openAddModal}
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
                                hover:bg-indigo-700
                                transition
                                w-full
                                sm:w-auto
                            "
                        >
                            <Plus size={18} />

                            Add Subject
                        </button>

                    </div>

                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <div className="
                        mt-5
                        grid
                        grid-cols-2
                        lg:grid-cols-4
                        gap-3
                        sm:gap-4
                    ">

                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            sm:p-5
                            shadow-sm
                        ">

                            <p className="
                                text-xs
                                sm:text-sm
                                text-slate-500
                            ">
                                Total Subjects
                            </p>

                            <p className="
                                mt-2
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-slate-800
                            ">
                                {totalSubjects}
                            </p>

                        </div>

                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            sm:p-5
                            shadow-sm
                        ">

                            <p className="
                                text-xs
                                sm:text-sm
                                text-slate-500
                            ">
                                Theory
                            </p>

                            <p className="
                                mt-2
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-indigo-600
                            ">
                                {theorySubjects}
                            </p>

                        </div>

                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            sm:p-5
                            shadow-sm
                        ">

                            <p className="
                                text-xs
                                sm:text-sm
                                text-slate-500
                            ">
                                Practical
                            </p>

                            <p className="
                                mt-2
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-emerald-600
                            ">
                                {practicalSubjects}
                            </p>

                        </div>

                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            sm:p-5
                            shadow-sm
                        ">

                            <p className="
                                text-xs
                                sm:text-sm
                                text-slate-500
                            ">
                                Project
                            </p>

                            <p className="
                                mt-2
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-purple-600
                            ">
                                {projectSubjects}
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        FILTER BOX
                    ================================================= */}

                    <div className="
                        mt-5
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        sm:p-5
                        shadow-sm
                    ">

                        <div className="
                            mb-4
                            flex
                            items-center
                            justify-between
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <Filter
                                    size={18}
                                    className="text-indigo-600"
                                />

                                <h2 className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Filters
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-xs
                                    font-medium
                                    text-slate-500
                                    hover:text-indigo-600
                                "
                            >
                                <RefreshCw
                                    size={14}
                                />

                                Reset
                            </button>

                        </div>

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-3
                            gap-3
                        ">

                            {/* SEARCH */}

                            <div className="
                                relative
                                md:col-span-1
                            ">

                                <Search
                                    size={18}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
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
                                    placeholder="
                                        Search subject,
                                        code, course...
                                    "
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        pl-10
                                        pr-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        placeholder:text-slate-400
                                        focus:border-indigo-500
                                        focus:bg-white
                                        focus:ring-2
                                        focus:ring-indigo-100
                                    "
                                />

                            </div>

                            {/* DEPARTMENT */}

                            <select
                                value={departmentFilter}
                                onChange={
                                    handleDepartmentFilterChange
                                }
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:border-indigo-500
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-indigo-100
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
                                                department.departmentName
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            {/* SEMESTER */}

                            <select
                                value={semesterFilter}
                                onChange={(e) =>
                                    setSemesterFilter(
                                        e.target.value
                                    )
                                }
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:border-indigo-500
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-indigo-100
                                "
                            >

                                <option value="">
                                    All Semesters
                                </option>

                                {availableSemesters.map(
                                    (semester) => (
                                        <option
                                            key={
                                                semester.id
                                            }
                                            value={
                                                semester.id
                                            }
                                        >
                                            {
                                                semester.semesterName
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div className="
                            mt-4
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

                    {/* =================================================
                        DESKTOP TABLE
                    ================================================= */}

                    <div className="
                        mt-5
                        hidden
                        md:block
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    ">

                        <div className="
                            overflow-x-auto
                        ">

                            <table className="
                                min-w-[1100px]
                                w-full
                            ">

                                <thead>
                                    <tr className="
                                        border-b
                                        border-slate-200
                                        bg-slate-50
                                    ">

                                        <th className="
                                            px-4
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
                                            px-4
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Subject
                                        </th>

                                        <th className="
                                            px-4
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
                                            px-4
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
                                            px-4
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Type
                                        </th>

                                        <th className="
                                            px-4
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Credits
                                        </th>

                                        <th className="
                                            px-4
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        ">
                                            Marks
                                        </th>

                                        <th className="
                                            px-4
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
                                                colSpan="8"
                                                className="
                                                    px-4
                                                    py-16
                                                    text-center
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >
                                                Loading subjects...
                                            </td>

                                        </tr>

                                    ) : filteredSubjects.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="
                                                    px-4
                                                    py-16
                                                    text-center
                                                "
                                            >

                                                <BookOpen
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
                                                    No subjects found
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    Try changing your
                                                    filters.
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredSubjects.map(
                                            (
                                                subject,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        subject.id
                                                    }
                                                    className="
                                                        border-b
                                                        border-slate-100
                                                        last:border-0
                                                        hover:bg-slate-50
                                                    "
                                                >

                                                    {/* # */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                        text-sm
                                                        text-slate-500
                                                    ">
                                                        {index + 1}
                                                    </td>

                                                    {/* SUBJECT */}

                                                    <td className="
                                                        px-4
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
                                                                flex
                                                                items-center
                                                                justify-center
                                                                text-indigo-600
                                                            ">
                                                                <BookOpen
                                                                    size={18}
                                                                />
                                                            </div>

                                                            <div>

                                                                <p className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-800
                                                                ">
                                                                    {
                                                                        subject.subjectName
                                                                    }
                                                                </p>

                                                                <p className="
                                                                    mt-0.5
                                                                    text-xs
                                                                    text-indigo-600
                                                                    font-medium
                                                                ">
                                                                    {
                                                                        subject.subjectCode
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* DEPARTMENT */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    ">
                                                        {
                                                            subject.departmentName ||
                                                            "—"
                                                        }
                                                    </td>

                                                    {/* SEMESTER */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    ">
                                                        {
                                                            subject.semesterName ||
                                                            "—"
                                                        }
                                                    </td>

                                                    {/* TYPE */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                    ">

                                                        <span
                                                            className={`
                                                                inline-flex
                                                                rounded-lg
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-semibold

                                                                ${subject.subjectType ===
                                                                    "THEORY"
                                                                    ? "bg-indigo-50 text-indigo-600"
                                                                    : subject.subjectType ===
                                                                        "PRACTICAL"
                                                                        ? "bg-emerald-50 text-emerald-600"
                                                                        : "bg-purple-50 text-purple-600"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                subject.subjectType
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* CREDITS */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                    ">
                                                        {
                                                            subject.credits
                                                        }
                                                    </td>

                                                    {/* MARKS */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                    ">

                                                        <p className="
                                                            text-xs
                                                            text-slate-500
                                                        ">
                                                            Internal:{" "}
                                                            {
                                                                subject.internalMaxMarks
                                                            }
                                                        </p>

                                                        <p className="
                                                            mt-1
                                                            text-xs
                                                            text-slate-500
                                                        ">
                                                            External:{" "}
                                                            {
                                                                subject.externalMaxMarks
                                                            }
                                                        </p>

                                                        <p className="
                                                            mt-1
                                                            text-xs
                                                            font-medium
                                                            text-slate-700
                                                        ">
                                                            Pass:{" "}
                                                            {
                                                                subject.passingMarks
                                                            }
                                                        </p>

                                                    </td>

                                                    {/* ACTIONS */}

                                                    <td className="
                                                        px-4
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
                                                                    openEditModal(
                                                                        subject
                                                                    )
                                                                }
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-slate-500
                                                                    hover:bg-indigo-50
                                                                    hover:text-indigo-600
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
                                                                    handleDelete(
                                                                        subject.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleteId ===
                                                                    subject.id
                                                                }
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-slate-500
                                                                    hover:bg-red-50
                                                                    hover:text-red-600
                                                                    disabled:opacity-50
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

                        {/* TABLE FOOTER */}

                        <div className="
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-slate-200
                            px-4
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        ">

                            <p className="
                                text-sm
                                text-slate-500
                            ">
                                Showing{" "}
                                <span className="
                                    font-semibold
                                    text-slate-700
                                ">
                                    {filteredSubjects.length}
                                </span>{" "}
                                of{" "}
                                <span className="
                                    font-semibold
                                    text-slate-700
                                ">
                                    {subjects.length}
                                </span>{" "}
                                subjects
                            </p>

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <button
                                    type="button"
                                    disabled
                                    className="
                                        h-9
                                        w-9
                                        rounded-lg
                                        border
                                        border-slate-200
                                        flex
                                        items-center
                                        justify-center
                                        text-slate-300
                                    "
                                >
                                    <ChevronLeft
                                        size={17}
                                    />
                                </button>

                                <span className="
                                    text-sm
                                    text-slate-600
                                ">
                                    Page 1 of 1
                                </span>

                                <button
                                    type="button"
                                    disabled
                                    className="
                                        h-9
                                        w-9
                                        rounded-lg
                                        border
                                        border-slate-200
                                        flex
                                        items-center
                                        justify-center
                                        text-slate-300
                                    "
                                >
                                    <ChevronRight
                                        size={17}
                                    />
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        MOBILE CARDS
                    ================================================= */}

                    <div className="
                        mt-5
                        space-y-3
                        md:hidden
                    ">

                        {loading ? (

                            <div className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-8
                                text-center
                                text-sm
                                text-slate-500
                            ">
                                Loading subjects...
                            </div>

                        ) : filteredSubjects.length === 0 ? (

                            <div className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-8
                                text-center
                            ">

                                <BookOpen
                                    size={35}
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
                                    No subjects found
                                </p>

                            </div>

                        ) : (

                            filteredSubjects.map(
                                (subject) => (

                                    <div
                                        key={
                                            subject.id
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
                                            ">

                                                <div className="
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    rounded-xl
                                                    bg-indigo-50
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-indigo-600
                                                ">
                                                    <BookOpen
                                                        size={18}
                                                    />
                                                </div>

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        font-semibold
                                                        text-indigo-600
                                                    ">
                                                        {
                                                            subject.subjectCode
                                                        }
                                                    </p>

                                                    <h3 className="
                                                        mt-0.5
                                                        text-sm
                                                        font-semibold
                                                        text-slate-800
                                                    ">
                                                        {
                                                            subject.subjectName
                                                        }
                                                    </h3>

                                                </div>

                                            </div>

                                            <span
                                                className={`
                                                    shrink-0
                                                    rounded-lg
                                                    px-2
                                                    py-1
                                                    text-[10px]
                                                    font-semibold

                                                    ${subject.subjectType ===
                                                        "THEORY"
                                                        ? "bg-indigo-50 text-indigo-600"
                                                        : subject.subjectType ===
                                                            "PRACTICAL"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-purple-50 text-purple-600"
                                                    }
                                                `}
                                            >
                                                {
                                                    subject.subjectType
                                                }
                                            </span>

                                        </div>

                                        {/* CARD INFO */}

                                        <div className="
                                            mt-4
                                            space-y-2
                                            border-t
                                            border-slate-100
                                            pt-3
                                        ">

                                            <div className="
                                                flex
                                                justify-between
                                                gap-3
                                            ">

                                                <span className="
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    Department
                                                </span>

                                                <span className="
                                                    max-w-[65%]
                                                    text-right
                                                    text-xs
                                                    font-medium
                                                    text-slate-700
                                                ">
                                                    {
                                                        subject.departmentName ||
                                                        "—"
                                                    }
                                                </span>

                                            </div>

                                            <div className="
                                                flex
                                                justify-between
                                                gap-3
                                            ">

                                                <span className="
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    Semester
                                                </span>

                                                <span className="
                                                    text-xs
                                                    font-medium
                                                    text-slate-700
                                                ">
                                                    {
                                                        subject.semesterName ||
                                                        "—"
                                                    }
                                                </span>

                                            </div>

                                            <div className="
                                                flex
                                                justify-between
                                                gap-3
                                            ">

                                                <span className="
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    Credits
                                                </span>

                                                <span className="
                                                    text-xs
                                                    font-semibold
                                                    text-slate-700
                                                ">
                                                    {
                                                        subject.credits
                                                    }
                                                </span>

                                            </div>

                                            <div className="
                                                flex
                                                justify-between
                                                gap-3
                                            ">

                                                <span className="
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    Marks
                                                </span>

                                                <span className="
                                                    text-right
                                                    text-xs
                                                    font-medium
                                                    text-slate-700
                                                ">
                                                    {
                                                        subject.internalMaxMarks
                                                    }{" "}
                                                    +{" "}
                                                    {
                                                        subject.externalMaxMarks
                                                    }
                                                    {" "}
                                                    / Pass{" "}
                                                    {
                                                        subject.passingMarks
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                        {/* CARD ACTIONS */}

                                        <div className="
                                            mt-4
                                            flex
                                            gap-2
                                        ">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditModal(
                                                        subject
                                                    )
                                                }
                                                className="
                                                    flex-1
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-lg
                                                    border
                                                    border-indigo-200
                                                    py-2
                                                    text-xs
                                                    font-semibold
                                                    text-indigo-600
                                                    hover:bg-indigo-50
                                                "
                                            >
                                                <Pencil
                                                    size={14}
                                                />

                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        subject.id
                                                    )
                                                }
                                                className="
                                                    flex-1
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-lg
                                                    border
                                                    border-red-200
                                                    py-2
                                                    text-xs
                                                    font-semibold
                                                    text-red-600
                                                    hover:bg-red-50
                                                "
                                            >
                                                <Trash2
                                                    size={14}
                                                />

                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )

                        )}

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
                    p-3
                    sm:p-5
                ">

                    <div className="
                        w-full
                        max-w-2xl
                        max-h-[92vh]
                        overflow-y-auto
                        rounded-2xl
                        bg-white
                        shadow-2xl
                    ">

                        {/* MODAL HEADER */}

                        <div className="
                            sticky
                            top-0
                            z-10
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-200
                            bg-white
                            px-4
                            py-4
                            sm:px-6
                        ">

                            <div>

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                ">
                                    {editingSubject
                                        ? "Edit Subject"
                                        : "Add Subject"}
                                </h2>

                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-slate-400
                                ">
                                    Enter subject academic
                                    information.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
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
                            className="
                                p-4
                                sm:p-6
                            "
                        >

                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                            ">

                                {/* DEPARTMENT */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Department
                                    </label>

                                    <select
                                        value={
                                            form.departmentId ||
                                            ""
                                        }
                                        onChange={(e) => {

                                            const departmentId =
                                                e.target.value;

                                            setForm(
                                                (previous) => ({
                                                    ...previous,
                                                    departmentId,
                                                    semesterId:
                                                        "",
                                                })
                                            );

                                        }}
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
                                        required
                                    >

                                        <option value="">
                                            Select Department
                                        </option>

                                        {departments.map(
                                            (
                                                department
                                            ) => (

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

                                {/* SEMESTER */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Semester
                                    </label>

                                    <select
                                        name="semesterId"
                                        value={
                                            form.semesterId
                                        }
                                        onChange={
                                            handleFormChange
                                        }
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
                                            disabled:bg-slate-50
                                        "
                                        required
                                        disabled={
                                            !form.departmentId
                                        }
                                    >

                                        <option value="">
                                            {!form.departmentId
                                                ? "Select department first"
                                                : "Select Semester"}
                                        </option>

                                        {formSemesters.map(
                                            (
                                                semester
                                            ) => (

                                                <option
                                                    key={
                                                        semester.id
                                                    }
                                                    value={
                                                        semester.id
                                                    }
                                                >
                                                    {
                                                        semester.semesterName
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                {/* SUBJECT CODE */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Subject Code
                                    </label>

                                    <input
                                        type="text"
                                        name="subjectCode"
                                        value={
                                            form.subjectCode
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="e.g. CS601"
                                        maxLength={20}
                                        required
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

                                {/* SUBJECT NAME */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Subject Name
                                    </label>

                                    <input
                                        type="text"
                                        name="subjectName"
                                        value={
                                            form.subjectName
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="e.g. Database Management"
                                        maxLength={100}
                                        required
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

                                {/* CREDITS */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Credits
                                    </label>

                                    <input
                                        type="number"
                                        name="credits"
                                        value={
                                            form.credits
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        min="1"
                                        max="10"
                                        required
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

                                {/* TYPE */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Subject Type
                                    </label>

                                    <select
                                        name="subjectType"
                                        value={
                                            form.subjectType
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        required
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
                                    >

                                        <option value="THEORY">
                                            Theory
                                        </option>

                                        <option value="PRACTICAL">
                                            Practical
                                        </option>

                                        <option value="PROJECT">
                                            Project
                                        </option>

                                    </select>

                                </div>

                                {/* INTERNAL */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Internal Max Marks
                                    </label>

                                    <input
                                        type="number"
                                        name="internalMaxMarks"
                                        value={
                                            form.internalMaxMarks
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        min="0"
                                        max="100"
                                        required
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

                                {/* EXTERNAL */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        External Max Marks
                                    </label>

                                    <input
                                        type="number"
                                        name="externalMaxMarks"
                                        value={
                                            form.externalMaxMarks
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        min="0"
                                        max="100"
                                        required
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

                                {/* PASSING */}

                                <div className="
                                    sm:col-span-2
                                ">

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Passing Marks
                                    </label>

                                    <input
                                        type="number"
                                        name="passingMarks"
                                        value={
                                            form.passingMarks
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        min="0"
                                        max="100"
                                        required
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

                            {/* FORM ACTIONS */}

                            <div className="
                                mt-6
                                flex
                                flex-col-reverse
                                gap-2
                                sm:flex-row
                                sm:justify-end
                            ">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        hover:bg-slate-50
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        rounded-xl
                                        bg-indigo-600
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        hover:bg-indigo-700
                                        disabled:opacity-50
                                    "
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingSubject
                                            ? "Update Subject"
                                            : "Add Subject"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminSubjects;