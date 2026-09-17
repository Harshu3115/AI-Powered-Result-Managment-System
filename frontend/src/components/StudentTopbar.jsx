import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    Bell,
    ChevronDown,

    User,
    LogOut,
    Loader2,
} from "lucide-react";
import { TfiAlignLeft, TfiAlignRight } from "react-icons/tfi";
import studentService from "../services/studentService";
import {
    connectNotificationSocket,
    disconnectNotificationSocket
} from "../services/notificationSocket";

const StudentTopbar = ({
    title,
    onMenuClick,
    onSidebarToggle,
    sidebarCollapsed,
    dashboardData,
    profile
}) => {

    const [profileOpen, setProfileOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");

        setLogoutModalOpen(false);
        setProfileOpen(false);

        navigate("/login");
    };

    const studentName =
        dashboardData?.studentName ||
        dashboardData?.name ||
        dashboardData?.fullName ||
        [dashboardData?.firstName, dashboardData?.lastName]
            .filter(Boolean)
            .join(" ") ||
        [dashboardData?.student?.firstName, dashboardData?.student?.lastName]
            .filter(Boolean)
            .join(" ") ||
        dashboardData?.student?.name ||
        "Student";

    const getInitials = (name) => {
        if (!name) return "ST";

        const parts = name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };


    const [notifications, setNotifications] = useState([]);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);



    useEffect(() => {

        // Load old notifications once
        loadNotifications();

        // Listen for new notifications
        connectNotificationSocket(
            (newNotification) => {

                console.log(
                    "Student received notification:",
                    newNotification
                );

                setNotifications((prev) => [
                    newNotification,
                    ...prev
                ]);

                // Notify other pages that a new notification arrived
                window.dispatchEvent(
                    new CustomEvent("notificationReceived", {
                        detail: newNotification
                    })
                );
            }
        );

        return () => {
            disconnectNotificationSocket();
        };

    }, []);

    const loadNotifications = async () => {

        try {

            setNotificationLoading(true);

            const response =
                await studentService.getNotifications();

            console.log(
                "Notifications API:",
                response
            );

            setNotifications(
                response?.data || []
            );

        } catch (error) {

            console.error(
                "Notification Error:",
                error
            );

        } finally {

            setNotificationLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (notification.isRead) {
                return;
            }

            await studentService.markNotificationAsRead(
                notification.id
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === notification.id
                        ? {
                            ...item,
                            isRead: true
                        }
                        : item
                )
            );

        } catch (error) {
            console.error(
                "Mark notification as read error:",
                error
            );
        }
    };

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;

    return (

        <header
            className={`
            fixed
            top-0
            right-0
            left-0
            z-50
            flex
            h-16
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-4
            sm:px-6
            transition-all
            duration-300
            ${sidebarCollapsed
                    ? "lg:left-20"
                    : "lg:left-72"
                }
        `}
        >

            {/* LEFT */}

            <div className="flex items-center gap-2">

                {/* DESKTOP SIDEBAR TOGGLE */}
                <button
                    type="button"
                    onClick={onSidebarToggle}
                    className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 lg:flex"
                    title={
                        sidebarCollapsed
                            ? "Expand Sidebar"
                            : "Collapse Sidebar"
                    }
                >
                    {sidebarCollapsed ? (
                        <TfiAlignRight className="h-5 w-5" />
                    ) : (
                        <TfiAlignLeft className="h-5 w-5" />
                    )}
                </button>

                {/* MOBILE MENU */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="absolute left-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 lg:hidden"
                    title="Open Menu"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* PAGE TITLE */}
                <h1 className="text-base font-bold text-indigo-600 sm:text-lg">
                    {title}
                </h1>

            </div>


            {/* RIGHT SIDE */}

            <div className="flex items-center gap-4">

                {/* NOTIFICATION */}
                <div className="relative">

                    <button
                        type="button"
                        onClick={() =>
                            setNotificationOpen((prev) => !prev)
                        }
                        className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                    >
                        <Bell className="h-5 w-5" />

                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {unreadCount > 9
                                    ? "9+"
                                    : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {notificationOpen && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                            <div className="border-b border-slate-100 px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Notifications
                                    </h3>

                                    {unreadCount > 0 && (
                                        <span className="text-xs text-indigo-600">
                                            {unreadCount} unread
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-96 overflow-y-auto">

                                {notificationLoading ? (

                                    <div className="flex items-center justify-center p-6">
                                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                                    </div>

                                ) : notifications.length === 0 ? (

                                    <div className="p-6 text-center text-sm text-slate-400">
                                        No notifications
                                    </div>

                                ) : (

                                    notifications.map((notification) => (

                                        <div
                                            key={notification.id}
                                            onClick={() =>
                                                handleNotificationClick(notification)
                                            }
                                            className={`cursor-pointer border-b border-slate-100 px-4 py-3 transition hover:bg-indigo-100 ${!notification.isRead
                                                ? "bg-indigo-50"
                                                : "bg-white"
                                                }`}
                                        >

                                            <div className="flex items-start gap-3">

                                                {/* Unread indicator */}
                                                {!notification.isRead ? (
                                                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                                                ) : (
                                                    <div className="mt-1 h-2 w-2 shrink-0" />
                                                )}

                                                <div className="min-w-0">

                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {notification.title}
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        {notification.message}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-slate-400">
                                                        {notification.createdAt
                                                            ? new Date(
                                                                notification.createdAt
                                                            ).toLocaleString()
                                                            : ""}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

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
                            setProfileOpen((prev) => !prev)
                        }
                        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                    >

                        {/* INITIALS */}

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                            {getInitials(studentName)}
                        </div>


                        {/* USER INFORMATION */}

                        <div className="hidden text-left leading-tight sm:block">

                            <p className="text-sm font-semibold text-slate-800">

                                {studentName}

                            </p>

                            <p className="text-xs text-slate-400">
                                {profile?.courseName ||
                                    profile?.course ||
                                    profile?.course_name ||
                                    dashboardData?.courseName ||
                                    dashboardData?.course ||
                                    dashboardData?.course_name ||
                                    "Course"}
                            </p>

                        </div>


                        {/* ARROW */}

                        <ChevronDown
                            className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${profileOpen
                                ? "rotate-180"
                                : ""
                                }`}
                        />

                    </button>


                    {/* PROFILE DROPDOWN */}

                    {profileOpen && (

                        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

                            {/* PROFILE */}

                            <button
                                type="button"
                                onClick={() => {

                                    setProfileOpen(false);

                                    navigate(
                                        "/student/profile"
                                    );
                                }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
                            >

                                <User className="h-4 w-4 text-slate-400" />

                                Profile

                            </button>


                            <div className="border-t border-slate-100" />


                            {/* LOGOUT */}

                            <button
                                type="button"
                                onClick={() => {
                                    setProfileOpen(false);
                                    setLogoutModalOpen(true);
                                }}
                                className="
            flex
            w-full
            items-center
            gap-3
            px-4
            py-3
            text-sm
            text-red-600
            transition
            hover:bg-red-50
        "
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>


            {/* LOGOUT CONFIRMATION MODAL */}
            {logoutModalOpen && (
                <div
                    className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-slate-900/50
                px-4
                backdrop-blur-sm
            "
                    onClick={() => setLogoutModalOpen(false)}
                >
                    <div
                        className="
                    w-full
                    max-w-sm
                    overflow-hidden

                    border
                    border-slate-200
                    bg-white
                    shadow-[0_25px_80px_rgba(15,23,42,0.25)]
                    animate-[fadeIn_0.2s_ease-out]
                "
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* ICON */}
                        <div className="flex justify-center pt-7">
                            <div
                                className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            bg-red-50
                            text-red-600
                        "
                            >
                                <LogOut className="h-6 w-6" />
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="px-6 pb-5 pt-4 text-center">

                            <h3 className="text-lg font-bold text-slate-900">
                                Logout
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Are you sure you want to logout from your
                                student account?
                            </p>

                        </div>

                        {/* ACTIONS */}
                        <div
                            className="
                        flex
                        gap-3
                        border-t
                        border-slate-100
                        bg-slate-50
                        px-6
                        py-4
                    "
                        >

                            {/* CANCEL */}
                            <button
                                type="button"
                                onClick={() =>
                                    setLogoutModalOpen(false)
                                }
                                className="
                            flex-1

                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-600
                            transition
                            hover:bg-slate-100
                        "
                            >
                                Cancel
                            </button>

                            {/* LOGOUT */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                            flex-1

                            bg-red-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-red-700
                            hover:shadow-md
                            active:scale-[0.98]
                        "
                            >
                                Logout
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </header>
    );
};

export default StudentTopbar;