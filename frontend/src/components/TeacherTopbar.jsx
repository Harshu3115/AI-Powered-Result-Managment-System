import React, { useEffect, useState } from "react";
import {
    Menu,
    Bell,
    Search,
    ChevronDown,
    User,
    LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import teacherService from "../services/teacherService";

const TeacherTopbar = ({
    collapsed,
    setCollapsed,
    onMenuClick,
    onSidebarToggle,
    sidebarCollapsed,
    dashboardData,
}) => {
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    // Prefer dashboard teacher name
    const teacherName =
        dashboardData?.teacherName ||
        (
            user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.firstName ||
                user?.name ||
                user?.fullName ||
                "Teacher"
        );

    const getInitials = (name) => {
        if (!name) return "T";

        const parts = name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0]
                .charAt(0)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };

    const handleMenuClick = () => {
        // Desktop → collapse / expand sidebar
        if (window.innerWidth >= 1024) {
            if (onSidebarToggle) {
                onSidebarToggle();
            }
            return;
        }

        // Mobile → open sidebar drawer
        if (onMenuClick) {
            onMenuClick();
        }
    };


    const handleLogoutClick = () => {
        setProfileOpen(false);
        setLogoutModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setProfileOpen(false);
        setLogoutModalOpen(false);

        navigate("/login");
    };

    const loadNotifications = async () => {
        try {
            const response = await teacherService.getNotifications();

            setNotifications(response?.data || []);
        } catch (error) {
            console.error(
                "Failed to load teacher notifications:",
                error
            );
        }
    };

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header
                className={`
        fixed
        top-0
        right-0
        z-40
        h-[72px]
        bg-white
        border-b
        border-slate-200
        transition-all
        duration-300

        ${sidebarCollapsed
                        ? "lg:left-20"
                        : "lg:left-72"
                    }

        left-0
    `}
            >
                <div
                    className="
                    h-full
                    px-4
                    sm:px-6
                    flex
                    items-center
                    justify-between
                "
                >
                    {/* =========================
                    LEFT
                ========================== */}

                    <div
                        className="
                        flex
                        items-center
                        gap-4
                    "
                    >
                        <button
                            type="button"
                            onClick={handleMenuClick}
                            className="
                            h-9
                            w-9
                            rounded-lg
                            hover:bg-slate-100
                            flex
                            items-center
                            justify-center
                            text-slate-600
                            transition
                        "
                        >
                            <Menu size={20} />
                        </button>

                        {/* SEARCH */}

                        <div
                            className="
                            hidden
                            md:flex
                            items-center
                            gap-2
                            bg-slate-50
                            border
                            border-slate-200
                            rounded-xl
                            px-3
                            h-10
                            w-[260px]
                        "
                        >
                            <Search
                                size={17}
                                className="text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search..."
                                className="
                                bg-transparent
                                outline-none
                                text-sm
                                w-full
                                text-slate-700
                                placeholder:text-slate-400
                            "
                            />
                        </div>
                    </div>

                    {/* =========================
                    RIGHT
                ========================== */}

                    <div
                        className="
                        flex
                        items-center
                        gap-3
                    "
                    >
                        {/* =========================
    NOTIFICATIONS
========================== */}

                        <div className="relative">

                            <button
                                type="button"
                                onClick={() =>
                                    setNotificationOpen((prev) => !prev)
                                }
                                className="
            relative
            h-10
            w-10
            rounded-xl
            hover:bg-slate-100
            flex
            items-center
            justify-center
            text-slate-600
        "
                            >
                                <Bell size={19} />

                                {notifications.some(
                                    (notification) => !notification.isRead
                                ) && (
                                        <span
                                            className="
                    absolute
                    top-2
                    right-2
                    h-2
                    w-2
                    rounded-full
                    bg-red-500
                    border-2
                    border-white
                "
                                        />
                                    )}
                            </button>

                            {/* Notification Dropdown */}
                            {notificationOpen && (
                                <div
                                    className="
                absolute
                right-0
                top-full
                mt-2
                w-80
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-xl
                overflow-hidden
                z-50
            "
                                >

                                    {/* Header */}
                                    <div
                                        className="
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    border-b
                    border-slate-100
                "
                                    >
                                        <h3
                                            className="
                        text-sm
                        font-semibold
                        text-slate-700
                    "
                                        >
                                            Notifications
                                        </h3>

                                        {notifications.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    try {
                                                        await teacherService.markAllNotificationsAsRead();

                                                        setNotifications((prev) =>
                                                            prev.map((notification) => ({
                                                                ...notification,
                                                                isRead: true,
                                                            }))
                                                        );
                                                    } catch (error) {
                                                        console.error(
                                                            "Failed to mark notifications as read:",
                                                            error
                                                        );
                                                    }
                                                }}
                                                className="
                            text-xs
                            text-blue-600
                            hover:text-blue-700
                        "
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    {/* Notification List */}
                                    <div className="max-h-96 overflow-y-auto">

                                        {notifications.length === 0 ? (

                                            <div className="px-4 py-8 text-center">

                                                <Bell
                                                    size={28}
                                                    className="
                                mx-auto
                                mb-2
                                text-slate-300
                            "
                                                />

                                                <p
                                                    className="
                                text-sm
                                text-slate-500
                            "
                                                >
                                                    No notifications
                                                </p>

                                            </div>

                                        ) : (

                                            notifications.map((notification) => (

                                                <button
                                                    key={notification.id}
                                                    type="button"
                                                    onClick={async () => {
                                                        if (!notification.isRead) {
                                                            try {
                                                                await teacherService.markNotificationAsRead(
                                                                    notification.id
                                                                );

                                                                setNotifications((prev) =>
                                                                    prev.map((item) =>
                                                                        item.id === notification.id
                                                                            ? {
                                                                                ...item,
                                                                                isRead: true,
                                                                            }
                                                                            : item
                                                                    )
                                                                );
                                                            } catch (error) {
                                                                console.error(
                                                                    "Failed to mark notification as read:",
                                                                    error
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    className={`
                                w-full
                                text-left
                                px-4
                                py-3
                                border-b
                                border-slate-100
                                hover:bg-slate-50
                                transition
                                ${!notification.isRead
                                                            ? "bg-blue-50/50"
                                                            : "bg-white"
                                                        }
                            `}
                                                >

                                                    <div className="flex gap-3">

                                                        {/* Notification Indicator */}
                                                        <div
                                                            className={`
                                        mt-1
                                        h-2
                                        w-2
                                        rounded-full
                                        flex-shrink-0
                                        ${!notification.isRead
                                                                    ? "bg-blue-500"
                                                                    : "bg-slate-300"
                                                                }
                                    `}
                                                        />

                                                        <div className="min-w-0">

                                                            <p
                                                                className="
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                                            >
                                                                {notification.title}
                                                            </p>

                                                            <p
                                                                className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                            leading-5
                                        "
                                                            >
                                                                {notification.message}
                                                            </p>

                                                            {notification.createdAt && (
                                                                <p
                                                                    className="
                                                mt-1
                                                text-[10px]
                                                text-slate-400
                                            "
                                                                >
                                                                    {new Date(
                                                                        notification.createdAt
                                                                    ).toLocaleString()}
                                                                </p>
                                                            )}

                                                        </div>

                                                    </div>

                                                </button>

                                            ))

                                        )}

                                    </div>
                                </div>
                            )}

                        </div>

                        {/* PROFILE */}

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileOpen(
                                        (prev) => !prev
                                    )
                                }
                                className="
                                h-10
                                pl-2
                                pr-3
                                rounded-xl
                                hover:bg-slate-50
                                flex
                                items-center
                                gap-2
                            "
                            >
                                <div
                                    className="
                                    h-9
                                    w-9
                                    rounded-full
                                    bg-gradient-to-br
                                    from-indigo-500
                                    to-blue-600
                                    flex
                                    items-center
                                    justify-center
                                    text-white
                                    text-sm
                                    font-semibold
                                "
                                >
                                    {getInitials(
                                        teacherName
                                    )}
                                </div>

                                <div className="hidden sm:block text-left">
                                    <p
                                        className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                    >
                                        {teacherName}
                                    </p>

                                    <p
                                        className="
                                        text-[11px]
                                        text-slate-400
                                    "
                                    >
                                        Teacher
                                    </p>
                                </div>

                                <ChevronDown
                                    size={15}
                                    className="
                                    text-slate-400
                                "
                                />
                            </button>

                            {profileOpen && (
                                <div
                                    className="
                                    absolute
                                    right-0
                                    top-full
                                    mt-2
                                    w-52
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-lg
                                    overflow-hidden
                                "
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate(
                                                "/teacher/profile"
                                            );
                                        }}
                                        className="
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-600
                                        hover:bg-slate-50
                                    "
                                    >
                                        <User size={16} />

                                        Profile
                                    </button>

                                    <div className="border-t border-slate-100" />

                                    <button
                                        type="button"
                                        onClick={handleLogoutClick}
                                        className="
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        text-sm
                                        text-red-600
                                        hover:bg-red-50
                                    "
                                    >
                                        <LogOut size={16} />

                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <LogoutModal
                isOpen={logoutModalOpen}
                onConfirm={handleLogout}
                onCancel={() => setLogoutModalOpen(false)}
            />
        </>
    );
};

export default TeacherTopbar;