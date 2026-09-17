import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    GraduationCap,
    UserCog,
    Building2,
    BookOpen,
    Layers3,
    LibraryBig,
    ClipboardList,
    RefreshCcw,
    RotateCcw,
    BarChart3,
    FileText,
    Bot,
    Bell,
    Settings,
    UserCircle,
    X,
} from "lucide-react";

const AdminSidebar = ({
    activePage = "Dashboard",
    setActivePage,
    collapsed = false,
    mobileOpen = false,
    setMobileOpen,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // =========================================================
    // ADMIN MENU
    // =========================================================

    const menuGroups = [
        {
            title: "MAIN",
            items: [
                {
                    label: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/admin/dashboard",
                },
            ],
        },

        {
            title: "USER MANAGEMENT",
            items: [
                {
                    label: "Students",
                    icon: GraduationCap,
                    path: "/admin/students",
                },
                {
                    label: "Teachers",
                    icon: Users,
                    path: "/admin/teachers",
                },
                {
                    label: "Users",
                    icon: UserCog,
                    path: "/admin/users",
                },
            ],
        },

        {
            title: "ACADEMIC",
            items: [
                {
                    label: "Departments",
                    icon: Building2,
                    path: "/admin/departments",
                },
                {
                    label: "Courses",
                    icon: LibraryBig,
                    path: "/admin/courses",
                },
                {
                    label: "Semesters",
                    icon: Layers3,
                    path: "/admin/semesters",
                },
                {
                    label: "Subjects",
                    icon: BookOpen,
                    path: "/admin/subjects",
                },
                {
                    label: "Teacher Assignment",
                    icon: ClipboardList,
                    path: "/admin/teacher-assignment",
                },
            ],
        },

        {
            title: "RESULT MANAGEMENT",
            items: [
                {
                    label: "Results",
                    icon: BarChart3,
                    path: "/admin/results",
                },
                {
                    label: "Rechecking",
                    icon: RefreshCcw,
                    path: "/admin/rechecking",
                },
                {
                    label: "Reevaluation",
                    icon: RotateCcw,
                    path: "/admin/reevaluation",
                },
            ],
        },

        {
            title: "ANALYTICS",
            items: [
                {
                    label: "Performance",
                    icon: BarChart3,
                    path: "/admin/performance",
                },
                {
                    label: "Reports",
                    icon: FileText,
                    path: "/admin/reports",
                },
                {
                    label: "Admin AI",
                    icon: Bot,
                    path: "/admin/ai",
                },
            ],
        },

        {
            title: "SYSTEM",
            items: [
                {
                    label: "Notifications",
                    icon: Bell,
                    path: "/admin/notifications",
                },
                {
                    label: "Profile",
                    icon: UserCircle,
                    path: "/admin/profile",
                },
                {
                    label: "College PDF Settings",
                    icon: Settings,
                    path: "/admin/college-pdf-settings",
                },
            ],
        },
    ];

    // =========================================================
    // NAVIGATION
    // =========================================================

    const handleNavigation = (item) => {
        navigate(item.path);

        if (setActivePage) {
            setActivePage(item.label);
        }

        // Close mobile sidebar after navigation
        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    // =========================================================
    // ACTIVE ROUTE
    // =========================================================

    const isActive = (path) => {
        if (path === "/admin/dashboard") {
            return location.pathname === path;
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    // =========================================================
    // CLOSE MOBILE SIDEBAR
    // =========================================================

    const closeMobileSidebar = () => {
        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <>
            {/* =====================================================
                MOBILE OVERLAY
            ===================================================== */}

            {mobileOpen && (
                <div
                    className="
            fixed
            inset-0

            z-[60]

            bg-slate-900/40
            backdrop-blur-[2px]

            lg:hidden
        "
                    onClick={() => {
                        if (setMobileOpen) {
                            setMobileOpen(false);
                        }
                    }}
                    aria-hidden="true"
                />
            )}

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside
                className={`
        fixed
        top-0
        left-0
        bottom-0

        z-[80]

        flex
        flex-col

        w-[260px]

        bg-white
        border-r
        border-slate-200

        shadow-xl

        overflow-hidden

        transition-all
        duration-300
        ease-in-out

        /* ==========================
           MOBILE
        ========================== */

        ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

        /* ==========================
           DESKTOP
        ========================== */

        lg:translate-x-0

        ${collapsed
                        ? "lg:w-[76px]"
                        : "lg:w-[260px]"
                    }
    `}
            >
                {/* =================================================
                    LOGO AREA
                ================================================= */}

                <div
                    className={`
                        h-[72px]
                        min-h-[72px]
                        shrink-0
                        flex
                        items-center
                        border-b
                        border-slate-200
                        px-4

                        ${collapsed
                            ? "md:justify-center"
                            : "justify-start"
                        }
                    `}
                >
                    {/* Logo */}
                    <div
                        className="
                            h-11
                            w-11
                            shrink-0
                            rounded-xl
                            bg-gradient-to-br
                            from-indigo-600
                            to-blue-600
                            flex
                            items-center
                            justify-center
                            text-white
                            font-bold
                            text-lg
                            shadow-md
                        "
                    >
                        S
                    </div>

                    {/* Logo Text */}

                    <div
                        className={`
                            ml-3
                            overflow-hidden
                            whitespace-nowrap
                            transition-all
                            duration-200

                            ${collapsed
                                ? "lg:hidden"
                                : "block"
                            }
                        `}
                    >
                        <h1
                            className="
                                text-lg
                                font-bold
                                text-slate-800
                                leading-tight
                            "
                        >
                            SRMS
                        </h1>

                        <p
                            className="
                                text-[11px]
                                text-slate-500
                                mt-0.5
                            "
                        >
                            Admin Portal
                        </p>
                    </div>

                    {/* Mobile Close Button */}

                    <button
                        type="button"
                        onClick={closeMobileSidebar}
                        className="
                            ml-auto
                            h-9
                            w-9
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-slate-500
                            hover:bg-slate-100
                            md:hidden
                        "
                        aria-label="Close sidebar"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* =================================================
                    MENU
                ================================================= */}

                <nav
                    className="
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                        px-3
                        py-4
                        scrollbar-thin
                        scrollbar-thumb-slate-300
                        scrollbar-track-transparent
                    "
                >
                    {menuGroups.map((group) => (
                        <div
                            key={group.title}
                            className="mb-5"
                        >
                            {/* Group Title */}

                            <div
                                className={`
                                    mb-2
                                    overflow-hidden
                                    transition-all
                                    duration-200

                                    ${collapsed
                                        ? "md:h-0 md:mb-0"
                                        : "h-auto"
                                    }
                                `}
                            >
                                <p
                                    className="
                                        px-3
                                        text-[10px]
                                        font-bold
                                        tracking-wider
                                        text-slate-400
                                        whitespace-nowrap
                                    "
                                >
                                    {group.title}
                                </p>
                            </div>

                            {/* Menu Items */}

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(
                                        item.path
                                    );

                                    return (
                                        <button
                                            key={item.label}
                                            type="button"
                                            onClick={() =>
                                                handleNavigation(
                                                    item
                                                )
                                            }
                                            title={
                                                collapsed
                                                    ? item.label
                                                    : undefined
                                            }
                                            className={`
                                                group
                                                relative
                                                w-full
                                                h-12
                                                flex
                                                items-center
                                                rounded-xl
                                                transition-all
                                                duration-200

                                                ${collapsed
                                                    ? "md:justify-center md:px-0"
                                                    : "justify-start px-3"
                                                }

                                                ${active
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                                }
                                            `}
                                        >
                                            {/* Active indicator */}

                                            {active && (
                                                <span
                                                    className="
                                                        absolute
                                                        left-0
                                                        top-1/2
                                                        -translate-y-1/2
                                                        w-1
                                                        h-7
                                                        rounded-r-full
                                                        bg-indigo-600
                                                        md:hidden
                                                    "
                                                />
                                            )}

                                            {/* Icon */}

                                            <Icon
                                                size={20}
                                                strokeWidth={1.8}
                                                className={`
                                                    shrink-0
                                                    transition-colors

                                                    ${active
                                                        ? "text-indigo-600"
                                                        : "text-slate-400 group-hover:text-indigo-600"
                                                    }
                                                `}
                                            />

                                            {/* Label */}

                                            <span
                                                className={`
                                                    ml-3
                                                    text-sm
                                                    font-medium
                                                    truncate
                                                    whitespace-nowrap
                                                    transition-all
                                                    duration-200

                                                    ${collapsed
                                                        ? "md:hidden"
                                                        : "block"
                                                    }
                                                `}
                                            >
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default AdminSidebar;