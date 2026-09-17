import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    BookOpen,
    Search,
    RefreshCw,
    ArrowLeft,
    GraduationCap,
    Layers3,
    Award,
    AlertCircle,
    ArrowRight,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";

import teacherService from "../../services/teacherService";


const TeacherSubjects = () => {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("ALL");

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [dashboard, setDashboard] = useState(null);


    // =====================================================
    // FETCH SUBJECTS
    // =====================================================

    const fetchSubjects = async (showToast = false) => {

        try {

            setError("");

            if (showToast) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }


            const response = await teacherService.getSubjects();

            console.log("Teacher Subjects Response:", response);


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "Failed to load subjects"
                );

            }


            setSubjects(response?.data || []);


            if (showToast) {
                toast.success("Subjects refreshed");
            }


        } catch (err) {

            console.error(
                "Teacher Subjects Error:",
                err
            );


            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load subjects";


            setError(message);

            toast.error(message);


        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    // =====================================================
    // FETCH TEACHER DASHBOARD
    // =====================================================

    const fetchDashboard = async () => {
        try {
            const response = await teacherService.getDashboard();

            console.log(
                "Teacher Dashboard Response:",
                response
            );

            if (response?.success) {
                setDashboard(response.data);
            }

        } catch (err) {
            console.error(
                "Teacher Dashboard Error:",
                err
            );
        }
    };


    // =====================================================
    // FETCH
    // =====================================================

    useEffect(() => {
        fetchSubjects();
        fetchDashboard();
    }, []);


    // =====================================================
    // SEMESTERS
    // =====================================================

    const semesters = useMemo(() => {
        const values = subjects
            .map((subject) => subject?.semesterName)
            .filter(Boolean);

        return [
            "ALL",
            ...Array.from(new Set(values)),
        ];
    }, [subjects]);


    // =====================================================
    // FILTER SUBJECTS
    // =====================================================

    const filteredSubjects = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return subjects.filter((subject) => {

            const matchesSearch =
                !searchValue ||
                subject?.subjectName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                subject?.subjectCode
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesSemester =
                semesterFilter === "ALL" ||
                subject?.semesterName === semesterFilter;

            return matchesSearch && matchesSemester;
        });

    }, [
        subjects,
        search,
        semesterFilter,
    ]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <TeacherSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                    collapsed={sidebarCollapsed}
                />

                <div
                    className={`
                        min-h-screen
                        transition-all
                        duration-300
                        ${sidebarCollapsed
                            ? "lg:pl-20"
                            : "lg:pl-72"
                        }
                    `}
                >

                    <TeacherTopbar
                        onMenuClick={() =>
                            setSidebarOpen(true)
                        }
                        onSidebarToggle={() =>
                            setSidebarCollapsed(
                                (prev) => !prev
                            )
                        }
                        sidebarCollapsed={
                            sidebarCollapsed
                        }
                        dashboardData={dashboard}

                    />


                    <main className="px-6 py-6 sm:px-8">

                        <div className="mx-auto max-w-7xl">

                            <div className="animate-pulse">

                                <div className="h-8 w-56 rounded-lg bg-slate-200" />

                                <div className="mt-3 h-4 w-80 rounded bg-slate-200" />


                                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

                                    {[1, 2, 3].map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="h-28 rounded-2xl bg-white"
                                            />
                                        )
                                    )}

                                </div>


                                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                                    {[1, 2, 3, 4, 5, 6].map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="h-48 rounded-2xl bg-white"
                                            />
                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && subjects.length === 0) {

        return (

            <div className="min-h-screen bg-slate-50">

                <TeacherSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                    collapsed={sidebarCollapsed}
                />


                <div
                    className={`
                        min-h-screen
                        transition-all
                        duration-300
                        ${sidebarCollapsed
                            ? "lg:pl-20"
                            : "lg:pl-72"
                        }
                    `}
                >

                    <TeacherTopbar
                        onMenuClick={() =>
                            setSidebarOpen(true)
                        }
                        onSidebarToggle={() =>
                            setSidebarCollapsed(
                                (prev) => !prev
                            )
                        }
                        sidebarCollapsed={
                            sidebarCollapsed
                        }
                        dashboardData={dashboard}

                    />


                    <main className="flex min-h-[70vh] items-center justify-center px-6">

                        <div className="max-w-md text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">

                                <AlertCircle size={30} />

                            </div>


                            <h2 className="mt-5 text-xl font-bold text-slate-900">
                                Unable to Load Subjects
                            </h2>


                            <p className="mt-2 text-sm text-slate-500">
                                {error}
                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    fetchSubjects()
                                }
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-indigo-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-indigo-700
                                "
                            >

                                <RefreshCw size={17} />

                                Try Again

                            </button>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD DATA
    // =====================================================

    const totalCredits = subjects.reduce(
        (total, subject) =>
            total + Number(subject?.credits || 0),
        0
    );


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <TeacherSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
                collapsed={sidebarCollapsed}
            />


            {/* =================================================
                MAIN
            ================================================= */}

            <div
                className={`
                    min-h-screen
                    transition-all
                    duration-300
                    ${sidebarCollapsed
                        ? "lg:pl-20"
                        : "lg:pl-72"
                    }
                `}
            >


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <TeacherTopbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    onSidebarToggle={() =>
                        setSidebarCollapsed(
                            (prev) => !prev
                        )
                    }
                    sidebarCollapsed={
                        sidebarCollapsed
                    }
                    dashboardData={dashboard}

                />


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <main className="w-full px-6 pt-[96px] pb-6 sm:px-8 lg:px-8">

                    <div className="mx-auto max-w-7xl">


                        {/* =================================================
                            PAGE HEADER
                        ================================================= */}

                        <section className="mb-7">

                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                <div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/teacher/dashboard"
                                            )
                                        }
                                        className="
                                            mb-4
                                            inline-flex
                                            items-center
                                            gap-2
                                            text-sm
                                            font-medium
                                            text-slate-500
                                            transition
                                            hover:text-indigo-600
                                        "
                                    >

                                        <ArrowLeft size={17} />

                                        Back to Dashboard

                                    </button>


                                    <div className="flex items-center gap-3">

                                        <div className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-indigo-100
                                            text-indigo-600
                                        ">

                                            <BookOpen size={25} />

                                        </div>


                                        <div>

                                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                                My Subjects
                                            </h1>

                                            <p className="mt-1 text-sm text-slate-500">
                                                View all subjects assigned to you
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* REFRESH */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchSubjects(true)
                                    }
                                    disabled={refreshing}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        shadow-sm
                                        transition
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    <RefreshCw
                                        size={17}
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    {refreshing
                                        ? "Refreshing..."
                                        : "Refresh"}

                                </button>

                            </div>

                        </section>


                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">


                            {/* TOTAL SUBJECTS */}

                            <InfoCard
                                icon={BookOpen}
                                title="Total Subjects"
                                value={subjects.length}
                                description="Subjects assigned to you"
                                iconClass="bg-indigo-100 text-indigo-600"
                            />


                            {/* SEMESTERS */}

                            <InfoCard
                                icon={Layers3}
                                title="Semesters"
                                value={
                                    Math.max(
                                        semesters.length - 1,
                                        0
                                    )
                                }
                                description="Semesters covered"
                                iconClass="bg-blue-100 text-blue-600"
                            />


                            {/* CREDITS */}

                            <InfoCard
                                icon={Award}
                                title="Total Credits"
                                value={totalCredits}
                                description="Credits across subjects"
                                iconClass="bg-emerald-100 text-emerald-600"
                            />

                        </section>


                        {/* =================================================
                            FILTERS
                        ================================================= */}

                        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                            <div className="flex flex-col gap-4 md:flex-row">

                                {/* SEARCH */}

                                <div className="relative flex-1">

                                    <Search
                                        size={19}
                                        className="
                                            absolute
                                            left-4
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
                                        placeholder="Search by subject name or code..."
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            pl-11
                                            pr-4
                                            text-sm
                                            text-slate-700
                                            outline-none
                                            transition
                                            focus:border-indigo-500
                                            focus:bg-white
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                </div>


                                {/* SEMESTER */}

                                <div className="md:w-56">
                                    <select
                                        value={semesterFilter}
                                        onChange={(e) =>
                                            setSemesterFilter(e.target.value)
                                        }
                                        className="
            h-12
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            text-sm
            font-medium
            text-slate-700
            outline-none
            transition
            focus:border-indigo-500
            focus:bg-white
            focus:ring-2
            focus:ring-indigo-100
        "
                                    >
                                        {semesters.map((semester) => (
                                            <option
                                                key={semester}
                                                value={semester}
                                            >
                                                {semester === "ALL"
                                                    ? "All Semesters"
                                                    : semester}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                        </section>




                        {/* =================================================
                            RESULT COUNT
                        ================================================= */}

                        <div className="mt-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Assigned Subjects
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">

                                    Showing{" "}
                                    <strong className="text-slate-700">
                                        {filteredSubjects.length}
                                    </strong>{" "}
                                    of{" "}
                                    <strong className="text-slate-700">
                                        {subjects.length}
                                    </strong>{" "}
                                    subjects

                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            SUBJECTS
                        ================================================= */}

                        <section className="mt-5">

                            {filteredSubjects.length === 0 ? (

                                <div className="rounded-2xl border border-slate-200 bg-white">

                                    <EmptyState
                                        icon={BookOpen}
                                        title="No subjects found"
                                        message={
                                            subjects.length === 0
                                                ? "No subjects have been assigned to you yet."
                                                : "Try changing your search or semester filter."
                                        }
                                    />

                                </div>

                            ) : (

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                                    {filteredSubjects.map(
                                        (subject) => (

                                            <SubjectCard
                                                key={
                                                    subject.subjectId ||
                                                    subject.id
                                                }
                                                subject={
                                                    subject
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <footer className="mt-10 border-t border-slate-200 py-6">

                            <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-500">

                                <p>
                                    AI Powered Student Result Management System
                                </p>

                                <p className="text-xs text-slate-400">
                                    © 2026 SRMS • Teacher Portal
                                </p>

                            </div>

                        </footer>

                    </div>

                </main>

            </div>


            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />

        </div>

    );

};


// =============================================================
// INFO CARD
// =============================================================

const InfoCard = ({
    icon: Icon,
    title,
    value,
    description,
    iconClass,
}) => {

    return (

        <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition
            hover:-translate-y-0.5
            hover:shadow-md
        ">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>

                </div>


                <div
                    className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        ${iconClass}
                    `}
                >

                    <Icon size={23} />

                </div>

            </div>

        </div>

    );

};


// =============================================================
// SUBJECT CARD
// =============================================================

const SubjectCard = ({ subject }) => {

    return (

        <div className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition
            duration-200
            hover:-translate-y-1
            hover:border-indigo-200
            hover:shadow-md
        ">


            {/* TOP */}

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <span className="
                        inline-flex
                        rounded-lg
                        bg-indigo-100
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-indigo-700
                    ">
                        {subject?.subjectCode || "N/A"}
                    </span>


                    <h3 className="
                        mt-4
                        min-h-[48px]
                        text-lg
                        font-bold
                        leading-6
                        text-slate-900
                    ">
                        {subject?.subjectName ||
                            "Subject Name"}
                    </h3>

                </div>


                <div className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                    transition
                    group-hover:bg-indigo-600
                    group-hover:text-white
                ">

                    <BookOpen size={21} />

                </div>

            </div>


            {/* DETAILS */}

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">


                {/* SEMESTER */}

                <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                        Semester
                    </span>

                    <span className="font-semibold text-slate-700">
                        {subject?.semesterName ||
                            "N/A"}
                    </span>

                </div>


                {/* CREDITS */}

                <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                        Credits
                    </span>

                    <span className="font-semibold text-slate-700">
                        {subject?.credits ?? "N/A"}
                    </span>

                </div>


                {/* SUBJECT ID */}

                {subject?.subjectId && (

                    <div className="flex items-center justify-between text-sm">

                        <span className="text-slate-500">
                            Subject ID
                        </span>

                        <span className="font-semibold text-slate-700">
                            {subject.subjectId}
                        </span>

                    </div>

                )}

            </div>


            {/* BOTTOM */}

            <div className="mt-5 border-t border-slate-100 pt-4">

                <div className="
                    flex
                    items-center
                    justify-between
                    text-xs
                    text-slate-400
                ">

                    <span className="flex items-center gap-1.5">

                        <GraduationCap size={15} />

                        Assigned Subject

                    </span>

                    <ArrowRight
                        size={16}
                        className="
                            text-slate-300
                            transition
                            group-hover:translate-x-1
                            group-hover:text-indigo-500
                        "
                    />

                </div>

            </div>

        </div>

    );

};


// =============================================================
// EMPTY STATE
// =============================================================

const EmptyState = ({
    icon: Icon,
    title,
    message,
}) => {

    return (

        <div className="
            flex
            flex-col
            items-center
            justify-center
            py-16
            text-center
        ">

            <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-400
            ">

                <Icon size={28} />

            </div>


            <h3 className="mt-5 font-semibold text-slate-700">
                {title}
            </h3>


            <p className="mt-1 max-w-sm text-sm text-slate-400">
                {message}
            </p>

        </div>

    );

};


export default TeacherSubjects;