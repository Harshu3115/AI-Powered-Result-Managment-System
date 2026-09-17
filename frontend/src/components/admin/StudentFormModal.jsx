import { useEffect, useState } from "react";
import {
    X,
    UserPlus,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";

const emptyForm = {
    rollNo: "",
    enrollmentNo: "",
    prnNo: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    mobile: "",
    gender: "",
    dateOfBirth: "",
    admissionYear: "",
    semesterId: "",
};

const StudentFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingStudent,
    semesters = [],
    loading = false,
}) => {

    const [form, setForm] = useState(emptyForm);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {

        if (editingStudent) {

            setForm({
                rollNo: editingStudent.rollNo || "",
                enrollmentNo:
                    editingStudent.enrollmentNo || "",
                prnNo:
                    editingStudent.prnNo || "",
                firstName:
                    editingStudent.firstName || "",
                lastName:
                    editingStudent.lastName || "",
                email:
                    editingStudent.email || "",
                username:
                    editingStudent.username || "",
                password: "",
                mobile:
                    editingStudent.mobile || "",
                gender:
                    editingStudent.gender || "",
                dateOfBirth:
                    editingStudent.dateOfBirth || "",
                admissionYear:
                    editingStudent.admissionYear || "",
                semesterId:
                    editingStudent.semesterId || "",
            });

        } else {

            setForm(emptyForm);

        }

        setShowPassword(false);

    }, [editingStudent, isOpen]);


    if (!isOpen) {
        return null;
    }


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


    const handleSubmit = (e) => {

        e.preventDefault();

        const payload = {
            ...form,

            prnNo:
                form.prnNo
                    ? Number(form.prnNo)
                    : null,

            admissionYear:
                form.admissionYear
                    ? Number(form.admissionYear)
                    : null,

            semesterId:
                form.semesterId
                    ? Number(form.semesterId)
                    : null,
        };

        onSubmit(payload);

    };


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
    `;


    return (
        <div className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-900/40
            backdrop-blur-sm
            p-4
        ">

            <div className="
                w-full
                max-w-4xl
                max-h-[92vh]
                overflow-y-auto
                rounded-2xl
                bg-white
                shadow-2xl
            ">

                {/* HEADER */}

                <div className="
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
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            h-10
                            w-10
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600
                            flex
                            items-center
                            justify-center
                        ">
                            <UserPlus size={20} />
                        </div>

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-slate-800
                            ">
                                {editingStudent
                                    ? "Edit Student"
                                    : "Add Student"}
                            </h2>

                            <p className="
                                text-xs
                                text-slate-400
                            ">
                                {editingStudent
                                    ? "Update student information"
                                    : "Create a new student account"}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            h-9
                            w-9
                            rounded-lg
                            text-slate-400
                            hover:bg-slate-100
                            hover:text-slate-700
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-5
                    ">

                        {/* Roll Number */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
                                Roll Number
                            </label>

                            <input
                                name="rollNo"
                                value={form.rollNo}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="Enter roll number"
                            />
                        </div>


                        {/* Enrollment */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
                                Enrollment Number
                            </label>

                            <input
                                name="enrollmentNo"
                                value={form.enrollmentNo}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="Enter enrollment number"
                            />
                        </div>


                        {/* PRN */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
                                PRN Number
                            </label>

                            <input
                                name="prnNo"
                                type="number"
                                value={form.prnNo}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="Enter PRN"
                            />
                        </div>


                        {/* First Name */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
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


                        {/* Last Name */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
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


                        {/* Email */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
                                Email
                            </label>

                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="student@example.com"
                            />
                        </div>


                        {/* Username */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
                                Username
                            </label>

                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="Username"
                            />
                        </div>


                        {/* Password */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
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
                                    required={!editingStudent}
                                    className={`${inputClass} pr-11`}
                                    placeholder={
                                        editingStudent
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
                                    "
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />}
                                </button>

                            </div>

                        </div>


                        {/* Mobile */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
                                Mobile
                            </label>

                            <input
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                maxLength={10}
                                className={inputClass}
                                placeholder="10 digit mobile"
                            />
                        </div>


                        {/* Gender */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
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


                        {/* DOB */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
                                Date of Birth
                            </label>

                            <input
                                name="dateOfBirth"
                                type="date"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>


                        {/* Admission Year */}

                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-slate-600
                            ">
                                Admission Year
                            </label>

                            <input
                                name="admissionYear"
                                type="number"
                                value={form.admissionYear}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="2026"
                            />
                        </div>


                        {/* =====================================================
    SEMESTER
===================================================== */}

                        <div>
                            <label className="
        mb-1.5
        block
        text-sm
        font-medium
        text-slate-600
    ">
                                Semester
                            </label>

                            <select
                                name="semesterId"
                                value={form.semesterId}
                                onChange={handleChange}
                                required
                                disabled={loading || semesters.length === 0}
                                className={inputClass}
                            >
                                <option value="">
                                    {semesters.length === 0
                                        ? "No semesters available"
                                        : "Select semester"}
                                </option>

                                {semesters.map((semester) => (
                                    <option
                                        key={semester.id}
                                        value={semester.id}
                                    >
                                        {semester.semesterName ||
                                            `Semester ${semester.semesterNumber}`}
                                        {semester.courseName
                                            ? ` — ${semester.courseName}`
                                            : ""}
                                    </option>
                                ))}
                            </select>

                            {semesters.length === 0 && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    No semesters found. Please create a semester first.
                                </p>
                            )}
                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="
                        mt-7
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-slate-100
                        pt-5
                    ">

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
                                h-11
                                rounded-xl
                                bg-indigo-600
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                flex
                                items-center
                                gap-2
                                hover:bg-indigo-700
                                disabled:opacity-50
                            "
                        >

                            {editingStudent
                                ? <Save size={17} />
                                : <UserPlus size={17} />}

                            {loading
                                ? "Saving..."
                                : editingStudent
                                    ? "Update Student"
                                    : "Add Student"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default StudentFormModal;