
import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    Users,
    RefreshCw,
    X,
} from "lucide-react";
import { toast } from "react-toastify";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import StudentFormModal from "../../components/admin/StudentFormModal";
import adminStudentService from "../../services/adminStudentService";
import adminSemesterService from "../../services/adminSemesterService";


const AdminStudents = () => {

    const [collapsed, setCollapsed] =
        useState(false);
    const [mobileOpen, setMobileOpen] =
        useState(false);

    const [students, setStudents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [selectedStudent, setSelectedStudent] =
        useState(null);

    const [showModal, setShowModal] =
        useState(false);

    const [editingStudent, setEditingStudent] =
        useState(null);

    const [deleteId, setDeleteId] =
        useState(null);

    const [showDelete, setShowDelete] =
        useState(false);

    const [semesters, setSemesters] = useState([]);
    const [semesterLoading, setSemesterLoading] = useState(false);

    const STUDENTS_PER_PAGE = 10;

    const [currentPage, setCurrentPage] = useState(1);


    // =====================================================
    // LOAD STUDENTS
    // =====================================================

    const loadStudents = async () => {

        try {

            setLoading(true);

            const response =
                await adminStudentService.getAllStudents();

            console.log(
                "Admin Students API:",
                response
            );

            if (response?.success) {

                setStudents(
                    response.data || []
                );

            } else {

                toast.error(
                    response?.message ||
                    "Failed to load students"
                );

            }

        } catch (error) {

            console.error(
                "Load students error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Unable to load students"
            );

        } finally {

            setLoading(false);

        }
    };



    const loadSemesters = async () => {
        try {
            setSemesterLoading(true);

            const response =
                await adminSemesterService.getAllSemesters();

            console.log(
                "Admin Semesters API:",
                response
            );

            if (response?.success) {
                setSemesters(response.data || []);
            } else {
                toast.error(
                    response?.message ||
                    "Failed to load semesters"
                );
            }

        } catch (error) {
            console.error(
                "Load semesters error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Unable to load semesters"
            );

        } finally {
            setSemesterLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
        loadSemesters();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredStudents = useMemo(() => {

        const value =
            search.trim().toLowerCase();

        if (!value) {
            return students;
        }

        return students.filter((student) => {

            return (
                student.firstName
                    ?.toLowerCase()
                    .includes(value) ||

                student.lastName
                    ?.toLowerCase()
                    .includes(value) ||

                student.rollNo
                    ?.toLowerCase()
                    .includes(value) ||

                student.enrollmentNo
                    ?.toLowerCase()
                    .includes(value) ||

                String(student.prnNo || "")
                    .includes(value) ||

                student.email
                    ?.toLowerCase()
                    .includes(value) ||

                student.username
                    ?.toLowerCase()
                    .includes(value) ||

                student.courseName
                    ?.toLowerCase()
                    .includes(value) ||

                student.departmentName
                    ?.toLowerCase()
                    .includes(value)
            );

        });

    }, [students, search]);


    // =====================================================
    // PAGINATED STUDENTS
    // =====================================================

    const totalPages = Math.ceil(
        filteredStudents.length / STUDENTS_PER_PAGE
    );

    const paginatedStudents = useMemo(() => {
        const startIndex =
            (currentPage - 1) * STUDENTS_PER_PAGE;

        const endIndex =
            startIndex + STUDENTS_PER_PAGE;

        return filteredStudents.slice(
            startIndex,
            endIndex
        );
    }, [filteredStudents, currentPage]);


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        setEditingStudent(null);
        setShowModal(true);

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = async (student) => {

        try {

            const response =
                await adminStudentService.getStudentById(
                    student.id
                );

            if (response?.success) {

                setEditingStudent(
                    response.data
                );

            } else {

                setEditingStudent(student);

            }

            setShowModal(true);

        } catch (error) {

            console.error(
                "Get student error:",
                error
            );

            setEditingStudent(student);
            setShowModal(true);

        }

    };


    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (data) => {

        try {

            setSaving(true);

            let response;

            if (editingStudent) {

                response =
                    await adminStudentService.updateStudent(
                        editingStudent.id,
                        data
                    );

            } else {

                response =
                    await adminStudentService.addStudent(
                        data
                    );

            }

            if (response?.success) {

                toast.success(
                    response.message ||
                    (
                        editingStudent
                            ? "Student updated successfully"
                            : "Student added successfully"
                    )
                );

                setShowModal(false);
                setEditingStudent(null);

                await loadStudents();

            } else {

                toast.error(
                    response?.message ||
                    "Operation failed"
                );

            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Unable to save student"
            );


        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const confirmDelete = (student) => {

        setDeleteId(student.id);
        setSelectedStudent(student);
        setShowDelete(true);

    };


    const handleDelete = async () => {

        try {

            const response =
                await adminStudentService.deleteStudent(
                    deleteId
                );

            if (response?.success) {

                toast.success(
                    response.message ||
                    "Student deleted successfully"
                );

                setShowDelete(false);
                setSelectedStudent(null);
                setDeleteId(null);

                await loadStudents();

            } else {

                toast.error(
                    response?.message ||
                    "Unable to delete student"
                );

            }

        } catch (error) {

            console.error(
                "Delete student error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Unable to delete student"
            );

        }

    };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (student) => {

        setSelectedStudent(student);

    };


    return (
        <div className="
            min-h-screen
            bg-slate-50
        ">

            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <AdminTopbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />


            <main
                className={`
        min-h-screen
        w-full
        min-w-0
        overflow-x-hidden
        pt-[72px]
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
    lg:p-8
">

                    {/* HEADER */}

                    <div className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    ">

                        <div>

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <Users
                                    size={22}
                                    className="
                                        text-indigo-600
                                    "
                                />

                                <h1 className="
                                    text-2xl
                                    font-bold
                                    text-slate-800
                                ">
                                    Students
                                </h1>

                            </div>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                Manage all students in the
                                Student Result Management System.
                            </p>

                        </div>


                        <button
                            onClick={handleAdd}
                            className="
    h-10
    sm:h-11
    w-full
    sm:w-auto
    rounded-xl
    bg-indigo-600
    px-4
    sm:px-5
    text-sm
    font-semibold
    text-white
    flex
    items-center
    justify-center
    gap-2
    hover:bg-indigo-700
    shadow-sm
"
                        >
                            <Plus size={18} />
                            Add Student
                        </button>

                    </div>


                    {/* TOOLBAR */}

                    <div className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                    ">

                        <div className="
                            flex
                            flex-col
                            gap-3
                            md:flex-row
                            md:items-center
                            md:justify-between
                        ">

                            {/* SEARCH */}

                            <div
                                className="
        flex
        h-11
        w-full
        md:max-w-md
        items-center
        gap-0
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
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search students..."
                                    className="
            ml-1
            w-full
            bg-transparent
            text-sm
            text-slate-700
            outline-none
        "
                                />

                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        className="
                text-slate-400
            "
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>


                            <button
                                onClick={loadStudents}
                                disabled={loading}
                                className="
        h-11
        w-full
        md:w-auto
        rounded-xl
        border
        border-slate-200
        px-4
        text-sm
        font-medium
        text-slate-600
        flex
        items-center
        justify-center
        gap-2
        hover:bg-slate-50
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


                    {/* TABLE */}

                    <div className="
                        mt-5
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

                                <thead className="
                                    bg-slate-50
                                    border-b
                                    border-slate-200
                                ">

                                    <tr>

                                        <th className="
    px-5
    py-3
    text-left
    text-xs
    font-semibold
    uppercase
    tracking-wider
    text-slate-500
">
                                            Student
                                        </th>

                                        <th className="
    px-5
    py-3
    text-left
    text-xs
    font-semibold
    uppercase
    tracking-wider
    text-slate-500
">
                                            Roll No
                                        </th>

                                        <th className="
    px-5
    py-3
    text-left
    text-xs
    font-semibold
    uppercase
    tracking-wider
    text-slate-500
">
                                            PRN
                                        </th>

                                        <th className="
    px-5
    py-3
    text-left
    text-xs
    font-semibold
    uppercase
    tracking-wider
    text-slate-500
">
                                            Course
                                        </th>

                                        <th className="
    px-5
    py-3
    text-left
    text-xs
    font-semibold
    uppercase
    tracking-wider
    text-slate-500
">
                                            Department
                                        </th>

                                        <th className="
    px-5
    py-3
    text-left
    text-xs
    font-semibold
    uppercase
    tracking-wider
    text-slate-500
">
                                            Semester
                                        </th>

                                        <th className="
    px-5
    py-3
    text-left
    text-xs
    font-semibold
    uppercase
    tracking-wider
    text-slate-500

                                            text-right
                                        " colSpan={3}>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody
                                    className="
                                        divide-y
                                        divide-slate-100
                                    "
                                >

                                    {loading ? (

                                        Array.from({
                                            length: 6
                                        }).map((_, index) => (

                                            <tr key={index}>

                                                <td
                                                    colSpan="7"
                                                    className="p-5"
                                                >
                                                    <div className="
                                                        h-6
                                                        animate-pulse
                                                        rounded-lg
                                                        bg-slate-100
                                                    " />
                                                </td>

                                            </tr>

                                        ))

                                    ) : filteredStudents.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="
                                                    px-6
                                                    py-16
                                                    text-center
                                                "
                                            >

                                                <Users
                                                    size={36}
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
                                                    No students found
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    Try changing your
                                                    search.
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        paginatedStudents.map(
                                            (student) => (

                                                <tr
                                                    key={student.id}
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

                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        ">

                                                            <div className="
                                                                h-10
                                                                w-10
                                                                shrink-0
                                                                rounded-full
                                                                bg-indigo-50
                                                                text-indigo-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                                font-semibold
                                                                text-sm
                                                            ">
                                                                {student.firstName
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()}
                                                            </div>

                                                            <div>

                                                                <p className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-700
                                                                ">
                                                                    {
                                                                        student.firstName
                                                                    }{" "}
                                                                    {
                                                                        student.lastName
                                                                    }
                                                                </p>

                                                                <p className="
                                                                    text-xs
                                                                    text-slate-400
                                                                ">
                                                                    {
                                                                        student.email
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    ">
                                                        {
                                                            student.rollNo
                                                        }
                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    ">
                                                        {
                                                            student.prnNo
                                                        }
                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    ">
                                                        {
                                                            student.courseName ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    ">
                                                        {
                                                            student.departmentName ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">

                                                        <span className="
                                                            rounded-lg
                                                            bg-indigo-50
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-indigo-600
                                                        ">
                                                            {
                                                                student.semesterName ||
                                                                "-"
                                                            }
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
                                                            justify-end
                                                            gap-1
                                                        ">

                                                            <button
                                                                onClick={() =>
                                                                    handleView(
                                                                        student
                                                                    )
                                                                }
                                                                title="View"
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    text-slate-400
                                                                    hover:bg-slate-100
                                                                    hover:text-indigo-600
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                "
                                                            >
                                                                <Eye
                                                                    size={17}
                                                                />
                                                            </button>


                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        student
                                                                    )
                                                                }
                                                                title="Edit"
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    text-slate-400
                                                                    hover:bg-indigo-50
                                                                    hover:text-indigo-600
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                "
                                                            >
                                                                <Edit3
                                                                    size={17}
                                                                />
                                                            </button>


                                                            <button
                                                                onClick={() =>
                                                                    confirmDelete(
                                                                        student
                                                                    )
                                                                }
                                                                title="Delete"
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    rounded-lg
                                                                    text-slate-400
                                                                    hover:bg-red-50
                                                                    hover:text-red-600
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                "
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


                        {/* FOOTER */}

                        {/* =====================================================
    PAGINATION FOOTER
===================================================== */}

                        {!loading && (
                            <div className="
        border-t
        border-slate-100
        px-5
        py-4
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
    ">

                                {/* LEFT SIDE */}
                                <p className="
            text-xs
            text-slate-400
        ">
                                    Showing{" "}
                                    <span className="
                font-semibold
                text-slate-600
            ">
                                        {filteredStudents.length === 0
                                            ? 0
                                            : (currentPage - 1) *
                                            STUDENTS_PER_PAGE +
                                            1}
                                    </span>

                                    {" - "}

                                    <span className="
                font-semibold
                text-slate-600
            ">
                                        {Math.min(
                                            currentPage *
                                            STUDENTS_PER_PAGE,
                                            filteredStudents.length
                                        )}
                                    </span>

                                    {" of "}

                                    <span className="
                font-semibold
                text-slate-600
            ">
                                        {filteredStudents.length}
                                    </span>

                                    {" students"}
                                </p>

                                {/* RIGHT SIDE */}
                                {totalPages > 1 && (
                                    <div className="
                flex
                items-center
                gap-1
            ">

                                        {/* PREVIOUS */}
                                        <button
                                            onClick={() =>
                                                setCurrentPage(
                                                    (prev) =>
                                                        Math.max(
                                                            prev - 1,
                                                            1
                                                        )
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="
                        h-9
                        min-w-9
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        font-medium
                        text-slate-600
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                                        >
                                            Previous
                                        </button>

                                        {/* PAGE NUMBERS */}
                                        {Array.from(
                                            { length: totalPages },
                                            (_, index) => index + 1
                                        ).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                                className={`
                            h-9
                            min-w-9
                            rounded-lg
                            px-3
                            text-sm
                            font-medium
                            transition
                            ${currentPage === page
                                                        ? "bg-indigo-600 text-white shadow-sm"
                                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                    }
                        `}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {/* NEXT */}
                                        <button
                                            onClick={() =>
                                                setCurrentPage(
                                                    (prev) =>
                                                        Math.min(
                                                            prev + 1,
                                                            totalPages
                                                        )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="
                        h-9
                        min-w-9
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        font-medium
                        text-slate-600
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                                        >
                                            Next
                                        </button>

                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                </div>

            </main>


            {/* FORM MODAL */}

            <StudentFormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                }}
                onSubmit={handleSubmit}
                editingStudent={editingStudent}
                semesters={semesters}
                loading={saving || semesterLoading}
            />


            {/* VIEW MODAL */}

            {selectedStudent && !showDelete && (
                <div className="
                    fixed
                    inset-0
                    z-[90]
                    flex
                    items-center
                    justify-center
                    bg-slate-900/40
                    backdrop-blur-sm
                    p-4
                ">

                    <div className="
                        w-full
                        max-w-lg
                        rounded-2xl
                        bg-white
                        shadow-2xl
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-200
                            px-6
                            py-4
                        ">

                            <h2 className="
                                text-lg
                                font-bold
                                text-slate-800
                            ">
                                Student Details
                            </h2>

                            <button
                                onClick={() =>
                                    setSelectedStudent(null)
                                }
                                className="
                                    h-9
                                    w-9
                                    rounded-lg
                                    text-slate-400
                                    hover:bg-slate-100
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <X size={19} />
                            </button>

                        </div>


                        <div className="p-6">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    h-14
                                    w-14
                                    rounded-full
                                    bg-indigo-50
                                    text-indigo-600
                                    flex
                                    items-center
                                    justify-center
                                    text-lg
                                    font-bold
                                ">
                                    {selectedStudent.firstName
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div>

                                    <h3 className="
                                        font-bold
                                        text-slate-800
                                    ">
                                        {
                                            selectedStudent.firstName
                                        }{" "}
                                        {
                                            selectedStudent.lastName
                                        }
                                    </h3>

                                    <p className="
                                        text-sm
                                        text-slate-400
                                    ">
                                        {
                                            selectedStudent.email
                                        }
                                    </p>

                                </div>

                            </div>


                            <div className="
                                mt-6
                                grid
                                grid-cols-2
                                gap-4
                            ">

                                {[
                                    [
                                        "Roll No",
                                        selectedStudent.rollNo
                                    ],
                                    [
                                        "Enrollment",
                                        selectedStudent.enrollmentNo
                                    ],
                                    [
                                        "PRN",
                                        selectedStudent.prnNo
                                    ],
                                    [
                                        "Username",
                                        selectedStudent.username
                                    ],
                                    [
                                        "Mobile",
                                        selectedStudent.mobile
                                    ],
                                    [
                                        "Gender",
                                        selectedStudent.gender
                                    ],
                                    [
                                        "Course",
                                        selectedStudent.courseName
                                    ],
                                    [
                                        "Department",
                                        selectedStudent.departmentName
                                    ],
                                ].map(
                                    ([label, value]) => (

                                        <div key={label}>

                                            <p className="
                                                text-[11px]
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            ">
                                                {label}
                                            </p>

                                            <p className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-slate-700
                                            ">
                                                {value || "-"}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}


            {/* DELETE MODAL */}

            {showDelete && selectedStudent && (
                <div className="
                    fixed
                    inset-0
                    z-[110]
                    flex
                    items-center
                    justify-center
                    bg-slate-900/40
                    backdrop-blur-sm
                    p-4
                ">

                    <div className="
                        w-full
                        max-w-sm
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-2xl
                    ">

                        <div className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-red-50
                            text-red-600
                        ">
                            <Trash2 size={22} />
                        </div>

                        <h2 className="
                            mt-4
                            text-center
                            text-lg
                            font-bold
                            text-slate-800
                        ">
                            Delete Student?
                        </h2>

                        <p className="
                            mt-2
                            text-center
                            text-sm
                            text-slate-500
                        ">
                            Are you sure you want to delete{" "}
                            <span className="
                                font-semibold
                                text-slate-700
                            ">
                                {selectedStudent.firstName}{" "}
                                {selectedStudent.lastName}
                            </span>
                            ?
                        </p>

                        <div className="
                            mt-6
                            flex
                            gap-3
                        ">

                            <button
                                onClick={() => {
                                    setShowDelete(false);
                                    setSelectedStudent(null);
                                }}
                                className="
                                    h-11
                                    flex-1
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
                                onClick={handleDelete}
                                className="
                                    h-11
                                    flex-1
                                    rounded-xl
                                    bg-red-600
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-red-700
                                "
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminStudents;