import { useEffect, useState } from "react";
import {
    X,
    UserPlus,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";

const emptyForm = {
    teacherCode: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    qualification: "",
    designation: "",
    experience: "",
    departmentId: "",
    username: "",
    password: "",
};

const TeacherFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingTeacher,
    departments = [],
    loading = false,
}) => {

    const [form, setForm] = useState(emptyForm);
    const [showPassword, setShowPassword] = useState(false);

    // =====================================================
    // LOAD FORM DATA
    // =====================================================

    useEffect(() => {

        if (editingTeacher) {

            setForm({
                teacherCode:
                    editingTeacher.teacherCode || "",

                firstName:
                    editingTeacher.firstName || "",

                lastName:
                    editingTeacher.lastName || "",

                email:
                    editingTeacher.email || "",

                mobile:
                    editingTeacher.mobile || "",

                gender:
                    editingTeacher.gender || "",

                qualification:
                    editingTeacher.qualification || "",

                designation:
                    editingTeacher.designation || "",

                experience:
                    editingTeacher.experience ?? "",

                departmentId:
                    editingTeacher.departmentId || "",

                username: "",

                // Don't show existing password
                password: "",
            });

        } else {

            setForm({
                ...emptyForm,
            });

        }

        setShowPassword(false);

    }, [editingTeacher, isOpen]);


    // =====================================================
    // DON'T RENDER WHEN CLOSED
    // =====================================================

    if (!isOpen) {
        return null;
    }


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,

            experience:
                form.experience !== ""
                    ? Number(form.experience)
                    : null,

            departmentId:
                form.departmentId
                    ? Number(form.departmentId)
                    : null,
        };

        // ==========================================
        // EDIT MODE
        // Username is optional
        // ==========================================

        if (
            editingTeacher &&
            (!payload.username ||
                payload.username.trim() === "")
        ) {
            delete payload.username;
        }

        // ==========================================
        // EDIT MODE
        // Password is optional
        // ==========================================

        if (
            editingTeacher &&
            (!payload.password ||
                payload.password.trim() === "")
        ) {
            delete payload.password;
        }

        onSubmit(payload);
    };




    // =====================================================
    // INPUT CLASS
    // =====================================================

    const inputClass = `
        w-full
        h-11
        rounded-xl
        border
        border-slate-200
        bg-white
        px-3
        text-sm
        text-slate-700
        outline-none
        transition
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-100
        disabled:bg-slate-50
        disabled:text-slate-400
    `;


    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-slate-900/40
                p-4
                backdrop-blur-sm
            "
        >

            <div
                className="
                    w-full
                    max-w-4xl
                    max-h-[92vh]
                    overflow-y-auto
                    rounded-2xl
                    bg-white
                    shadow-2xl
                "
            >

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        bg-white
                        px-6
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-indigo-50
                                text-indigo-600
                            "
                        >
                            <UserPlus size={20} />
                        </div>

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {editingTeacher
                                    ? "Edit Teacher"
                                    : "Add Teacher"}
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                {editingTeacher
                                    ? "Update teacher information"
                                    : "Create a new teacher account"}
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* =====================================================
                    FORM
                ===================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        {/* =================================================
                            TEACHER CODE
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Teacher Code
                            </label>

                            <input
                                name="teacherCode"
                                value={form.teacherCode}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="Enter teacher code"
                            />

                        </div>


                        {/* =================================================
                            FIRST NAME
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                First Name
                            </label>

                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="First name"
                            />

                        </div>


                        {/* =================================================
                            LAST NAME
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Last Name
                            </label>

                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="Last name"
                            />

                        </div>


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Email
                            </label>

                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="teacher@example.com"
                            />

                        </div>


                        {/* =================================================
                            MOBILE
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Mobile
                            </label>

                            <input
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                maxLength={10}
                                pattern="[0-9]{10}"
                                className={inputClass}
                                placeholder="10 digit mobile"
                            />

                        </div>


                        {/* =================================================
                            GENDER
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                                className={inputClass}
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


                        {/* =================================================
                            QUALIFICATION
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Qualification
                            </label>

                            <input
                                name="qualification"
                                value={form.qualification}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="e.g. M.Tech, MCA, Ph.D."
                            />

                        </div>


                        {/* =================================================
                            DESIGNATION
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Designation
                            </label>

                            <input
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="e.g. Professor"
                            />

                        </div>


                        {/* =================================================
                            EXPERIENCE
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Experience
                            </label>

                            <input
                                name="experience"
                                type="number"
                                min="0"
                                value={form.experience}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Years of experience"
                            />

                        </div>


                        {/* =================================================
                            DEPARTMENT
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Department
                            </label>

                            <select
                                name="departmentId"
                                value={form.departmentId}
                                onChange={handleChange}
                                required
                                disabled={
                                    loading ||
                                    departments.length === 0
                                }
                                className={inputClass}
                            >

                                <option value="">
                                    {departments.length === 0
                                        ? "No departments available"
                                        : "Select department"}
                                </option>

                                {departments.map(
                                    (department) => (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name ||
                                                department.departmentName}
                                        </option>
                                    )
                                )}

                            </select>

                            {departments.length === 0 && (
                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-red-500
                                    "
                                >
                                    No departments found.
                                    Please create a department first.
                                </p>
                            )}

                        </div>


                        {/* =================================================
                            USERNAME
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder={
                                    editingTeacher
                                        ? "Leave blank to keep existing username"
                                        : "Enter username"
                                }
                                className={inputClass}
                            />

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={form.password}
                                    onChange={handleChange}
                                    required={!editingTeacher}
                                    minLength={8}
                                    className={`${inputClass} pr-11`}
                                    placeholder={
                                        editingTeacher
                                            ? "Leave blank to keep current"
                                            : "Minimum 8 characters"
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                        hover:text-slate-600
                                    "
                                >

                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                            {!editingTeacher && (
                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Password must contain at least
                                    8 characters.
                                </p>
                            )}

                        </div>

                    </div>


                    {/* =====================================================
                        FOOTER
                    ===================================================== */}

                    <div
                        className="
                            mt-7
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-slate-100
                            pt-5
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                h-11
                                rounded-xl
                                border
                                border-slate-200
                                px-5
                                text-sm
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex
                                h-11
                                items-center
                                gap-2
                                rounded-xl
                                bg-indigo-600
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {editingTeacher ? (
                                <Save size={17} />
                            ) : (
                                <UserPlus size={17} />
                            )}

                            {loading
                                ? "Saving..."
                                : editingTeacher
                                    ? "Update Teacher"
                                    : "Add Teacher"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default TeacherFormModal;