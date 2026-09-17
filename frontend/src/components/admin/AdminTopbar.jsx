import React, { useEffect, useRef, useState } from "react";
import {
    Menu,
    Bell,
    Search,
    ChevronDown,
    X,
    User,
    LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminTopbar = ({
    collapsed = false,
    setCollapsed,
    mobileOpen = false,
    setMobileOpen,
}) => {
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const displayName =
        user?.firstName ||
        user?.name ||
        user?.username ||
        "Admin";

    // =========================================================
    // MENU TOGGLE
    // Works on BOTH desktop and mobile
    // =========================================================

    const handleMenuToggle = () => {
        const isDesktop = window.matchMedia(
            "(min-width: 1024px)"
        ).matches;

        if (isDesktop) {
            // Desktop -> collapse / expand sidebar
            if (setCollapsed) {
                setCollapsed((prev) => !prev);
            }
        } else {
            // Mobile / tablet -> open / close sidebar
            if (setMobileOpen) {
                setMobileOpen((prev) => !prev);
            }
        }
    };

    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    const profileRef = useRef(null);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");

        setLogoutModalOpen(false);
        setProfileOpen(false);

        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <header
            className={`
                fixed
                top-0
                right-0
                left-0

                h-[72px]

                z-[70]

                bg-white
                border-b
                border-slate-200

                transition-[left]
                duration-300
                ease-in-out

                ${collapsed
                    ? "lg:left-[76px]"
                    : "lg:left-[260px]"
                }
            `}
        >
            <div
                className="
                    h-full
                    w-full

                    px-3
                    sm:px-5
                    md:px-6

                    flex
                    items-center
                    justify-between

                    gap-2
                "
            >

                {/* =====================================================
                    LEFT
                ====================================================== */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        sm:gap-3

                        min-w-0
                    "
                >

                    {/* =================================================
                        MENU BUTTON
                        ONE BUTTON FOR MOBILE + DESKTOP
                    ================================================= */}

                    <button
                        type="button"
                        onClick={handleMenuToggle}
                        className="
                            flex

                            h-10
                            w-10
                            shrink-0

                            items-center
                            justify-center

                            rounded-xl

                            text-slate-600

                            hover:bg-indigo-50
                            hover:text-indigo-600

                            active:scale-95

                            transition-all
                            duration-200
                        "
                        aria-label={
                            mobileOpen
                                ? "Close menu"
                                : collapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                        }
                    >

                        {/* 
                           Mobile:
                           show X when sidebar is open.

                           Desktop:
                           always show Menu.
                        */}

                        <span className="lg:hidden">
                            {mobileOpen ? (
                                <X size={22} />
                            ) : (
                                <Menu size={22} />
                            )}
                        </span>

                        <span className="hidden lg:block">
                            <Menu size={22} />
                        </span>

                    </button>


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div
                        className="
                            hidden
                            sm:flex

                            items-center
                            gap-2

                            bg-slate-50

                            border
                            border-slate-200

                            rounded-xl

                            px-3
                            h-10

                            w-[180px]
                            md:w-[240px]
                            lg:w-[280px]

                            transition-all

                            focus-within:border-indigo-300
                            focus-within:bg-white
                            focus-within:ring-2
                            focus-within:ring-indigo-100
                        "
                    >

                        <Search
                            size={17}
                            className="
                                shrink-0
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="
                                w-full
                                min-w-0

                                bg-transparent
                                outline-none

                                text-sm
                                text-slate-700

                                placeholder:text-slate-400
                            "
                        />

                    </div>

                </div>


                {/* =====================================================
                    RIGHT
                ====================================================== */}

                <div
                    className="
                        flex
                        items-center

                        gap-1
                        sm:gap-2

                        shrink-0
                    "
                >

                    {/* =================================================
                        MOBILE SEARCH
                    ================================================= */}

                    <button
                        type="button"
                        className="
                            flex
                            sm:hidden

                            h-10
                            w-10

                            items-center
                            justify-center

                            rounded-xl

                            text-slate-600

                            hover:bg-slate-100
                            hover:text-indigo-600

                            transition
                        "
                        aria-label="Search"
                    >
                        <Search size={19} />
                    </button>


                    {/* =================================================
                        NOTIFICATION
                    ================================================= */}

                    <button
                        type="button"
                        className="
                            relative

                            h-10
                            w-10

                            shrink-0

                            rounded-xl

                            flex
                            items-center
                            justify-center

                            text-slate-600

                            hover:bg-slate-100
                            hover:text-indigo-600

                            transition-all
                            duration-200
                        "
                        aria-label="Notifications"
                    >

                        <Bell size={19} />

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

                    </button>


                    {/* =================================================
                        ADMIN PROFILE
                    ================================================= */}

                    <button
                        type="button"
                        onClick={() => setProfileOpen((prev) => !prev)}
                        className="
        h-10
        pl-1
        sm:pl-2
        pr-1
        sm:pr-2
        rounded-xl
        flex
        items-center
        gap-2
        hover:bg-slate-50
        transition
    "
                        title="Admin Profile"
                    >

                        {/* AVATAR */}

                        <div
                            className="
                                h-9
                                w-9

                                shrink-0

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

                                shadow-sm
                            "
                        >
                            {String(displayName)
                                .charAt(0)
                                .toUpperCase()}
                        </div>


                        {/* USER NAME */}

                        <div
                            className="
                                hidden
                                sm:block

                                text-left

                                max-w-[120px]
                                md:max-w-[160px]
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    truncate
                                "
                            >
                                {displayName}
                            </p>

                            <p
                                className="
                                    text-[11px]
                                    text-slate-400
                                    truncate
                                "
                            >
                                Administrator
                            </p>

                        </div>


                        {/* ARROW */}

                        <ChevronDown
                            size={15}
                            className="
                                hidden
                                sm:block

                                shrink-0

                                text-slate-400
                            "
                        />

                    </button>

                    {profileOpen && (
                        <div
                            className="
            absolute
            right-0
            top-[52px]
            z-[100]
            w-56
            rounded-md
            border
            border-slate-200
            bg-white
            shadow-xl
            overflow-hidden
        "
                        >
                            {/* Profile */}
                            <button
                                type="button"
                                onClick={() => {
                                    setProfileOpen(false);
                                    navigate("/admin/profile");
                                }}
                                className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-left
                hover:bg-indigo-50
                transition
            "
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                    <User size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-700">
                                        Profile
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        View your profile
                                    </p>
                                </div>
                            </button>

                            {/* Divider */}
                            <div className="mx-4 border-t border-slate-100" />

                            {/* Logout */}
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
                text-left
                hover:bg-red-50
                transition
            "
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
                                    <LogOut size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-red-600">
                                        Logout
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Sign out of account
                                    </p>
                                </div>
                            </button>
                        </div>
                    )}




                </div>

            </div>

            {/* =====================================================
    LOGOUT CONFIRMATION MODAL
===================================================== */}

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
                                <LogOut
                                    size={25}
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="px-6 pb-5 pt-4 text-center">

                            <h3 className="text-lg font-bold text-slate-900">
                                Logout
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Are you sure you want to logout from
                                your admin account?
                            </p>

                        </div>

                        {/* BUTTONS */}
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

export default AdminTopbar;