import { useEffect, useMemo, useState } from "react";



import {
    Plus,
    Search,
    Pencil,
    Trash2,
    ShieldCheck,
    ShieldOff,
    RefreshCcw,
    Users,
    UserCheck,
    UserX,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import UserFormModal from "../../components/admin/UserFormModal";

import adminUserService from "../../services/adminUserService";

import { toast } from "react-toastify";

import adminStudentService from "../../services/adminStudentService";


const AdminUsers = () => {

    // =====================================================
    // SIDEBAR
    // =====================================================

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);


    // =====================================================
    // DATA
    // =====================================================

    const [users, setUsers] =
        useState([]);

    const [students, setStudents] = useState([]);

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // SEARCH / FILTER
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [roleFilter, setRoleFilter] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const usersPerPage = 10;


    // =====================================================
    // MODAL
    // =====================================================

    const [showModal, setShowModal] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState(null);

    const [saving, setSaving] =
        useState(false);


    // =====================================================
    // DELETE
    // =====================================================

    const [deletingId, setDeletingId] =
        useState(null);


    const [deleteUser, setDeleteUser] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // =====================================================
    // LOAD USERS
    // =====================================================

    const loadUsers = async () => {

        setLoading(true);

        try {

            const response =
                await adminUserService.getAllUsers();

            const responseData =
                response?.data;

            const userList =
                Array.isArray(responseData?.data)
                    ? responseData.data
                    : [];

            setUsers(userList);

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to load users."
            );

            setUsers([]);

        } finally {

            setLoading(false);

        }
    };

    const loadStudents = async () => {
        try {
            const response =
                await adminStudentService.getAllStudents();

            console.log("Students API:", response);

            const studentList =
                Array.isArray(response?.data)
                    ? response.data
                    : [];

            setStudents(studentList);

        } catch (error) {
            console.error(
                "Failed to load students:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to load students."
            );

            setStudents([]);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadUsers();
        loadStudents();

    }, []);


    // =====================================================
    // FILTER USERS
    // =====================================================

    const filteredUsers = useMemo(() => {

        // ================================
        // STUDENT
        // ================================
        if (roleFilter === "STUDENT") {

            const searchValue =
                search.trim().toLowerCase();

            return students.filter((student) => {

                if (!searchValue) {
                    return true;
                }

                const fullName =
                    `${student.firstName || ""} ${student.lastName || ""}`
                        .trim()
                        .toLowerCase();

                return (
                    fullName.includes(searchValue) ||
                    student.email
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    student.enrollmentNumber
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    student.mobile
                        ?.toLowerCase()
                        .includes(searchValue)
                );
            });
        }

        // ================================
        // NORMAL USERS
        // ================================
        return users.filter((user) => {

            const searchValue =
                search.trim().toLowerCase();

            const matchesSearch =
                !searchValue ||
                user.username
                    ?.toLowerCase()
                    .includes(searchValue) ||
                user.email
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesRole =
                roleFilter === "ALL" ||
                user.role === roleFilter;

            const matchesStatus =
                statusFilter === "ALL" ||
                (
                    statusFilter === "ACTIVE" &&
                    user.enabled === true
                ) ||
                (
                    statusFilter === "INACTIVE" &&
                    user.enabled === false
                );

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        });

    }, [
        users,
        students,
        search,
        roleFilter,
        statusFilter
    ]);


    // =====================================================
    // PAGINATION CALCULATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredUsers.length /
                usersPerPage
            )
        );

    const startIndex =
        (currentPage - 1) *
        usersPerPage;

    const currentUsers =
        filteredUsers.slice(
            startIndex,
            startIndex + usersPerPage
        );


    // =====================================================
    // RESET PAGE WHEN FILTER CHANGES
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        roleFilter,
        statusFilter,
    ]);


    // =====================================================
    // ADD USER
    // =====================================================

    const handleAdd = () => {

        setEditingUser(null);
        setShowModal(true);

    };


    // =====================================================
    // EDIT USER
    // =====================================================

    const handleEdit = async (user) => {

        try {

            const response =
                await adminUserService.getUserById(
                    user.id
                );

            setEditingUser(
                response?.data?.data || user
            );

            setShowModal(true);

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Unable to load user."
            );

        }
    };


    // =====================================================
    // SAVE USER
    // =====================================================

    const handleSubmit = async (formData) => {

        setSaving(true);

        try {

            let response;

            if (editingUser) {

                response =
                    await adminUserService.updateUser(
                        editingUser.id,
                        formData
                    );

            } else {

                response =
                    await adminUserService.addUser(
                        formData
                    );
            }

            const responseData =
                response?.data;

            const message =
                responseData?.message ||
                (
                    editingUser
                        ? "User updated successfully."
                        : "User added successfully."
                );

            toast.success(message);


            // ==========================================
            // UPDATE CURRENT ROW
            // ==========================================

            if (editingUser) {

                const updatedUser =
                    responseData?.data;

                if (updatedUser) {

                    setUsers((prev) =>
                        prev.map((user) =>
                            user.id === editingUser.id
                                ? updatedUser
                                : user
                        )
                    );

                }

            } else {

                await loadUsers();

            }


            setShowModal(false);
            setEditingUser(null);

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
    // DELETE USER
    // =====================================================

    // =====================================================
    // OPEN DELETE CONFIRMATION MODAL
    // =====================================================

    const handleDelete = (user) => {
        setDeleteUser(user);
    };


    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const confirmDelete = async () => {

        if (!deleteUser) {
            return;
        }

        setDeleting(true);
        setDeletingId(deleteUser.id);

        try {

            const response =
                await adminUserService.deleteUser(
                    deleteUser.id
                );

            toast.success(
                response?.data?.message ||
                "User deleted successfully."
            );

            setUsers((prev) =>
                prev.filter(
                    (item) =>
                        item.id !== deleteUser.id
                )
            );

            // Close modal
            setDeleteUser(null);

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to delete user."
            );

        } finally {

            setDeleting(false);
            setDeletingId(null);

        }
    };


    // =====================================================
    // TOGGLE STATUS
    // =====================================================

    const handleToggleStatus = async (user) => {

        try {

            const response =
                await adminUserService.toggleUserStatus(
                    user.id
                );

            const responseData =
                response?.data;

            toast.success(
                responseData?.message ||
                "User status updated."
            );

            const updatedUser =
                responseData?.data;

            if (updatedUser) {

                setUsers((prev) =>
                    prev.map((item) =>
                        item.id === user.id
                            ? updatedUser
                            : item
                    )
                );

            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to update user status."
            );

        }
    };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const goToPage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

    };


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            <AdminSidebar
                activePage="Users"
                collapsed={collapsed}
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

                <div className="p-3 sm:p-4 md:p-6 lg:p-8">


                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <div className="
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                        mb-6
                    ">

                        <div>

                            <h1 className="
                                text-2xl
                                lg:text-3xl
                                font-bold
                                text-slate-800
                            ">
                                Users
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                Manage system users,
                                roles and account status.
                            </p>

                        </div>


                        <div className="
    flex
    w-full
    sm:w-auto
    items-center
    gap-2
