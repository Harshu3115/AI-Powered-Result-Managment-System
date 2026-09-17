import { useEffect, useState } from "react";

import {
    User,
    Mail,
    Phone,
    Building2,
    GraduationCap,
    Briefcase,
    IdCard,
    Pencil,
    Save,
    X,
    ShieldCheck,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";
import { toast } from "react-toastify";

import teacherService from "../../services/teacherService";



const TeacherProfileSkeleton = ({
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
}) => {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}
            <TeacherSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
            />

            {/* MAIN AREA */}
            <div
                className={`
                    min-h-screen
                    w-full
                    transition-all
                    duration-300
                    ${sidebarCollapsed
                        ? "lg:pl-20"
                        : "lg:pl-72"
                    }
                `}
            >

                {/* TOPBAR */}
                <TeacherTopbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    onSidebarToggle={() =>
                        setSidebarCollapsed(
                            (prev) => !prev
                        )
                    }
                    sidebarCollapsed={sidebarCollapsed}
                    dashboardData={null}
                    title="Teacher Profile"
                />

                {/* CONTENT */}
                <main className="w-full px-6 pt-[96px] pb-7 sm:px-8 lg:px-10">

                    <div className="animate-pulse">

                        {/* =================================================
                            TOP LARGE CARD
                        ================================================= */}

                        <div
                            className="
                                h-44
                                w-full
                                rounded-3xl
                                bg-slate-200
                            "
                        />


                        {/* =================================================
                            THREE CARDS
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                grid
                                grid-cols-1
                                gap-6
                                md:grid-cols-3
                            "
                        >

                            <div
                                className="
                                    h-44
                                    rounded-3xl
                                    bg-slate-200
                                "
                            />

                            <div
                                className="
                                    h-44
                                    rounded-3xl
                                    bg-slate-200
                                "
                            />

                            <div
                                className="
                                    h-44
                                    rounded-3xl
                                    bg-slate-200
                                "
                            />

                        </div>


                        {/* =================================================
                            BOTTOM LARGE CARD
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                h-[420px]
                                w-full
                                rounded-3xl
                                bg-slate-200
                            "
                        />

                    </div>

                </main>

            </div>

        </div>
    );
};

const TeacherProfile = () => {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [editing, setEditing] = useState(false);

    const [error, setError] = useState("");

    const [profileImage, setProfileImage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [dashboard, setDashboard] = useState(null);

    // SAME SIDEBAR STATE AS TEACHER DASHBOARD
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);


    const fetchDashboard = async (showToast = false) => {

        try {

            setError("");

            if (showToast) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await teacherService.getDashboard();

            console.log("Teacher Dashboard Response:", response);

            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "Failed to load teacher dashboard"
                );
            }

            setDashboard(response.data);

            if (showToast) {
                toast.success("Dashboard refreshed");
            }

        } catch (err) {

            console.error("Teacher Dashboard Error:", err);

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load dashboard";

            setError(message);

            toast.error(message);

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {
        fetchDashboard();
    }, []);




    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (
            image.startsWith("blob:") ||
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `http://localhost:8080${image}`;
    };


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        username: "",
        experience: "",
        department: "",
        qualification: "",
        designation: "",
    });


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const loadProfile = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await teacherService.getProfile();

            console.log(
                "Teacher Profile Response:",
                response
            );

            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "Failed to load teacher profile"
                );

            }

            const data = response?.data;

            setProfileImage(data?.profileImage || "");
            setImagePreview(data?.profileImage || "");

            setProfile(data);

            setFormData({

                firstName:
                    data?.firstName || "",

                lastName:
                    data?.lastName || "",

                email:
                    data?.email || "",

                mobile:
                    data?.mobile || "",

                username:
                    data?.username || "",

                experience:
                    data?.experience || "",

                department:
                    data?.departmentName || "",

                qualification:
                    data?.qualification || "",

                designation:
                    data?.designation || "",

            });


        } catch (error) {

            console.error(
                "Teacher Profile Error:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load teacher profile";

            setError(message);

            toast.error(message);

        } finally {

            setLoading(false);

        }

    };




    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadProfile();

    }, []);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({

            ...previous,

            [name]: value,

        }));

    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            return;
        }

        // Validate size - 5 MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5 MB.");
            return;
        }

        setSelectedImage(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSave = async () => {
        try {
            setSaving(true);

            console.log("Updating teacher profile...");

            const response = await teacherService.updateProfile(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.mobile,
                formData.department,
                formData.qualification,
                formData.designation,
                formData.experience,
                selectedImage
            );

            console.log(
                "Update Profile Response:",
                response
            );

            // ==========================================
            // SUCCESS
            // ==========================================

            if (response?.success === true) {

                toast.success(
                    response.message ||
                    "Teacher profile updated successfully."
                );

                // Update local profile immediately
                if (response.data) {
                    setProfile(response.data);
                }

                // Exit edit mode
                setEditing(false);

                // Clear selected image
                setSelectedImage(null);

                return;
            }

            // ==========================================
            // BACKEND FAILURE
            // ==========================================

            toast.error(
                response?.message ||
                "Failed to update profile."
            );

        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {
            setSaving(false);
        }
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancel = () => {
        setFormData({
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            email: profile?.email || "",
            mobile: profile?.mobile || "",
            username: profile?.username || "",
            employeeId: profile?.employeeId || "",
            department: profile?.department || "",
            qualification: profile?.qualification || "",
            designation: profile?.designation || "",
        });

        // Remove unsaved image selection
        setSelectedImage(null);

        // Restore previously saved image
        setImagePreview(profile?.profileImage || "");
        setProfileImage(profile?.profileImage || "");

        setEditing(false);
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <TeacherProfileSkeleton
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && !profile) {

        return (
            <TeacherProfileSkeleton
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
        );

    }


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
                MAIN AREA
            ================================================= */}

            <div
                className={`
                    min-h-screen
                    w-full
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

                {/* TOPBAR */}
                <TeacherTopbar
                    onMenuClick={() => setSidebarOpen(true)}
                    onSidebarToggle={() =>
                        setSidebarCollapsed((prev) => !prev)
                    }
                    sidebarCollapsed={sidebarCollapsed}
                    dashboardData={dashboard}
                    title="Teacher Dashboard"
                />


                {/* =================================================
                    MAIN CONTAINER
                ================================================= */}

                <main className="w-full px-6 pt-[96px] pb-7 sm:px-8 lg:px-10">

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <section className="mb-8">

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div>

                                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">

                                    Teacher Portal

                                </p>

                                <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">

                                    My Profile

                                </h1>

                                <p className="mt-3 text-sm text-slate-500">

                                    Manage your personal and professional information.

                                </p>

                            </div>


                            {/* ACTIONS */}

                            <div className="flex items-center gap-3">

                                {!editing ? (

                                    <button
                                        onClick={() =>
                                            setEditing(true)
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                    >

                                        <Pencil size={17} />

                                        Edit Profile

                                    </button>

                                ) : (

                                    <>

                                        <button
                                            onClick={
                                                handleCancel
                                            }
                                            disabled={
                                                saving
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
                                        >

                                            <X size={17} />

                                            Cancel

                                        </button>


                                        <button
                                            onClick={
                                                handleSave
                                            }
                                            disabled={
                                                saving
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            <Save size={17} />

                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}

                                        </button>

                                    </>

                                )}

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        PROFILE HEADER
                    ================================================= */}

                    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* COVER */}

                        <div className="h-36 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600" />


                        <div className="px-6 pb-6 sm:px-8">

                            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">

                                {/* AVATAR */}

                                <div className="relative h-24 w-24 shrink-0">

                                    <div className="h-24 w-24 rounded-2xl bg-white p-1.5 shadow-lg">

                                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-indigo-100">

                                            {imagePreview ? (
                                                <img
                                                    src={getImageUrl(imagePreview)}
                                                    alt="Teacher Profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-3xl font-bold text-indigo-600">
                                                    {(
                                                        formData.firstName?.[0] || "T"
                                                    ).toUpperCase()}

                                                    {(
                                                        formData.lastName?.[0] || ""
                                                    ).toUpperCase()}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    {editing && (
                                        <>
                                            <input
                                                type="file"
                                                id="profileImage"
                                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />

                                            <label
                                                htmlFor="profileImage"
                                                className="
                    absolute
                    -bottom-2
                    -right-2
                    flex
                    h-9
                    w-9
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    border-4
                    border-white
                    bg-indigo-600
                    text-white
                    shadow-md
                    transition
                    hover:bg-indigo-700
                "
                                                title="Change profile picture"
                                            >
                                                <Pencil size={15} />
                                            </label>
                                        </>
                                    )}

                                </div>


                                {/* NAME */}

                                <div className="min-w-0 flex-1 pb-1">

                                    <h2 className="text-xl font-bold text-slate-900">

                                        {formData.firstName ||
                                            "Teacher"}{" "}

                                        {formData.lastName}

                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">

                                        {formData.designation ||
                                            "Teacher"}

                                        {formData.department &&
                                            ` • ${formData.department}`}

                                    </p>

                                </div>


                                {/* ROLE */}

                                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">

                                    <ShieldCheck size={17} />

                                    Teacher

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        PERSONAL INFORMATION
                    ================================================= */}

                    <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-5">

                            <h2 className="text-lg font-bold text-slate-900">

                                Personal Information

                            </h2>

                            <p className="mt-1 text-sm text-slate-500">

                                Your basic personal and account information.

                            </p>

                        </div>


                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                            <ProfileField
                                icon={<User size={18} />}
                                label="First Name"
                                name="firstName"
                                value={
                                    formData.firstName
                                }
                                editing={editing}
                                onChange={
                                    handleChange
                                }
                            />


                            <ProfileField
                                icon={<User size={18} />}
                                label="Last Name"
                                name="lastName"
                                value={
                                    formData.lastName
                                }
                                editing={editing}
                                onChange={
                                    handleChange
                                }
                            />


                            <ProfileField
                                icon={<Mail size={18} />}
                                label="Email Address"
                                name="email"
                                type="email"
                                value={
                                    formData.email
                                }
                                editing={editing}
                                onChange={
                                    handleChange
                                }
                            />


                            <ProfileField
                                icon={<Phone size={18} />}
                                label="Mobile Number"
                                name="mobile"
                                value={
                                    formData.mobile
                                }
                                editing={editing}
                                onChange={
                                    handleChange
                                }
                            />


                            <ProfileField
                                icon={<User size={18} />}
                                label="Username"
                                name="username"
                                value={
                                    formData.username
                                }
                                editing={false}
                                onChange={
                                    handleChange
                                }
                            />


                            <ProfileField
                                icon={<Briefcase size={18} />}
                                label="Experience (Years)"
                                name="experience"
                                type="number"
                                value={formData.experience}
                                editing={editing}
                                onChange={handleChange}
                            />

                        </div>

                    </section>


                    {/* =================================================
                        PROFESSIONAL INFORMATION
                    ================================================= */}

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-5">

                            <h2 className="text-lg font-bold text-slate-900">

                                Professional Information

                            </h2>

                            <p className="mt-1 text-sm text-slate-500">

                                Your academic and professional details.

                            </p>

                        </div>


                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                            <ProfileField
                                icon={<Building2 size={18} />}
                                label="Department"
                                name="department"
                                value={formData.department}
                                editing={editing}
                                onChange={handleChange}
                            />


                            <ProfileField
                                icon={<Briefcase size={18} />}
                                label="Designation"
                                name="designation"
                                value={
                                    formData.designation
                                }
                                editing={editing}
                                onChange={
                                    handleChange
                                }
                            />


                            <ProfileField
                                icon={<GraduationCap size={18} />}
                                label="Qualification"
                                name="qualification"
                                value={
                                    formData.qualification
                                }
                                editing={editing}
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

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

                </main>

            </div>




        </div>

    );

};


// =============================================================
// PROFILE FIELD
// =============================================================

const ProfileField = ({
    icon,
    label,
    name,
    value,
    editing,
    onChange,
    type = "text",
}) => {

    return (

        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">

                {label}

            </label>

            <div className="relative">

                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">

                    {icon}

                </div>


                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    disabled={!editing}
                    className={`
                        w-full rounded-xl border
                        py-3 pl-10 pr-4
                        text-sm outline-none
                        transition

                        ${editing
                            ? "border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
                        }
                    `}
                />

            </div>

        </div>

    );

};


export default TeacherProfile;