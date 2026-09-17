import { useEffect, useMemo, useState } from "react";
import {
    Building2,
    Plus,
    Search,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

import { toast } from "react-toastify";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import DepartmentFormModal from "../../components/admin/DepartmentFormModal";

import adminDepartmentService from "../../services/adminDepartmentService";


function AdminDepartments() {

    // =====================================================
    // STATES
    // =====================================================

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [editingDepartment, setEditingDepartment] =
        useState(null);

    const [deleteDepartment, setDeleteDepartment] =
        useState(null);

    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;
    const [collapsed, setCollapsed] = useState(false);


    const [mobileOpen, setMobileOpen] =
        useState(false);


    // =====================================================
    // GET DEPARTMENTS
    // =====================================================

    const loadDepartments = async () => {

        try {

            setLoading(true);

            const response =
                await adminDepartmentService
                    .getAllDepartments();

            if (response?.success) {

                setDepartments(
                    response.data || []
                );

            } else {

                setDepartments([]);

                toast.error(
                    response?.message ||
                    "Failed to load departments."
                );
            }

        } catch (error) {

            setDepartments([]);

            toast.error(
                error?.response?.data?.message ||
                "Unable to load departments."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadDepartments();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredDepartments = useMemo(() => {

        const value =
            search.trim().toLowerCase();

        if (!value) {
            return departments;
        }

        return departments.filter(
            (department) =>
                department.departmentCode
                    ?.toLowerCase()
                    .includes(value) ||

                department.departmentName
                    ?.toLowerCase()
                    .includes(value) ||

                department.description
                    ?.toLowerCase()
                    .includes(value)
        );

    }, [departments, search]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.ceil(
            filteredDepartments.length /
            itemsPerPage
        );


    const safeCurrentPage =
        Math.min(
            currentPage,
            Math.max(totalPages, 1)
        );


    const startIndex =
        (safeCurrentPage - 1) *
        itemsPerPage;


    const currentDepartments =
        filteredDepartments.slice(
            startIndex,
            startIndex + itemsPerPage
        );


    // =====================================================
    // SEARCH PAGE RESET
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =====================================================
    // ADD DEPARTMENT
    // =====================================================

    const handleAdd = () => {

        setEditingDepartment(null);

        setShowModal(true);
    };


    // =====================================================
    // EDIT DEPARTMENT
    // =====================================================

    const handleEdit = (department) => {

        setEditingDepartment(
            department
        );

        setShowModal(true);
    };


    // =====================================================
    // ADD / UPDATE
    // =====================================================

    const handleSubmit = async (formData) => {

        try {

            setSaving(true);

            let response;

            if (editingDepartment) {

                response =
                    await adminDepartmentService
                        .updateDepartment(
                            editingDepartment.id,
                            formData
                        );

            } else {

                response =
                    await adminDepartmentService
                        .addDepartment(
                            formData
                        );
            }


            if (response?.success) {

                toast.success(
                    response.message ||
                    (
                        editingDepartment
                            ? "Department updated successfully."
                            : "Department added successfully."
                    )
                );


                setShowModal(false);

                setEditingDepartment(null);

                await loadDepartments();

            } else {

                toast.error(
                    response?.message ||
                    "Operation failed."
                );
            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Something went wrong."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleDeleteClick = (department) => {

        setDeleteDepartment(
            department
        );
    };


    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const confirmDelete = async () => {

        if (!deleteDepartment) {
            return;
        }

        try {

            setDeleting(true);

            const response =
                await adminDepartmentService
                    .deleteDepartment(
                        deleteDepartment.id
                    );


            if (response?.success) {

                toast.success(
                    response.message ||
                    "Department deleted successfully."
                );


                setDepartments((prev) =>
                    prev.filter(
                        (item) =>
                            item.id !==
                            deleteDepartment.id
                    )
                );


                setDeleteDepartment(null);

            } else {

                toast.error(
                    response?.message ||
                    "Unable to delete department."
                );
            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to delete department."
            );

        } finally {

            setDeleting(false);

        }
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeFormModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        setEditingDepartment(null);
    };


    return (
        <div className="min-h-screen bg-slate-50">

            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <AdminSidebar
                activePage="Departments"
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main
                className={`
        min-h-screen
        pt-[72px]
        transition-all
        duration-300

        ml-0

        md:${collapsed
                        ? "ml-[76px]"
                        : "ml-[260px]"
                    }
    `}
            >

                {/* ================================================= */}
                {/* TOPBAR */}
                {/* ================================================= */}

                <AdminTopbar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div className="p-4 sm:p-5 md:p-6">


                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <div
                        className="
                            mb-6
                            flex
                            flex-col
                            gap-4
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
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
                                    <Building2
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
                                        Departments
                                    </h1>

                                    <p
                                        className="
                                            mt-0.5
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        Manage your academic
                                        departments
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ADD BUTTON */}

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="
                                inline-flex
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

                            Add Department
                        </button>

                    </div>


                    {/* ================================================= */}
                    {/* SEARCH CARD */}
                    {/* ================================================= */}

                    <div
                        className="
                            mb-5
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                relative
                                max-w-md
                            "
                        >

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
                                placeholder="Search Department"
                                className="
                                    h-10
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    pl-10
                                    pr-10
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                "
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                        hover:text-slate-700
                                    "
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* TABLE */}
                    {/* ================================================= */}

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

                            <table className="w-full">

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
                                                px-6
                                                py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            "
                                        >
                                            #
                                        </th>

                                        <th
                                            className="
                                                px-6
                                                py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            "
                                        >
                                            Department Code
                                        </th>

                                        <th
                                            className="
                                                px-6
                                                py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            "
                                        >
                                            Department Name
                                        </th>

                                        <th
                                            className="
                                                px-6
                                                py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            "
                                        >
                                            Description
                                        </th>

                                        <th
                                            className="
                                                px-6
                                                py-4
                                                text-right
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
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
                                                colSpan="5"
                                                className="
                                                    px-6
                                                    py-16
                                                    text-center
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        items-center
                                                        justify-center
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            h-8
                                                            w-8
                                                            animate-spin
                                                            rounded-full
                                                            border-2
                                                            border-slate-200
                                                            border-t-indigo-600
                                                        "
                                                    />

                                                    <p
                                                        className="
                                                            mt-3
                                                            text-sm
                                                            text-slate-500
                                                        "
                                                    >
                                                        Loading departments...
                                                    </p>

                                                </div>

                                            </td>

                                        </tr>
                                    )}


                                    {/* EMPTY */}

                                    {!loading &&
                                        currentDepartments.length === 0 && (
                                            <tr>

                                                <td
                                                    colSpan="5"
                                                    className="
                                                        px-6
                                                        py-16
                                                        text-center
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            flex-col
                                                            items-center
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                h-14
                                                                w-14
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-slate-100
                                                                text-slate-400
                                                            "
                                                        >
                                                            <Building2
                                                                size={25}
                                                            />
                                                        </div>

                                                        <h3
                                                            className="
                                                                mt-4
                                                                text-sm
                                                                font-semibold
                                                                text-slate-700
                                                            "
                                                        >
                                                            No departments found
                                                        </h3>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-slate-400
                                                            "
                                                        >
                                                            {search
                                                                ? "Try a different search."
                                                                : "Add your first department."}
                                                        </p>

                                                    </div>

                                                </td>

                                            </tr>
                                        )}


                                    {/* DATA */}

                                    {!loading &&
                                        currentDepartments.map(
                                            (department, index) => (

                                                <tr
                                                    key={
                                                        department.id
                                                    }
                                                    className="
                                                        border-b
                                                        border-slate-100
                                                        last:border-b-0
                                                        hover:bg-slate-50/70
                                                    "
                                                >

                                                    <td
                                                        className="
                                                            px-6
                                                            py-4
                                                            text-sm
                                                            font-medium
                                                            text-slate-500
                                                        "
                                                    >
                                                        {startIndex +
                                                            index +
                                                            1}
                                                    </td>


                                                    {/* CODE */}

                                                    <td
                                                        className="
                                                            px-6
                                                            py-4
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                inline-flex
                                                                rounded-lg
                                                                bg-indigo-50
                                                                px-3
                                                                py-1.5
                                                                text-xs
                                                                font-bold
                                                                text-indigo-700
                                                            "
                                                        >
                                                            {
                                                                department.departmentCode
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* NAME */}

                                                    <td
                                                        className="
                                                            px-6
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
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-slate-100
                                                                    text-slate-500
                                                                "
                                                            >
                                                                <Building2
                                                                    size={17}
                                                                />
                                                            </div>

                                                            <span
                                                                className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-700
                                                                "
                                                            >
                                                                {
                                                                    department.departmentName
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* DESCRIPTION */}

                                                    <td
                                                        className="
                                                            max-w-md
                                                            px-6
                                                            py-4
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                truncate
                                                                text-sm
                                                                text-slate-500
                                                            "
                                                        >
                                                            {
                                                                department.description ||
                                                                "—"
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td
                                                        className="
                                                            px-6
                                                            py-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-end
                                                                gap-2
                                                            "
                                                        >

                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        department
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    text-slate-400
                                                                    transition
                                                                    hover:bg-indigo-50
                                                                    hover:text-indigo-600
                                                                "
                                                                title="Edit Department"
                                                            >
                                                                <Pencil
                                                                    size={17}
                                                                />
                                                            </button>


                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        department
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    text-slate-400
                                                                    transition
                                                                    hover:bg-red-50
                                                                    hover:text-red-600
                                                                "
                                                                title="Delete Department"
                                                            >
                                                                <Trash2
                                                                    size={17}
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


                        {/* ================================================= */}
                        {/* PAGINATION */}
                        {/* ================================================= */}

                        {!loading &&
                            filteredDepartments.length > 0 && (

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        border-t
                                        border-slate-200
                                        px-6
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
                                        <span className="font-semibold text-slate-700">
                                            {startIndex + 1}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-semibold text-slate-700">
                                            {Math.min(
                                                startIndex +
                                                itemsPerPage,
                                                filteredDepartments.length
                                            )}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-semibold text-slate-700">
                                            {
                                                filteredDepartments.length
                                            }
                                        </span>{" "}
                                        departments
                                    </p>


                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <button
                                            type="button"
                                            disabled={
                                                safeCurrentPage === 1
                                            }
                                            onClick={() =>
                                                setCurrentPage(
                                                    (page) =>
                                                        Math.max(
                                                            page - 1,
                                                            1
                                                        )
                                                )
                                            }
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-white
                                                text-slate-500
                                                transition
                                                hover:bg-slate-50
                                                disabled:cursor-not-allowed
                                                disabled:opacity-40
                                            "
                                        >
                                            <ChevronLeft
                                                size={17}
                                            />
                                        </button>


                                        <span
                                            className="
                                                min-w-[80px]
                                                text-center
                                                text-sm
                                                font-medium
                                                text-slate-600
                                            "
                                        >
                                            Page{" "}
                                            {safeCurrentPage}{" "}
                                            of{" "}
                                            {Math.max(
                                                totalPages,
                                                1
                                            )}
                                        </span>


                                        <button
                                            type="button"
                                            disabled={
                                                safeCurrentPage >=
                                                totalPages
                                            }
                                            onClick={() =>
                                                setCurrentPage(
                                                    (page) =>
                                                        Math.min(
                                                            page + 1,
                                                            totalPages
                                                        )
                                                )
                                            }
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-white
                                                text-slate-500
                                                transition
                                                hover:bg-slate-50
                                                disabled:cursor-not-allowed
                                                disabled:opacity-40
                                            "
                                        >
                                            <ChevronRight
                                                size={17}
                                            />
                                        </button>

                                    </div>

                                </div>
                            )}

                    </div>

                </div>

            </main>


            {/* ================================================= */}
            {/* DELETE MODAL */}
            {/* ================================================= */}

            {deleteDepartment && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[200]
                        flex
                        items-center
                        justify-center
                        bg-slate-900/40
                        p-4
                        backdrop-blur-sm
                    "
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget &&
                            !deleting
                        ) {
                            setDeleteDepartment(null);
                        }

                    }}
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            overflow-hidden
                            rounded-2xl
                            bg-white
                            shadow-2xl
                        "
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="px-6 pt-6">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-50
                                    text-red-600
                                "
                            >
                                <Trash2 size={22} />
                            </div>

                        </div>


                        <div className="px-6 py-5">

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Delete Department?
                            </h2>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-slate-500
                                "
                            >
                                Are you sure you want to
                                delete{" "}

                                <span
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    {
                                        deleteDepartment.departmentName
                                    }
                                </span>
                                ?
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-red-500
                                "
                            >
                                This action cannot be undone.
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                justify-end
                                gap-3
                                border-t
                                border-slate-100
                                bg-slate-50
                                px-6
                                py-4
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteDepartment(null)
                                }
                                disabled={deleting}
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-100
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="
                                    flex
                                    min-w-[100px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-red-600
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-red-700
                                    disabled:opacity-50
                                "
                            >

                                {deleting ? (
                                    <>
                                        <span
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-white/40
                                                border-t-white
                                            "
                                        />

                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* ADD / EDIT MODAL */}
            {/* ================================================= */}

            {showModal && (

                <DepartmentFormModal
                    editingDepartment={
                        editingDepartment
                    }
                    onSubmit={handleSubmit}
                    onClose={closeFormModal}
                    saving={saving}
                />

            )}

        </div>
    );
}

export default AdminDepartments;