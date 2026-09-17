import { useEffect, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    RefreshCw,
    AlertCircle,
    Info,
    Clock,
} from "lucide-react";


import {
    getAdminNotifications,
    markAdminNotificationAsRead,
    markAllAdminNotificationsAsRead,
    deleteAdminNotification,
} from "../../services/adminNotificationService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AdminNotifications = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // =========================================================
    // FETCH NOTIFICATIONS
    // =========================================================

    const fetchNotifications = async (showRefresh = false) => {

        try {

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await getAdminNotifications();

            console.log(
                "Admin Notifications API:",
                response
            );

            if (response?.success) {

                setNotifications(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } else {

                setNotifications([]);
            }

        } catch (error) {

            console.error(
                "Admin Notifications Error:",
                error
            );

            setNotifications([]);

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        fetchNotifications();

    }, []);


    // =========================================================
    // UNREAD COUNT
    // =========================================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read &&
                !notification.isRead
        ).length;


    // =========================================================
    // MARK AS READ
    // =========================================================

    const handleMarkAsRead = async (notification) => {

        if (
            notification.read ||
            notification.isRead
        ) {
            return;
        }

        try {

            await markAdminNotificationAsRead(
                notification.id
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === notification.id
                        ? {
                            ...item,
                            read: true,
                            isRead: true,
                        }
                        : item
                )
            );

        } catch (error) {

            console.error(
                "Mark notification read error:",
                error
            );
        }
    };


    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    const handleMarkAllAsRead = async () => {

        if (unreadCount === 0) {
            return;
        }

        try {

            await markAllAdminNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    read: true,
                    isRead: true,
                }))
            );

        } catch (error) {

            console.error(
                "Mark all notifications read error:",
                error
            );
        }
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (id) => {

        try {

            await deleteAdminNotification(id);

            setNotifications((prev) =>
                prev.filter(
                    (notification) =>
                        notification.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete notification error:",
                error
            );
        }
    };


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    // =========================================================
    // NOTIFICATION ICON
    // =========================================================

    const getNotificationIcon = (notification) => {

        const type =
            String(
                notification?.type ||
                notification?.notificationType ||
                ""
            ).toUpperCase();

        if (
            type.includes("ERROR") ||
            type.includes("FAIL") ||
            type.includes("REJECT")
        ) {
            return (
                <div className="
                    h-11
                    w-11
                    shrink-0
                    rounded-xl
                    bg-red-50
                    text-red-600
                    flex
                    items-center
                    justify-center
                ">
                    <AlertCircle size={21} />
                </div>
            );
        }

        if (
            type.includes("SUCCESS") ||
            type.includes("APPROVED")
        ) {
            return (
                <div className="
                    h-11
                    w-11
                    shrink-0
                    rounded-xl
                    bg-emerald-50
                    text-emerald-600
                    flex
                    items-center
                    justify-center
                ">
                    <Check size={21} />
                </div>
            );
        }

        if (
            type.includes("WARNING")
        ) {
            return (
                <div className="
                    h-11
                    w-11
                    shrink-0
                    rounded-xl
                    bg-amber-50
                    text-amber-600
                    flex
                    items-center
                    justify-center
                ">
                    <AlertCircle size={21} />
                </div>
            );
        }

        return (
            <div className="
                h-11
                w-11
                shrink-0
                rounded-xl
                bg-indigo-50
                text-indigo-600
                flex
                items-center
                justify-center
            ">
                <Info size={21} />
            </div>
        );
    };


    // =========================================================
    // GET TITLE
    // =========================================================

    const getTitle = (notification) => {

        return (
            notification?.title ||
            notification?.subject ||
            "Notification"
        );
    };


    // =========================================================
    // GET MESSAGE
    // =========================================================

    const getMessage = (notification) => {

        return (
            notification?.message ||
            notification?.description ||
            "You have a new notification."
        );
    };


    // =========================================================
    // GET DATE
    // =========================================================

    const getNotificationDate = (notification) => {

        return (
            notification?.createdAt ||
            notification?.createdDate ||
            notification?.timestamp ||
            notification?.date
        );
    };


    return (
        <div className="
            min-h-screen
            bg-slate-50
            overflow-x-hidden
        ">

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

                    md:ml-[76px]

                    ${!collapsed
                        ? "md:ml-[260px]"
                        : ""
                    }
                `}
            >

                <div className="
                    p-4
                    sm:p-5
                    lg:p-6
                    xl:p-8
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
                                    bg-indigo-100
                                    text-indigo-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <Bell size={22} />
                                </div>

                                <div>

                                    <h1 className="
                                        text-xl
                                        sm:text-2xl
                                        font-bold
                                        text-slate-800
                                    ">
                                        Notifications
                                    </h1>

                                    <p className="
                                        mt-0.5
                                        text-xs
                                        sm:text-sm
                                        text-slate-500
                                    ">
                                        Stay updated with important
                                        system activities
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        ">

                            <button
                                type="button"
                                onClick={() =>
                                    fetchNotifications(true)
                                }
                                disabled={refreshing}
                                className="
                                    inline-flex
                                    min-h-[42px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-xs
                                    sm:text-sm
                                    font-semibold
                                    text-slate-700
                                    shadow-sm
                                    hover:bg-slate-50
                                    disabled:opacity-60
                                "
                            >

                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                <span>
                                    Refresh
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleMarkAllAsRead
                                }
                                disabled={
                                    unreadCount === 0
                                }
                                className="
                                    inline-flex
                                    min-h-[42px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-indigo-600
                                    px-3
                                    py-2.5
                                    text-xs
                                    sm:text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    hover:bg-indigo-700
                                    disabled:opacity-50
                                "
                            >

                                <CheckCheck size={16} />

                                <span>
                                    Mark all as read
                                </span>

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="
                        mt-6
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-4
                    ">

                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        font-medium
                                        text-slate-500
                                    ">
                                        Total Notifications
                                    </p>

                                    <p className="
                                        mt-1
                                        text-2xl
                                        font-bold
                                        text-slate-800
                                    ">
                                        {notifications.length}
                                    </p>

                                </div>

                                <div className="
                                    h-11
                                    w-11
                                    rounded-xl
                                    bg-slate-100
                                    text-slate-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <Bell size={20} />
                                </div>

                            </div>

                        </div>


                        <div className="
                            rounded-2xl
                            border
                            border-indigo-100
                            bg-indigo-50
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        font-medium
                                        text-indigo-600
                                    ">
                                        Unread Notifications
                                    </p>

                                    <p className="
                                        mt-1
                                        text-2xl
                                        font-bold
                                        text-indigo-700
                                    ">
                                        {unreadCount}
                                    </p>

                                </div>

                                <div className="
                                    h-11
                                    w-11
                                    rounded-xl
                                    bg-white
                                    text-indigo-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <AlertCircle size={20} />
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        NOTIFICATION LIST
                    ================================================= */}

                    <div className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        overflow-hidden
                    ">

                        <div className="
                            border-b
                            border-slate-200
                            px-4
                            py-4
                            sm:px-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            ">

                                <h2 className="
                                    text-base
                                    font-bold
                                    text-slate-800
                                ">
                                    All Notifications
                                </h2>

                                {unreadCount > 0 && (
                                    <span className="
                                        rounded-full
                                        bg-indigo-100
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-semibold
                                        text-indigo-700
                                    ">
                                        {unreadCount} unread
                                    </span>
                                )}

                            </div>

                        </div>


                        {/* LOADING */}

                        {loading ? (

                            <div className="
                                flex
                                min-h-[280px]
                                items-center
                                justify-center
                            ">

                                <div className="
                                    flex
                                    flex-col
                                    items-center
                                    gap-3
                                ">

                                    <RefreshCw
                                        size={25}
                                        className="
                                            animate-spin
                                            text-indigo-600
                                        "
                                    />

                                    <p className="
                                        text-sm
                                        text-slate-500
                                    ">
                                        Loading notifications...
                                    </p>

                                </div>

                            </div>

                        ) : notifications.length === 0 ? (

                            /* EMPTY */

                            <div className="
                                flex
                                min-h-[320px]
                                flex-col
                                items-center
                                justify-center
                                px-5
                                text-center
                            ">

                                <div className="
                                    h-16
                                    w-16
                                    rounded-full
                                    bg-slate-100
                                    text-slate-400
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <Bell size={28} />
                                </div>

                                <h3 className="
                                    mt-4
                                    text-base
                                    font-semibold
                                    text-slate-700
                                ">
                                    No notifications
                                </h3>

                                <p className="
                                    mt-1
                                    max-w-sm
                                    text-sm
                                    text-slate-400
                                ">
                                    You're all caught up.
                                    New system notifications
                                    will appear here.
                                </p>

                            </div>

                        ) : (

                            /* LIST */

                            <div>

                                {notifications.map(
                                    (notification, index) => {

                                        const isRead =
                                            notification.read ||
                                            notification.isRead;

                                        return (
                                            <div
                                                key={
                                                    notification.id ||
                                                    index
                                                }
                                                className={`
                                                    group
                                                    border-b
                                                    border-slate-100
                                                    px-4
                                                    py-4
                                                    transition
                                                    sm:px-5

                                                    ${!isRead
                                                        ? "bg-indigo-50/40"
                                                        : "bg-white"
                                                    }

                                                    hover:bg-slate-50
                                                `}
                                            >

                                                <div className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                ">

                                                    {getNotificationIcon(
                                                        notification
                                                    )}


                                                    <div className="
                                                        min-w-0
                                                        flex-1
                                                    ">

                                                        <div className="
                                                            flex
                                                            flex-col
                                                            gap-1
                                                            sm:flex-row
                                                            sm:items-start
                                                            sm:justify-between
                                                        ">

                                                            <h3 className="
                                                                text-sm
                                                                font-semibold
                                                                text-slate-800
                                                            ">
                                                                {getTitle(
                                                                    notification
                                                                )}
                                                            </h3>

                                                            {!isRead && (
                                                                <span className="
                                                                    h-2
                                                                    w-2
                                                                    shrink-0
                                                                    rounded-full
                                                                    bg-indigo-600
                                                                " />
                                                            )}

                                                        </div>


                                                        <p className="
                                                            mt-1
                                                            text-sm
                                                            leading-6
                                                            text-slate-500
                                                        ">
                                                            {getMessage(
                                                                notification
                                                            )}
                                                        </p>


                                                        <div className="
                                                            mt-2
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-3
                                                            text-[11px]
                                                            text-slate-400
                                                        ">

                                                            <span className="
                                                                inline-flex
                                                                items-center
                                                                gap-1
                                                            ">

                                                                <Clock
                                                                    size={12}
                                                                />

                                                                {formatDate(
                                                                    getNotificationDate(
                                                                        notification
                                                                    )
                                                                )}

                                                            </span>

                                                        </div>


                                                        {/* ACTIONS */}

                                                        <div className="
                                                            mt-3
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-2
                                                        ">

                                                            {!isRead && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleMarkAsRead(
                                                                            notification
                                                                        )
                                                                    }
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-1.5
                                                                        rounded-lg
                                                                        bg-indigo-50
                                                                        px-2.5
                                                                        py-1.5
                                                                        text-[11px]
                                                                        font-semibold
                                                                        text-indigo-600
                                                                        hover:bg-indigo-100
                                                                    "
                                                                >

                                                                    <Check
                                                                        size={13}
                                                                    />

                                                                    Mark as read

                                                                </button>
                                                            )}


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-lg
                                                                    bg-red-50
                                                                    px-2.5
                                                                    py-1.5
                                                                    text-[11px]
                                                                    font-semibold
                                                                    text-red-600
                                                                    hover:bg-red-100
                                                                "
                                                            >

                                                                <Trash2
                                                                    size={13}
                                                                />

                                                                Delete

                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
};

export default AdminNotifications;