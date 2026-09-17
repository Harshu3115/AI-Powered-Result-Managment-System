import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import studentService from "../services/studentService";
import {
    LayoutDashboard,
    BarChart3,
    LineChart as LineChartIcon,
    BookOpenCheck,
    ClipboardList,
    MessageSquare,
    RotateCcw,
    FileEdit,
    Settings,
    BookOpen,
    Headphones,
    X,
    Download,
    RefreshCw,

} from "lucide-react";

const navSections = [
    {
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboard,
                path: "/student/dashboard",

            },
        ],
    },

    {
        title: "Academic",
        items: [
            {
                label: "My Results",
                icon: BarChart3,
                path: "/student/results",
            },
            {
                label: "Performance Analysis",
                icon: LineChartIcon,
                path: "/student/performance",
            },
            {
                label: "Subject Analysis",
                icon: BookOpenCheck,
                path: "/student/subjects",
            },
            {
                label: "Study Plan",
                icon: ClipboardList,
                path: "/student/study-plan",
            },
        ],
    },

    {
        title: "Downloads",
        items: [
            {
                label: "Download Result",
                icon: Download,
                path: "/student/downloads",
            },
        ],
    },

    {
        title: "AI Tools",
        items: [
            {
                label: "AI Assistant",
                icon: MessageSquare,
                path: "/student/ai-chat",
            },
        ],
    },

    {
        title: "Requests",
        items: [
            {
                label: "Rechecking",
                icon: RotateCcw,
                path: "/student/rechecking",
            },
            {
                label: "Reevaluation",
                path: "/student/reevaluation",
                icon: RefreshCw
            }
        ],
    },

    {
        title: "Account",
        items: [
            {
                label: "Settings",
                icon: Settings,
                path: "/student/settings",
            },
        ],
    },
];

const NavItem = ({ item, active, onClick, collapsed }) => {
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
                    ${collapsed ? "justify-center" : "gap-3"}
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

            {!collapsed && item.badge && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                    {item.badge}
                </span>
            )}
        </button>
    );
};

const StudentSidebar = ({
    open,
    onClose,
    collapsed,
}) => {

    const navigate = useNavigate();

    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}

            {open && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}

            <aside
                className={`
        fixed
        inset-y-0
        left-0
        z-40
        w-72
        transform
        overflow-y-auto
        border-r
        border-slate-200
        bg-white
        px-4
        pb-6
        pt-5
        shadow-xl
        transition-all
        duration-300
        lg:shadow-none

        ${collapsed ? "lg:w-20" : "lg:w-72"}

        max-lg:w-72

        ${open
                        ? "translate-x-0"
                        : "max-lg:-translate-x-full"
                    }
    `}
            >

                {/* Logo + Toggle */}

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
                    {/* LOGO */}

                    <div
                        className={`
            flex items-center
            ${collapsed ? "justify-center" : "gap-3"}
        `}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200">
                            <BookOpen className="h-5 w-5" />
                        </div>

                        {!collapsed && (
                            <div className="leading-tight">
                                <p className="text-lg font-extrabold tracking-tight text-slate-900">
                                    SRMS
                                </p>

                                <p className="text-[11px] font-semibold text-indigo-500">
                                    AI Powered
                                </p>
                            </div>
                        )}
                    </div>



                    {/* MOBILE CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}

                <nav className="space-y-7">

                    {navSections.map((section, index) => (

                        <div key={index}>

                            {section.title && !collapsed && (
                                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {section.title}
                                </p>
                            )}

                            <div className="space-y-1">

                                {section.items.map((item) => (

                                    <NavItem
                                        key={item.label}
                                        item={item}
                                        active={location.pathname === item.path}
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

                {/* Support */}

                {!collapsed && (
                    <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">

                            <Headphones className="h-4 w-4" />

                        </div>

                        <p className="mt-3 text-sm font-bold text-slate-800">
                            Need Help?
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            Have questions or need support? Our support team is here to help.
                        </p>

                        <button
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

export default StudentSidebar;