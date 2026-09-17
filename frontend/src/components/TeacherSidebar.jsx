import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    RefreshCw,
    Users,
    BarChart3,
    Bot,
    UserCircle,
    Settings,
    Headphones,
    X,
} from "lucide-react";


// =====================================================
// TEACHER NAVIGATION
// =====================================================

const navSections = [

    {
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboard,
                path: "/teacher/dashboard",
            },
        ],
    },

    {
        title: "Academic",
        items: [
            {
                label: "My Subjects",
                icon: BookOpen,
                path: "/teacher/subjects",
            },

            {
                label: "Students",
                icon: Users,
                path: "/teacher/students",
            },

            {
                label: "Results",
                icon: BarChart3,
                path: "/teacher/results",
            },
        ],
    },

    {
        title: "Result Management",
        items: [
            {
                label: "Enter Results",
                icon: ClipboardList,
                path: "/teacher/results/enter-results",
            },

            {
                label: "Rechecking",
                icon: RefreshCw,
                path: "/teacher/rechecking",
            },
            {
                label: "Reevaluation",
                icon: RefreshCw,
                path: "/teacher/reevaluation",
            },
        ],
    },

    {
        title: "AI Tools",
        items: [
            {
                label: "Teacher AI",
                icon: Bot,
                path: "/teacher/ai",
            },
        ],
    },

    {
        title: "Account",
        items: [
            {
                label: "My Profile",
                icon: UserCircle,
                path: "/teacher/profile",
            },


        ],
    },
];


// =====================================================
// NAV ITEM
// =====================================================

const NavItem = ({
    item,
    active,
    onClick,
    collapsed,
}) => {

    const Icon = item.icon;

    return (

        <button
            type="button"
            onClick={() => onClick(item.path)}
            title={collapsed ? item.label : undefined}
            className={`
                group flex w-full items-center rounded-xl
                py-2.5 text-sm font-medium
                transition-all duration-200

                ${collapsed
                    ? "justify-center px-2"
                    : "justify-between px-3"
                }

                ${active
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
            `}
        >

            <span
                className={`
                    flex items-center
                    ${collapsed
                        ? "justify-center"
                        : "gap-3"
                    }
                `}
            >

                <Icon
                    className={`
                        h-5 w-5 shrink-0

                        ${active
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-indigo-500"
                        }
                    `}
                />

                {!collapsed && item.label}

            </span>

        </button>
    );
};


// =====================================================
// TEACHER SIDEBAR
// =====================================================

const TeacherSidebar = ({
    open,
    onClose,
    collapsed,
}) => {

    const navigate = useNavigate();
    const location = useLocation();

    return (

        <>

            {/* ==========================================
                MOBILE OVERLAY
            ========================================== */}

            {open && (

                <div
                    className="
                        fixed inset-0 z-30
                        bg-slate-900/40
                        backdrop-blur-sm
                        lg:hidden
                    "
                    onClick={onClose}
                />

            )}


            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <aside
                className={`
        fixed inset-y-0 left-0 z-40
        transform
        overflow-y-auto
        border-r border-slate-200
        bg-white
        px-4 pb-6 pt-5
        shadow-xl
        transition-all duration-300

        lg:h-screen
        lg:shadow-none

        ${collapsed
                        ? "lg:w-20"
                        : "lg:w-72"
                    }

        max-lg:w-72

        ${open
                        ? "translate-x-0"
                        : "max-lg:-translate-x-full"
                    }
    `}
            >

                {/* ======================================
                    LOGO
                ====================================== */}

                <div
                    className={`
                        mb-7 flex items-center

                        ${collapsed
                            ? "justify-center"
                            : "justify-between"
                        }

                        px-1
                    `}
                >

                    {/* Logo */}

                    <div
                        className={`
                            flex items-center

                            ${collapsed
                                ? "justify-center"
                                : "gap-3"
                            }
                        `}
                    >

                        <div className="
                            flex h-10 w-10 shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-gradient-to-br
                            from-indigo-600
                            to-violet-600
                            text-white
                            shadow-md
                            shadow-indigo-200
                        ">

                            <BookOpen className="h-5 w-5" />

                        </div>


                        {!collapsed && (

                            <div className="leading-tight">

                                <p className="
                                    text-lg
                                    font-extrabold
                                    tracking-tight
                                    text-slate-900
                                ">
                                    SRMS
                                </p>

                                <p className="
                                    text-[11px]
                                    font-semibold
                                    text-indigo-500
                                ">
                                    Teacher Portal
                                </p>

                            </div>

                        )}

                    </div>


                    {/* Mobile Close */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            hover:bg-slate-100
                            hover:text-slate-700
                            lg:hidden
                        "
                    >

                        <X className="h-5 w-5" />

                    </button>

                </div>


                {/* ======================================
                    NAVIGATION
                ====================================== */}

                <nav className="space-y-7">

                    {navSections.map((section, index) => (

                        <div key={index}>

                            {section.title && !collapsed && (

                                <p className="
                                    mb-2
                                    px-3
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-widest
                                    text-slate-400
                                ">
                                    {section.title}
                                </p>

                            )}


                            <div className="space-y-1">

                                {section.items.map((item) => (

                                    <NavItem
                                        key={item.label}
                                        item={item}
                                        active={
                                            location.pathname === item.path
                                        }
                                        collapsed={collapsed}
                                        onClick={(path) => {

                                            onClose();

                                            navigate(path);

                                        }}
                                    />

                                ))}

                            </div>

                        </div>

                    ))}

                </nav>


                {/* ======================================
                    SUPPORT CARD
                ====================================== */}

                {!collapsed && (

                    <div className="
                        mt-8
                        rounded-2xl
                        bg-gradient-to-br
                        from-indigo-50
                        to-violet-50
                        p-4
                    ">

                        <div className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            bg-white
                            text-indigo-600
                            shadow-sm
                        ">

                            <Headphones className="h-4 w-4" />

                        </div>


                        <p className="
                            mt-3
                            text-sm
                            font-bold
                            text-slate-800
                        ">
                            Need Help?
                        </p>


                        <p className="
                            mt-1
                            text-xs
                            leading-relaxed
                            text-slate-500
                        ">
                            Have questions or need support?
                            Our support team is here to help.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/teacher/support")
                            }
                            className="
                                mt-3
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-white
                                py-2.5
                                text-xs
                                font-semibold
                                text-indigo-600
                                shadow-sm
                                transition
                                hover:bg-indigo-600
                                hover:text-white
                            "
                        >

                            <Headphones className="h-4 w-4" />

                            Contact Support

                        </button>

                    </div>

                )}

            </aside>

        </>
    );
};

export default TeacherSidebar;