">


                            <button
                                onClick={loadUsers}
                                disabled={loading}
                                className="
        h-10
        flex-1
        sm:flex-none
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
                                    className={loading ? "animate-spin" : ""}
                                />

                                <span>Refresh</span>
                            </button>

                            <button
                                onClick={handleAdd}
                                className="
        h-10
        flex-1
        sm:flex-none
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

                                <span>Add User</span>
                            </button>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* STAT CARDS */}
                    {/* ================================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                        mb-6
                    ">

                        <div className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-sm
                                        text-slate-500
                                    ">
                                        Total Users
                                    </p>

                                    <h2 className="
                                        mt-1
                                        text-2xl
                                        font-bold
                                        text-slate-800
                                    ">
                                        {users.length}
                                    </h2>

                                </div>

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
                                    <Users size={21} />
                                </div>

                            </div>

                        </div>


                        <div className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-sm
                                        text-slate-500
                                    ">
                                        Active
                                    </p>

                                    <h2 className="
                                        mt-1
                                        text-2xl
                                        font-bold
                                        text-emerald-600
                                    ">
                                        {
                                            users.filter(
                                                (u) =>
                                                    u.enabled === true
                                            ).length
                                        }
                                    </h2>

                                </div>

                                <div className="
                                    h-11
                                    w-11
                                    rounded-xl
                                    bg-emerald-50
                                    text-emerald-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <UserCheck size={21} />
                                </div>

                            </div>

                        </div>


                        <div className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-sm
                                        text-slate-500
                                    ">
                                        Inactive
                                    </p>

                                    <h2 className="
                                        mt-1
                                        text-2xl
                                        font-bold
                                        text-red-500
                                    ">
                                        {
                                            users.filter(
                                                (u) =>
                                                    u.enabled === false
                                            ).length
                                        }
                                    </h2>

                                </div>

                                <div className="
                                    h-11
                                    w-11
                                    rounded-xl
                                    bg-red-50
                                    text-red-500
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <UserX size={21} />
                                </div>

                            </div>

                        </div>


                        <div className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-sm
                                        text-slate-500
                                    ">
                                        Administrators
                                    </p>

                                    <h2 className="
                                        mt-1
                                        text-2xl
                                        font-bold
                                        text-blue-600
                                    ">
                                        {
                                            users.filter(
                                                (u) =>
                                                    u.role === "ADMIN"
                                            ).length
                                        }
                                    </h2>

                                </div>

                                <div className="
                                    h-11
                                    w-11
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <ShieldCheck size={21} />
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* FILTER BAR */}
                    {/* ================================================= */}

                    <div className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        p-4
                        mb-5
                    ">

                        <div className="
                            flex
                            flex-col
                            lg:flex-row
                            gap-3
                        ">


                            {/* SEARCH */}

                            <div className="
                                relative
                                flex-1
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
                                    placeholder="Search username or email..."
                                    className="
                                        w-full
                                        h-11
                                        pl-10
                                        pr-4
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        focus:border-indigo-400
                                        focus:ring-2
                                        focus:ring-indigo-100
                                    "
                                />

                            </div>


                            {/* ROLE */}

                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value
                                    )
                                }
                                className="
                                    h-11
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
                                    All Roles
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>

                                <option value="TEACHER">
                                    Teacher
                                </option>

                                <option value="STUDENT">
                                    Student
                                </option>

                            </select>


                            {/* STATUS */}

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                className="
                                    h-11
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
                                    All Status
                                </option>

                                <option value="ACTIVE">
                                    Active
                                </option>

                                <option value="INACTIVE">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* TABLE */}
                    {/* ================================================= */}

                    <div className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        overflow-hidden
                    ">

                        <div className="overflow-x-auto">

                            {roleFilter === "STUDENT" ? (

                                /* =====================================================
                                   STUDENT TABLE
                                   ===================================================== */

                                <table className="w-full min-w-[950px]">

                                    <thead className="
            bg-slate-50
            border-b
            border-slate-200
        ">
                                        <tr>

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
                                                Enrollment No
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
                                                Student
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
                                                Email
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
                                                Gender
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
                                                Mobile
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
                                                Academic Year
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {loading ? (

                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="
                            px-5
                            py-16
                            text-center
                            text-slate-400
                        "
                                                >
                                                    <RefreshCcw
                                                        size={24}
                                                        className="
                                mx-auto
                                mb-3
                                animate-spin
                            "
                                                    />

                                                    Loading students...
                                                </td>
                                            </tr>

                                        ) : currentUsers.length === 0 ? (

                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="
                            px-5
                            py-16
                            text-center
                        "
                                                >
                                                    <Users
                                                        size={35}
                                                        className="
                                mx-auto
                                mb-3
                                text-slate-300
                            "
                                                    />

                                                    <p className="
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
                                                        Try changing your search.
                                                    </p>

                                                </td>
                                            </tr>

                                        ) : (

                                            currentUsers.map((student, index) => (

                                                <tr
                                                    key={student.id}
                                                    className="
                            border-b
                            border-slate-100
                            last:border-0
                            hover:bg-slate-50
                            transition
                        "
                                                >

                                                    {/* ================================
                            #
                            ================================ */}

                                                    <td className="
                            px-5
                            py-4
                            text-sm
                            text-slate-500
                        ">
                                                        {startIndex + index + 1}
                                                    </td>

                                                    {/* ================================
                            ENROLLMENT NUMBER
                            ================================ */}

                                                    <td className="
                            px-5
                            py-4
                            text-sm
                            font-semibold
                            text-slate-700
                        ">
                                                        {student.enrollmentNumber || "-"}
                                                    </td>

                                                    {/* ================================
                            STUDENT
                            ================================ */}

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
                                    bg-gradient-to-br
                                    from-indigo-500
                                    to-blue-600
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    font-semibold
                                    text-sm
                                ">
                                                                {student.firstName
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase() || "S"}
                                                            </div>

                                                            <div>

                                                                <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                                                    {student.firstName || ""}{" "}
                                                                    {student.lastName || ""}
                                                                </p>

                                                                <p className="
                                        text-xs
                                        text-slate-400
                                    ">
                                                                    ID: {student.id}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* ================================
                            EMAIL
                            ================================ */}

                                                    <td className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                        ">
                                                        {student.email || "-"}
                                                    </td>

                                                    {/* ================================
                            GENDER
                            ================================ */}

                                                    <td className="
                            px-5
                            py-4
                        ">

                                                        <span className="
                                inline-flex
                                items-center
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-blue-700
                            ">
                                                            {student.gender || "-"}
                                                        </span>

                                                    </td>

                                                    {/* ================================
                            MOBILE
                            ================================ */}

                                                    <td className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                        ">
                                                        {student.mobile || "-"}
                                                    </td>

                                                    {/* ================================
                            ACADEMIC YEAR
                            ================================ */}

                                                    <td className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                        ">
                                                        {student.academicYear || "-"}
                                                    </td>

                                                </tr>

                                            ))

                                        )}

                                    </tbody>

                                </table>

                            ) : (

                                /* =====================================================
                                   EXISTING USER TABLE
                                   ===================================================== */

                                <table className="
        w-full
        min-w-[850px]
    ">

                                    {/* KEEP YOUR EXISTING USER TABLE HERE */}

                                    <thead className="
            bg-slate-50
            border-b
            border-slate-200
        ">
                                        <tr>

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
                                                User
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
                                                Email
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
                                                Role
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
                                                Status
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
                            py-16
                            text-center
                            text-slate-400
                        "
                                                >
                                                    <RefreshCcw
                                                        size={24}
                                                        className="
                                mx-auto
                                mb-3
                                animate-spin
                            "
                                                    />

                                                    Loading users...

                                                </td>
                                            </tr>

                                        ) : currentUsers.length === 0 ? (

                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="
                            px-5
                            py-16
                            text-center
                        "
                                                >

                                                    <Users
                                                        size={35}
                                                        className="
                                mx-auto
                                mb-3
                                text-slate-300
                            "
                                                    />

                                                    <p className="
                            text-sm
                            font-medium
                            text-slate-600
                        ">
                                                        No users found
                                                    </p>

                                                </td>
                                            </tr>

                                        ) : (

                                            currentUsers.map((user, index) => (

                                                <tr
                                                    key={user.id}
                                                    className="
                            border-b
                            border-slate-100
                            last:border-0
                            hover:bg-slate-50
                            transition
                        "
                                                >

                                                    {/* # */}

                                                    <td className="
                            px-5
                            py-4
                            text-sm
                            text-slate-500
                        ">
                                                        {startIndex + index + 1}
                                                    </td>

                                                    {/* USER */}

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
                                    bg-gradient-to-br
                                    from-indigo-500
                                    to-blue-600
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    font-semibold
                                    text-sm
                                ">
                                                                {user.username
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()}
                                                            </div>

                                                            <div>

                                                                <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                                                    {user.username}
                                                                </p>

                                                                <p className="
                                        text-xs
                                        text-slate-400
                                    ">
                                                                    ID: {user.id}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* EMAIL */}

                                                    <td className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                        ">
                                                        {user.email}
                                                    </td>

                                                    {/* ROLE */}

                                                    <td className="
                            px-5
                            py-4
                        ">

                                                        <span
                                                            className={`
                                    inline-flex
                                    items-center
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold

                                    ${user.role === "ADMIN"
                                                                    ? "bg-purple-50 text-purple-700"
                                                                    : user.role === "TEACHER"
                                                                        ? "bg-blue-50 text-blue-700"
                                                                        : "bg-emerald-50 text-emerald-700"
                                                                }
                                `}
                                                        >
                                                            {user.role}
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
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold

                                    ${user.enabled
                                                                    ? "bg-emerald-50 text-emerald-700"
                                                                    : "bg-red-50 text-red-600"
                                                                }
                                `}
                                                        >

                                                            <span
                                                                className={`
                                        h-1.5
                                        w-1.5
                                        rounded-full

                                        ${user.enabled
                                                                        ? "bg-emerald-500"
                                                                        : "bg-red-500"
                                                                    }
                                    `}
                                                            />

                                                            {user.enabled
                                                                ? "Active"
                                                                : "Inactive"}

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
                                gap-2
                            ">

                                                            <button
                                                                onClick={() =>
                                                                    handleToggleStatus(user)
                                                                }
                                                                title={
                                                                    user.enabled
                                                                        ? "Disable user"
                                                                        : "Enable user"
                                                                }
                                                                className="
                                        h-9
                                        w-9
                                        rounded-lg
                                        border
                                        border-slate-200
                                        text-slate-500
                                        hover:bg-slate-50
                                        hover:text-indigo-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                                            >
                                                                {user.enabled ? (
                                                                    <ShieldOff size={16} />
                                                                ) : (
                                                                    <ShieldCheck size={16} />
                                                                )}
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(user)
                                                                }
                                                                title="Edit user"
                                                                className="
                                        h-9
                                        w-9
                                        rounded-lg
                                        border
                                        border-slate-200
                                        text-slate-500
                                        hover:bg-indigo-50
                                        hover:text-indigo-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(user)
                                                                }
                                                                disabled={
                                                                    deletingId === user.id
                                                                }
                                                                title="Delete user"
                                                                className="
                                        h-9
                                        w-9
                                        rounded-lg
                                        border
                                        border-slate-200
                                        text-slate-500
                                        hover:bg-red-50
                                        hover:text-red-600
                                        flex
                                        items-center
                                        justify-center
                                        disabled:opacity-50
                                    "
                                                            >

                                                                {deletingId === user.id ? (
                                                                    <RefreshCcw
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

                                            ))

                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>


                        {/* ================================================= */}
                        {/* PAGINATION */}
                        {/* ================================================= */}

                        <div className="
                            px-5
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
                                text-sm
                                text-slate-500
                            ">

                                Showing{" "}
                                {filteredUsers.length === 0
                                    ? 0
                                    : startIndex + 1}
                                {" "}to{" "}
                                {Math.min(
                                    startIndex +
                                    usersPerPage,
                                    filteredUsers.length
                                )}
                                {" "}of{" "}
                                {filteredUsers.length}
                                {" "}users

                            </p>


                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <button
                                    onClick={() =>
                                        goToPage(
                                            currentPage - 1
                                        )
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                    className="
                                        h-9
                                        w-9
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-white
                                        text-slate-500
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-slate-50
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    <ChevronLeft size={17} />
                                </button>


                                <span className="
                                    text-sm
                                    font-medium
                                    text-slate-600
                                ">
                                    Page {currentPage} of {totalPages}
                                </span>


                                <button
                                    onClick={() =>
                                        goToPage(
                                            currentPage + 1
                                        )
                                    }
                                    disabled={
                                        currentPage === totalPages
                                    }
                                    className="
                                        h-9
                                        w-9
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-white
                                        text-slate-500
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-slate-50
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    <ChevronRight size={17} />
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </main>


            {/* ================================================= */}
            {/* USER MODAL */}
            {/* ================================================= */}

            {showModal && (
                <UserFormModal
                    editingUser={editingUser}
                    onSubmit={handleSubmit}
                    onClose={() => {
                        setShowModal(false);
                        setEditingUser(null);
                    }}
                    saving={saving}
                />
            )}


            {/* ================================================= */}
            {/* DELETE CONFIRMATION MODAL */}
            {/* ================================================= */}

            {deleteUser && (
                <div
                    className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            bg-slate-900/40
            backdrop-blur-sm
            p-4
        "
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget &&
                            !deleting
                        ) {
                            setDeleteUser(null);
                        }

                    }}
                >

                    <div
                        className="
                w-full
                max-w-md
                rounded-2xl
                bg-white
                shadow-2xl
                overflow-hidden
            "
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* ========================================= */}
                        {/* MODAL CONTENT */}
                        {/* ========================================= */}

                        <div className="px-6 pt-6">

                            {/* DELETE ICON */}

                            <div
                                className="
                        h-12
                        w-12
                        rounded-full
                        bg-red-50
                        text-red-600
                        flex
                        items-center
                        justify-center
                    "
                            >
                                <Trash2 size={22} />
                            </div>

                        </div>


                        {/* ========================================= */}
                        {/* TEXT */}
                        {/* ========================================= */}

                        <div className="px-6 py-5">

                            <h2
                                className="
                        text-lg
                        font-bold
                        text-slate-800
                    "
                            >
                                Delete User?
                            </h2>


                            <p
                                className="
                        mt-2
                        text-sm
                        leading-6
                        text-slate-500
                    "
                            >
                                Are you sure you want to delete{" "}

                                <span
                                    className="
                            font-semibold
                            text-slate-700
                        "
                                >
                                    {deleteUser.username}
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


                        {/* ========================================= */}
                        {/* BUTTONS */}
                        {/* ========================================= */}

                        <div
                            className="
                    flex
                    items-center
                    justify-end
                    gap-3
                    px-6
                    py-4
                    bg-slate-50
                    border-t
                    border-slate-100
                "
                        >

                            {/* CANCEL */}

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteUser(null)
                                }
                                disabled={deleting}
                                className="
                        h-10
                        px-5
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        text-sm
                        font-medium
                        text-slate-600
                        hover:bg-slate-100
                        transition
                        disabled:opacity-50
                    "
                            >
                                Cancel
                            </button>


                            {/* DELETE */}

                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="
                        h-10
                        px-5
                        rounded-xl
                        bg-red-600
                        text-white
                        text-sm
                        font-semibold
                        flex
                        items-center
                        gap-2
                        hover:bg-red-700
                        transition
                        disabled:opacity-50
                    "
                            >

                                {deleting ? (
                                    <>
                                        <span
                                            className="
                                    h-4
                                    w-4
                                    rounded-full
                                    border-2
                                    border-white/40
                                    border-t-white
                                    animate-spin
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

        </div>
    );
};

export default AdminUsers;