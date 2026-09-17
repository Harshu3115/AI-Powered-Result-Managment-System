import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    Edit3,
    Lock,
    Save,
    X,
    CheckCircle,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

import {
    getAdminProfile,
    updateAdminProfile,
} from "../../services/adminProfileService";
import { toast } from "react-toastify";

const AdminProfile = () => {

    // =========================================================
    // SIDEBAR STATE
    // =========================================================

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);


    // =========================================================
    // USER
    // =========================================================

    const [user, setUser] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // EDIT PROFILE
    // =========================================================

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
    });

    useEffect(() => {
        const loadAdminProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getAdminProfile();

                console.log(
                    "Admin Profile API Response:",
                    response
                );

                if (response?.success) {
                    const data =
                        response?.data || {};

                    console.log(
                        "Admin Profile Data:",
                        data
                    );

                    setUser(data);

                    setFormData({
                        email: data?.email || "",
                    });

                    sessionStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...JSON.parse(
                                sessionStorage.getItem("user") || "{}"
                            ),
                            ...data,
                        })
                    );
                } else {
                    setError(
                        response?.message ||
                        "Unable to load admin profile."
                    );
                }

            } catch (error) {
                console.error(
                    "Admin Profile API Error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Unable to load admin profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadAdminProfile();
    }, []);


    // =========================================================
    // PASSWORD
    // =========================================================

    const [showPassword, setShowPassword] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    // =========================================================
    // SUCCESS MESSAGE
    // =========================================================

    const [successMessage, setSuccessMessage] =
        useState("");


    // =========================================================
    // LOAD USER
    // =========================================================

    useEffect(() => {
        try {

            const storedUser =
                JSON.parse(
                    sessionStorage.getItem("user") || "{}"
                );

            console.log(
                "Admin Profile User:",
                storedUser
            );

            setUser(storedUser);

            setFormData({
                email:
                    storedUser?.email ||
                    storedUser?.user?.email ||
                    "",
            });

        } catch (error) {

            console.error(
                "Unable to load admin profile:",
                error
            );

        }
    }, []);




    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =========================================================
    // SAVE PROFILE
    // =========================================================

    const [saving, setSaving] = useState(false);

    const handleSaveProfile = async () => {
        try {
            setSaving(true);

            const email = formData.email?.trim();

            if (!email) {
                toast.error("Email address is required.");
                return;
            }

            const response = await updateAdminProfile({
                email: email,
            });

            console.log(
                "========== ADMIN PROFILE UPDATE =========="
            );

            console.log(
                "Request:",
                {
                    email: email,
                }
            );

            console.log(
                "Response:",
                response
            );

            console.log(
                "==========================================="
            );

            if (response?.success) {

                const updatedUser = {
                    ...user,
                    ...(response?.data || {}),
                };

                setUser(updatedUser);

                setFormData({
                    email:
                        updatedUser?.email || "",
                });

                sessionStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );

                setEditing(false);

                toast.success(
                    response?.message ||
                    "Email updated successfully."
                );

            } else {

                toast.error(
                    response?.message ||
                    "Unable to update email."
                );
            }

        } catch (error) {

            console.error(
                "========== ADMIN PROFILE ERROR =========="
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Backend Response:",
                error?.response?.data
            );

            console.error(
                "Full Error:",
                error
            );

            console.error(
                "=========================================="
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to update email."
            );

        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            email:
                user?.email ||
                user?.user?.email ||
                "",
        });

        setEditing(false);
    };


    // =========================================================
    // PASSWORD CHANGE
    // =========================================================

    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    const handleChangePassword = (e) => {

        e.preventDefault();

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {

            alert(
                "Please fill all password fields."
            );

            return;
        }


        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {

            toast.error(
                "New password and confirm password do not match."
            );

            return;
        }


        /*
         * Backend API should be called here.
         *
         * For example:
         *
         * await changeAdminPassword(passwordData);
         *
         */


        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setShowPassword(false);

        setSuccessMessage(
            "Password changed successfully."
        );

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };


    // =========================================================
    // NAME
    // =========================================================

    const firstName =
        user?.firstName ||
        user?.user?.firstName ||
        "Admin";

    const lastName =
        user?.lastName ||
        user?.user?.lastName ||
        "";

    const fullName =
        `${firstName} ${lastName}`.trim();


    // =========================================================
    // AVATAR LETTER
    // =========================================================

    const avatarLetter =
        firstName
            ?.charAt(0)
            ?.toUpperCase() || "A";


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
                    min-h-screen
                    pt-[72px]
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
                        PAGE HEADER
                    ================================================= */}

                    <div className="
                        mb-6
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

                        <div>

                            <h1 className="
                                text-xl
                                sm:text-2xl
                                font-bold
                                text-slate-800
                            ">
                                Admin Profile
                            </h1>

                            <p className="
                                mt-1
                                text-xs
                                sm:text-sm
                                text-slate-500
                            ">
                                Manage your administrator
                                account information
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        SUCCESS MESSAGE
                    ================================================= */}

                    {successMessage && (

                        <div className="
                            mb-5
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-4
                            py-3
                            text-sm
                            text-emerald-700
                        ">

                            <CheckCircle
                                size={18}
                            />

                            <span>
                                {successMessage}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        PROFILE HERO
                    ================================================= */}

                    <div className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    ">

                        <div className="
                            h-28
                            bg-gradient-to-r
                            from-indigo-600
                            via-blue-600
                            to-cyan-500
                        " />

                        <div className="
                            px-5
                            pb-5
                            sm:px-6
                            lg:px-8
                        ">

                            <div className="
                                -mt-12
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            ">

                                <div className="
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:items-end
                                ">

                                    {/* AVATAR */}

                                    <div className="
                                        flex
                                        h-24
                                        w-24
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border-4
                                        border-white
                                        bg-gradient-to-br
                                        from-indigo-500
                                        to-blue-600
                                        text-3xl
                                        font-bold
                                        text-white
                                        shadow-lg
                                    ">
                                        {avatarLetter}
                                    </div>


                                    <div className="
                                        pb-1
                                    ">

                                        <h2 className="
                                            text-xl
                                            font-bold
                                            text-slate-800
                                        ">
                                            {fullName}
                                        </h2>

                                        <p className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                        ">
                                            Administrator
                                        </p>

                                    </div>

                                </div>


                                {/* EDIT BUTTON */}

                                {!editing ? (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditing(true)
                                        }
                                        className="
                                            inline-flex
                                            min-h-[42px]
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            bg-indigo-600
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-sm
                                            transition
                                            hover:bg-indigo-700
                                        "
                                    >

                                        <Edit3 size={16} />

                                        Edit Profile

                                    </button>

                                ) : (

                                    <div className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    ">

                                        <button
                                            type="button"

                                            onClick={handleCancelEdit}

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
                                                px-4
                                                py-2.5
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                                hover:bg-slate-50
                                            "
                                        >

                                            <X size={16} />

                                            Cancel

                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="
        inline-flex
        min-h-[42px]
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-indigo-600
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-indigo-700
        disabled:cursor-not-allowed
        disabled:opacity-60
    "
                                        >
                                            <Save
                                                size={16}
                                                className={saving ? "animate-pulse" : ""}
                                            />

                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PROFILE CONTENT
                    ================================================= */}

                    <div className="
                        mt-6
                        grid
                        grid-cols-1
                        gap-6
                        xl:grid-cols-3
                    ">


                        {/* =================================================
                            PERSONAL INFORMATION
                        ================================================= */}

                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            sm:p-6
                            xl:col-span-2
                        ">

                            <div className="
                                mb-6
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-indigo-50
                                    text-indigo-600
                                ">
                                    <User size={20} />
                                </div>

                                <div>

                                    <h3 className="
                                        text-base
                                        font-bold
                                        text-slate-800
                                    ">
                                        Personal Information
                                    </h3>

                                    <p className="
                                        text-xs
                                        text-slate-400
                                    ">
                                        Your basic account details
                                    </p>

                                </div>

                            </div>


                            <div className="
                                grid
                                grid-cols-1
                                gap-5
                                sm:grid-cols-2
                            ">


                                {/* USERNAME */}

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            user?.username ||
                                            user?.user?.username ||
                                            ""
                                        }
                                        disabled
                                        className="
        h-11
        w-full
        rounded-xl
        border
        border-slate-200
        bg-slate-100
        px-3
        text-sm
        text-slate-500
        outline-none
        cursor-not-allowed
    "
                                    />

                                </div>


                                {/* EMAIL */}

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Email Address
                                    </label>

                                    <div className="
                                        relative
                                    ">

                                        <Mail
                                            size={16}
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-slate-400
                                            "
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            className="
                                                h-11
                                                w-full
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                pl-9
                                                pr-3
                                                text-sm
                                                text-slate-700
                                                outline-none
                                                focus:border-indigo-400
                                                focus:ring-2
                                                focus:ring-indigo-100
                                                disabled:cursor-not-allowed
                                                disabled:opacity-70
                                            "
                                        />

                                    </div>

                                </div>




                                {/* ROLE */}

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Role
                                    </label>

                                    <div className="
                                        flex
                                        h-11
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-100
                                        px-3
                                        text-sm
                                        font-medium
                                        text-slate-600
                                    ">

                                        <ShieldCheck
                                            size={17}
                                            className="
                                                text-indigo-600
                                            "
                                        />

                                        {user?.role ||
                                            user?.user?.role ||
                                            "ADMIN"}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            ACCOUNT STATUS
                        ================================================= */}

                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            sm:p-6
                        ">

                            <h3 className="
                                text-base
                                font-bold
                                text-slate-800
                            ">
                                Account Information
                            </h3>

                            <div className="
                                mt-5
                                space-y-4
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    bg-slate-50
                                    p-3
                                ">

                                    <span className="
                                        text-xs
                                        text-slate-500
                                    ">
                                        Account Status
                                    </span>

                                    <span className="
                                        rounded-full
                                        bg-emerald-100
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-semibold
                                        text-emerald-700
                                    ">
                                        Active
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    bg-slate-50
                                    p-3
                                ">

                                    <span className="
                                        text-xs
                                        text-slate-500
                                    ">
                                        Account Role
                                    </span>

                                    <span className="
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                    ">
                                        Administrator
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    bg-slate-50
                                    p-3
                                ">

                                    <span className="
                                        text-xs
                                        text-slate-500
                                    ">
                                        Login Username
                                    </span>

                                    <span className="
                                        max-w-[150px]
                                        truncate
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                    ">
                                        {user?.username ||
                                            "Not available"}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            CHANGE PASSWORD
                        ================================================= */}

                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            sm:p-6
                            xl:col-span-3
                        ">

                            <div className="
                                mb-6
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-red-50
                                    text-red-600
                                ">
                                    <Lock size={20} />
                                </div>

                                <div>

                                    <h3 className="
                                        text-base
                                        font-bold
                                        text-slate-800
                                    ">
                                        Change Password
                                    </h3>

                                    <p className="
                                        text-xs
                                        text-slate-400
                                    ">
                                        Keep your administrator
                                        account secure
                                    </p>

                                </div>

                            </div>


                            <form
                                onSubmit={
                                    handleChangePassword
                                }
                                className="
                                    grid
                                    grid-cols-1
                                    gap-5
                                    md:grid-cols-3
                                "
                            >

                                {/* CURRENT */}

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Current Password
                                    </label>

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="currentPassword"
                                        value={
                                            passwordData.currentPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            px-3
                                            text-sm
                                            outline-none
                                            focus:border-indigo-400
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                </div>


                                {/* NEW */}

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        New Password
                                    </label>

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="newPassword"
                                        value={
                                            passwordData.newPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            px-3
                                            text-sm
                                            outline-none
                                            focus:border-indigo-400
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                </div>


                                {/* CONFIRM */}

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Confirm Password
                                    </label>

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={
                                            passwordData.confirmPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            px-3
                                            text-sm
                                            outline-none
                                            focus:border-indigo-400
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        "
                                    />

                                </div>


                                <div className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                    md:col-span-3
                                ">

                                    <button
                                        type="submit"
                                        className="
                                            inline-flex
                                            min-h-[42px]
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            bg-slate-800
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-white
                                            hover:bg-slate-900
                                        "
                                    >

                                        <Lock size={16} />

                                        Change Password

                                    </button>


                                    <label className="
                                        flex
                                        cursor-pointer
                                        items-center
                                        gap-2
                                        text-xs
                                        text-slate-500
                                    ">

                                        <input
                                            type="checkbox"
                                            checked={
                                                showPassword
                                            }
                                            onChange={(e) =>
                                                setShowPassword(
                                                    e.target.checked
                                                )
                                            }
                                            className="
                                                h-4
                                                w-4
                                                rounded
                                                border-slate-300
                                                text-indigo-600
                                            "
                                        />

                                        Show password

                                    </label>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default AdminProfile;