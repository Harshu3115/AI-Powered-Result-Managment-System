import { useEffect, useState } from "react";

import {
    X,
    UserPlus,
    Save,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";

const EMPTY_FORM = {
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
    enabled: true,
};

const UserFormModal = ({
    editingUser,
    onSubmit,
    onClose,
    saving = false,
}) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // =====================================================
    // LOAD FORM
    // =====================================================

    useEffect(() => {
        if (editingUser) {
            setForm({
                username: editingUser.username ?? "",
                email: editingUser.email ?? "",
                password: "",
                role: editingUser.role ?? "STUDENT",
                enabled: editingUser.enabled ?? true,
            });
        } else {
            setForm({ ...EMPTY_FORM });
        }

        setErrors({});
        setShowPassword(false);
    }, [editingUser]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // =====================================================
    // STATUS CHANGE
    // =====================================================

    const handleStatusChange = () => {
        setForm((prev) => ({
            ...prev,
            enabled: !prev.enabled,
        }));
    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {
        const newErrors = {};

        // Username required only while adding
        if (!editingUser && !form.username.trim()) {
            newErrors.username = "Username is required.";
        }

        // Email
        if (!form.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email.trim()
            )
        ) {
            newErrors.email =
                "Enter a valid email address.";
        }

        // Password
        if (!editingUser) {
            if (!form.password.trim()) {
                newErrors.password =
                    "Password is required.";
            } else if (form.password.length < 8) {
                newErrors.password =
                    "Password must be at least 8 characters.";
            }
        } else if (
            form.password.trim() &&
            form.password.length < 8
        ) {
            newErrors.password =
                "Password must be at least 8 characters.";
        }

        // Role
        if (!form.role) {
            newErrors.role = "Role is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        /*
         * IMPORTANT:
         *
         * On UPDATE:
         * - blank username is NOT sent
         * - blank password is NOT sent
         *
         * Therefore backend keeps the existing values.
         */

        const payload = {
            email: form.email.trim(),
            role: form.role,
            enabled: form.enabled,
        };

        // Username
        if (form.username.trim()) {
            payload.username =
                form.username.trim();
        }

        // Password
        if (form.password.trim()) {
            payload.password =
                form.password;
        }

        onSubmit(payload);
    };

    // =====================================================
    // COMMON INPUT STYLE
    // =====================================================

    const inputClass = `
        w-full
        h-11
        px-3
        rounded-xl
        border
        border-slate-200
        bg-white
        text-sm
        text-slate-700
        outline-none
        transition
        focus:border-indigo-400
        focus:ring-2
        focus:ring-indigo-100
        disabled:bg-slate-100
        disabled:cursor-not-allowed
    `;

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
                backdrop-blur-sm
                p-4
            "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !saving) {
                    onClose();
                }
            }}
        >
            <div
                className="
                    w-full
                    max-w-lg
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-2xl
                    bg-white
                    shadow-2xl
                "
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                        border-slate-200
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
                                h-11
                                w-11
                                rounded-xl
                                bg-indigo-50
                                text-indigo-600
                                flex
                                items-center
                                justify-center
                            "
                        >
                            {editingUser ? (
                                <ShieldCheck size={21} />
                            ) : (
                                <UserPlus size={21} />
                            )}
                        </div>

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {editingUser
                                    ? "Edit User"
                                    : "Add User"}
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-400
                                "
                            >
                                {editingUser
                                    ? "Update user account details."
                                    : "Create a new system user."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="
                            h-9
                            w-9
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-slate-400
                            hover:bg-slate-100
                            hover:text-slate-600
                            transition
                            disabled:opacity-50
                        "
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                >
                    {/* USERNAME */}

                    <div>
                        <label
                            className="
                                block
                                mb-1.5
                                text-sm
                                font-medium
                                text-slate-600
                            "
                        >
                            Username

                            {!editingUser && (
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            )}
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            disabled={saving}
                            placeholder={
                                editingUser
                                    ? "Leave blank to keep existing username"
                                    : "Enter username"
                            }
                            className={inputClass}
                        />

                        {editingUser && (
                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Leave blank to keep the
                                existing username.
                            </p>
                        )}

                        {errors.username && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* EMAIL */}

                    <div>
                        <label
                            className="
                                block
                                mb-1.5
                                text-sm
                                font-medium
                                text-slate-600
                            "
                        >
                            Email
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={saving}
                            placeholder="Enter email address"
                            className={inputClass}
                        />

                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}

                    <div>
                        <label
                            className="
                                block
                                mb-1.5
                                text-sm
                                font-medium
                                text-slate-600
                            "
                        >
                            Password

                            {!editingUser && (
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            )}
                        </label>

                        <div className="relative">
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder={
                                    editingUser
                                        ? "Leave blank to keep existing password"
                                        : "Enter password"
                                }
                                className={`
                                    ${inputClass}
                                    pr-11
                                `}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (prev) => !prev
                                    )
                                }
                                disabled={saving}
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                    hover:text-slate-600
                                    disabled:opacity-50
                                "
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        {editingUser && (
                            <p className="mt-1.5 text-xs text-slate-400">
                                Leave blank to keep the
                                existing password.
                            </p>
                        )}

                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* ROLE */}

                    <div>
                        <label
                            className="
                                block
                                mb-1.5
                                text-sm
                                font-medium
                                text-slate-600
                            "
                        >
                            Role
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            disabled={saving}
                            className={inputClass}
                        >
                            <option value="ADMIN">
                                Admin
                            </option>

                            <option value="TEACHER">
                                Teacher
                            </option>

                            <option value="STUDENT">
                                Student
                            </option>
                        </select>

                        {errors.role && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* STATUS */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-3
                        "
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                Account Status
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Allow this user to log in.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleStatusChange}
                            disabled={saving}
                            className={`
                                relative
                                h-6
                                w-11
                                rounded-full
                                transition
                                disabled:opacity-50
                                ${form.enabled
                                    ? "bg-indigo-600"
                                    : "bg-slate-300"
                                }
                            `}
                        >
                            <span
                                className={`
                                    absolute
                                    top-1
                                    h-4
                                    w-4
                                    rounded-full
                                    bg-white
                                    shadow
                                    transition
                                    ${form.enabled
                                        ? "left-6"
                                        : "left-1"
                                    }
                                `}
                            />
                        </button>
                    </div>

                    {/* BUTTONS */}

                    <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-3
                            pt-2
                            border-t
                            border-slate-100
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                h-11
                                px-5
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                text-sm
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                                transition
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                h-11
                                px-5
                                rounded-xl
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                text-sm
                                font-semibold
                                flex
                                items-center
                                gap-2
                                transition
                                disabled:opacity-50
                            "
                        >
                            {saving ? (
                                <>
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            rounded-full
                                            border-2
                                            border-white/40
                                            border-t-white
                                            animate-spin
                                        "
                                    />

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={17} />

                                    {editingUser
                                        ? "Update User"
                                        : "Create User"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;