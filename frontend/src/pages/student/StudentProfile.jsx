import React, { useEffect, useState } from "react";

import {
    User,
    Mail,
    Phone,
    CalendarDays,
    GraduationCap,
    Hash,
    BookOpen,
    Building2,
    IdCard,
    Loader2,
    RefreshCcw,
    AlertCircle,
    CheckCircle2,
    UserRound,
    Pencil,
    Save,
    X,
    Lock,
} from "lucide-react";

import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";
import studentService from "../../services/studentService";


// =========================================================
// HELPERS
// =========================================================

const formatDate = (date) => {

    if (!date) {
        return "—";
    }

    try {

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    } catch {

        return date;
    }
};


const getInitials = (firstName, lastName) => {

    const first =
        firstName?.charAt(0)?.toUpperCase() || "";

    const last =
        lastName?.charAt(0)?.toUpperCase() || "";

    return `${first}${last}` || "ST";
};


// =========================================================
// INFO ITEM
// =========================================================

const InfoItem = ({
    icon: Icon,
    label,
    value,
}) => {

    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

            <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">

                    <Icon className="h-4 w-4" />

                </div>

                <div className="min-w-0">

                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">

                        {label}

                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-700">

                        {value || "—"}

                    </p>

                </div>

            </div>

        </div>
    );
};


// =========================================================
// SECTION
// =========================================================

const ProfileSection = ({
    icon: Icon,
    title,
    description,
    children,
}) => {

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                        <Icon className="h-5 w-5" />

                    </div>

                    <div>

                        <h2 className="text-base font-bold text-slate-800 sm:text-lg">

                            {title}

                        </h2>

                        {description && (

                            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">

                                {description}

                            </p>

                        )}

                    </div>

                </div>

            </div>


            {/* CONTENT */}

            <div className="p-5 sm:p-6">

                {children}

            </div>

        </section>
    );
};


// =========================================================
// STUDENT PROFILE
// =========================================================

const StudentProfile = () => {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const [editMode, setEditMode] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        gender: "",
        dateOfBirth: "",
    });;


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const loadProfile = async () => {

        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const response =
                await studentService.getProfile();


            console.log(
                "Student Profile API:",
                response
            );


            if (response?.success) {

                setProfile(
                    response.data
                );

            } else {

                setProfile(
                    response?.data || null
                );
            }


        } catch (err) {

            console.error(
                "Student Profile Error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                "Unable to load student profile."
            );

        } finally {

            setLoading(false);
        }
    };

    const handleEdit = () => {

        setFormData({
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            email: profile?.email || "",
            mobile: profile?.mobile || "",
            gender: profile?.gender || "",
            dateOfBirth: profile?.dateOfBirth || "",
        });

        setError("");
        setSuccess("");
        setEditMode(true);
    };


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSave = async () => {

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const response =
                await studentService.updateProfile(formData);

            console.log(
                "Update Profile API:",
                response
            );

            if (response?.success) {

                setProfile(response.data);

                setEditMode(false);

                setSuccess(
                    response.message ||
                    "Profile updated successfully."
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to update profile."
                );
            }

        } catch (err) {

            console.error(
                "Update Profile Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to update profile."
            );

        } finally {

            setSaving(false);
        }
    };


    const handleCancelEdit = () => {

        setEditMode(false);

        setError("");
        setSuccess("");

        setFormData({
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            mobile: profile?.mobile || "",
            gender: profile?.gender || "",
            dateOfBirth: profile?.dateOfBirth || "",
        });
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadProfile();

    }, []);


    // =====================================================
    // FULL NAME
    // =====================================================

    const studentName =
        profile?.studentName ||
        [
            profile?.firstName,
            profile?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "Student";


    // =====================================================
    // TOPBAR DATA
    // =====================================================

    const topbarData = {

        ...profile,

        studentName,

        courseName:
            profile?.courseName ||
            profile?.course?.courseName ||
            "Student",
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="flex min-h-screen bg-slate-50">


                {/* SIDEBAR */}

                <StudentSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                />


                {/* RIGHT SIDE */}

                <div className="flex min-w-0 flex-1 flex-col">


                    {/* TOPBAR */}

                    <StudentTopbar
                        onMenuClick={() =>
                            setSidebarOpen(true)
                        }
                        dashboardData={topbarData}

                    />


                    {/* LOADING */}

                    <main className="flex flex-1 items-center justify-center">

                        <div className="flex items-center gap-3 text-sm text-slate-500">

                            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />

                            Loading profile...

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="flex min-h-screen bg-slate-50">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <StudentSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex min-w-0 flex-1 flex-col">


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <StudentTopbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                    dashboardData={topbarData}

                />


                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="flex-1 p-4 sm:p-6">

                    <div className="mx-auto max-w-7xl space-y-6">


                        {/* =================================================
                            PAGE HEADER
                        ================================================= */}

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">

                                    My Profile

                                </h1>

                                <p className="mt-1 text-sm text-slate-500">

                                    View your personal and academic information.

                                </p>

                            </div>


                            <div className="flex flex-wrap gap-2">

                                {!editMode ? (

                                    <>
                                        <button
                                            type="button"
                                            onClick={loadProfile}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                                        >

                                            <RefreshCcw className="h-4 w-4" />

                                            Refresh

                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleEdit}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                        >

                                            <Pencil className="h-4 w-4" />

                                            Edit Profile

                                        </button>
                                    </>

                                ) : (

                                    <>

                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            disabled={saving}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                        >

                                            <X className="h-4 w-4" />

                                            Cancel

                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {saving ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}

                                        </button>

                                    </>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            ALERTS
                        ================================================= */}

                        {error && (

                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                                <span>

                                    {error}

                                </span>

                            </div>

                        )}


                        {success && (

                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                                <span>

                                    {success}

                                </span>

                            </div>

                        )}


                        {/* =================================================
                            PROFILE HEADER CARD
                        ================================================= */}

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                            {/* COVER */}

                            <div className="h-28 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 sm:h-36" />


                            {/* PROFILE INFO */}

                            <div className="px-5 pb-6 sm:px-7">


                                <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">

                                    {/* AVATAR */}

                                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-extrabold text-indigo-600 shadow-lg sm:h-28 sm:w-28">

                                        {getInitials(
                                            profile?.firstName,
                                            profile?.lastName
                                        )}

                                    </div>


                                    {/* NAME */}

                                    <div className="min-w-0 flex-1 pb-1">

                                        <h2 className="text-xl font-bold text-white sm:text-2xl">

                                            {studentName}

                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">

                                            {profile?.courseName ||
                                                profile?.course?.courseName ||
                                                "Course not available"}

                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">

                                            {profile?.rollNo && (

                                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">

                                                    Roll No: {profile.rollNo}

                                                </span>

                                            )}

                                            {profile?.semesterName && (

                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">

                                                    {profile.semesterName}

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            PERSONAL INFORMATION
                        ================================================= */}

                        <ProfileSection
                            icon={UserRound}
                            title="Personal Information"
                            description="Your basic personal and contact details."
                        >

                            {editMode ? (

                                <div className="grid gap-5 sm:grid-cols-2">


                                    {/* FIRST NAME */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            First Name
                                        </label>

                                        <div className="relative">

                                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                                placeholder="Enter first name"
                                            />

                                        </div>

                                    </div>


                                    {/* LAST NAME */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Last Name
                                        </label>

                                        <div className="relative">

                                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                                placeholder="Enter last name"
                                            />

                                        </div>

                                    </div>


                                    {/* EMAIL */}

                                    <div>



                                        <div className="relative">

                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <div>

                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Email
                                                </label>

                                                <div className="relative">

                                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                                        placeholder="Enter email address"
                                                    />

                                                </div>

                                            </div>

                                            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                        </div>

                                        <p className="mt-1.5 text-[11px] text-slate-400">
                                            Email cannot be changed from this page.
                                        </p>

                                    </div>


                                    {/* MOBILE */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Mobile Number
                                        </label>

                                        <div className="relative">

                                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                maxLength={10}
                                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                                placeholder="10 digit mobile number"
                                            />

                                        </div>

                                    </div>


                                    {/* GENDER */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Gender
                                        </label>

                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                        >

                                            <option value="">
                                                Select gender
                                            </option>

                                            <option value="MALE">
                                                Male
                                            </option>

                                            <option value="FEMALE">
                                                Female
                                            </option>

                                            <option value="OTHER">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    {/* DATE OF BIRTH */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Date of Birth
                                        </label>

                                        <div className="relative">

                                            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth || ""}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                            />

                                        </div>

                                    </div>

                                </div>

                            ) : (

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                    <InfoItem
                                        icon={User}
                                        label="First Name"
                                        value={profile?.firstName}
                                    />

                                    <InfoItem
                                        icon={User}
                                        label="Last Name"
                                        value={profile?.lastName}
                                    />

                                    <InfoItem
                                        icon={Mail}
                                        label="Email"
                                        value={profile?.email}
                                    />

                                    <InfoItem
                                        icon={Phone}
                                        label="Mobile"
                                        value={profile?.mobile}
                                    />

                                    <InfoItem
                                        icon={UserRound}
                                        label="Gender"
                                        value={profile?.gender}
                                    />

                                    <InfoItem
                                        icon={CalendarDays}
                                        label="Date of Birth"
                                        value={formatDate(
                                            profile?.dateOfBirth
                                        )}
                                    />

                                </div>

                            )}

                        </ProfileSection>


                        {/* =================================================
                            ACADEMIC INFORMATION
                        ================================================= */}

                        <ProfileSection
                            icon={GraduationCap}
                            title="Academic Information"
                            description="Your university and academic details."
                        >

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                <InfoItem
                                    icon={Hash}
                                    label="Roll Number"
                                    value={profile?.rollNo}
                                />

                                <InfoItem
                                    icon={IdCard}
                                    label="Enrollment Number"
                                    value={profile?.enrollmentNo}
                                />

                                <InfoItem
                                    icon={Hash}
                                    label="PRN Number"
                                    value={profile?.prnNo}
                                />

                                <InfoItem
                                    icon={Building2}
                                    label="Department"
                                    value={
                                        profile?.departmentName ||
                                        profile?.department?.departmentName
                                    }
                                />

                                <InfoItem
                                    icon={BookOpen}
                                    label="Course"
                                    value={
                                        profile?.courseName ||
                                        profile?.course?.courseName
                                    }
                                />

                                <InfoItem
                                    icon={GraduationCap}
                                    label="Semester"
                                    value={
                                        profile?.semesterName ||
                                        profile?.semester?.semesterName
                                    }
                                />

                                <InfoItem
                                    icon={CalendarDays}
                                    label="Admission Year"
                                    value={
                                        profile?.admissionYear
                                    }
                                />

                            </div>

                        </ProfileSection>


                        {/* =================================================
                            ACCOUNT INFORMATION
                        ================================================= */}

                        <ProfileSection
                            icon={IdCard}
                            title="Account Information"
                            description="Your SRMS account details."
                        >

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                <InfoItem
                                    icon={IdCard}
                                    label="Student ID"
                                    value={profile?.id}
                                />

                                <InfoItem
                                    icon={Mail}
                                    label="Registered Email"
                                    value={profile?.email}
                                />

                                <InfoItem
                                    icon={CheckCircle2}
                                    label="Account Status"
                                    value="Active"
                                />

                            </div>

                        </ProfileSection>


                        {/* =================================================
                            FOOTER NOTE
                        ================================================= */}

                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

                            <div className="flex items-start gap-3">

                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

                                <div>

                                    <p className="text-sm font-bold text-indigo-900">

                                        Profile Information

                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-indigo-700">

                                        If any of your personal or academic
                                        information is incorrect, please
                                        contact your college administration
                                        or SRMS support team.

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default StudentProfile;