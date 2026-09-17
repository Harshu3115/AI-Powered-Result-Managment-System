import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    GraduationCap,
    ArrowLeft,
} from "lucide-react";

import {
    toast,
    ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import authService from "../../services/authServices";

const Register = () => {

    const navigate = useNavigate();
    const location = useLocation();

    // Role coming from Login page
    const selectedRole =
        location.state?.role || "STUDENT";


    const [formData, setFormData] = useState({

        firstName: "",
        lastName: "",
        username: "",
        email: "",
        mobile: "",

        password: "",
        confirmPassword: "",

        // Student fields
        rollNo: "",
        enrollmentNo: "",
        prnNo: "",
        dateOfBirth: "",
        gender: "",
        admissionYear: "",

    });


    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // HANDLE CHANGE
    // ==========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Basic validation

        if (!formData.firstName.trim()) {
            toast.error("First name is required");
            return;
        }

        if (!formData.lastName.trim()) {
            toast.error("Last name is required");
            return;
        }

        if (!formData.username.trim()) {
            toast.error("Username is required");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Email is required");
            return;
        }

        if (!formData.mobile.trim()) {
            toast.error("Mobile number is required");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            toast.error("Enter a valid mobile number");
            return;
        }

        if (!formData.password) {
            toast.error("Password is required");
            return;
        }

        if (formData.password.length < 8) {
            toast.error(
                "Password must contain at least 8 characters"
            );
            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            toast.error(
                "Passwords do not match"
            );
            return;
        }


        // Student validation

        if (!formData.rollNo.trim()) {
            toast.error("Roll number is required");
            return;
        }

        if (!formData.enrollmentNo.trim()) {
            toast.error("Enrollment number is required");
            return;
        }

        if (!formData.prnNo.trim()) {
            toast.error("PRN number is required");
            return;
        }

        if (!formData.dateOfBirth) {
            toast.error("Date of birth is required");
            return;
        }

        if (!formData.gender) {
            toast.error("Please select gender");
            return;
        }

        if (!formData.admissionYear) {
            toast.error("Admission year is required");
            return;
        }


        try {

            setLoading(true);


            // Send role automatically
            const requestData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,

                role: "STUDENT",

                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobile,

                rollNo: formData.rollNo,
                enrollmentNo: formData.enrollmentNo,
                prnNo: Number(formData.prnNo),

                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,

                admissionYear: Number(
                    formData.admissionYear
                ),
            };


            console.log(
                "Student Registration:",
                requestData
            );


            const response =
                await authService.register(
                    requestData
                );


            if (!response?.success) {

                toast.error(
                    response?.message ||
                    "Registration failed"
                );

                return;
            }


            toast.success(
                "Student registration successful!"
            );


            setTimeout(() => {

                navigate("/login", {
                    state: {
                        role: "STUDENT",
                    },
                    replace: true,
                });

            }, 1000);


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Unable to register"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="min-h-screen bg-gray-100 py-8 px-4">

            <div className="max-w-4xl mx-auto">


                {/* Back */}

                <button
                    onClick={() =>
                        navigate("/login", {
                            state: {
                                role: "STUDENT",
                            },
                        })
                    }
                    className="
                        flex items-center gap-2
                        text-gray-600
                        hover:text-indigo-600
                        mb-5
                    "
                >

                    <ArrowLeft size={18} />

                    Back to Login

                </button>


                {/* Card */}

                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">


                    {/* Header */}

                    <div className="bg-indigo-600 px-6 py-7 text-white">

                        <div className="flex items-center gap-4">

                            <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center">

                                <GraduationCap
                                    size={30}
                                />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold">
                                    Student Registration
                                </h1>

                                <p className="text-indigo-100 text-sm mt-1">
                                    Create your Student SRMS account
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 md:p-8"
                    >


                        {/* =========================
                            PERSONAL INFORMATION
                        ========================= */}

                        <SectionTitle>
                            Personal Information
                        </SectionTitle>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                            <Input
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                            />


                            <Input
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                            />


                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />


                            <Input
                                label="Mobile Number"
                                name="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter 10 digit mobile number"
                                maxLength={10}
                            />


                            <Input
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />


                            <Select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={[
                                    {
                                        value: "MALE",
                                        label: "Male",
                                    },
                                    {
                                        value: "FEMALE",
                                        label: "Female",
                                    },
                                    {
                                        value: "OTHER",
                                        label: "Other",
                                    },
                                ]}
                            />

                        </div>


                        {/* =========================
                            ACCOUNT INFORMATION
                        ========================= */}

                        <div className="mt-8">

                            <SectionTitle>
                                Account Information
                            </SectionTitle>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                <Input
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Create username"
                                />


                                {/* Password */}

                                <PasswordInput
                                    label="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    show={showPassword}
                                    setShow={setShowPassword}
                                    placeholder="Create password"
                                />


                                {/* Confirm Password */}

                                <PasswordInput
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    show={showConfirmPassword}
                                    setShow={setShowConfirmPassword}
                                    placeholder="Confirm password"
                                />

                            </div>

                        </div>


                        {/* =========================
                            ACADEMIC INFORMATION
                        ========================= */}

                        <div className="mt-8">

                            <SectionTitle>
                                Academic Information
                            </SectionTitle>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <Input
                                    label="Roll Number"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    placeholder="Enter roll number"
                                />

                                <Input
                                    label="Enrollment Number"
                                    name="enrollmentNo"
                                    value={formData.enrollmentNo}
                                    onChange={handleChange}
                                    placeholder="Enter enrollment number"
                                />

                                <Input
                                    label="PRN Number"
                                    name="prnNo"
                                    type="number"
                                    value={formData.prnNo}
                                    onChange={handleChange}
                                    placeholder="Enter PRN number"
                                />

                                <Input
                                    label="Admission Year"
                                    name="admissionYear"
                                    type="text"
                                    value={formData.admissionYear}
                                    onChange={handleChange}
                                    placeholder="Example: 2022"
                                    maxLength={4}
                                />

                            </div>

                        </div>




                        {/* =========================
                            SUBMIT
                        ========================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full mt-8
                                h-12
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                font-semibold
                                rounded-xl
                                transition
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Student Account"
                            }

                        </button>


                        {/* Login */}

                        <p className="text-center text-sm text-gray-500 mt-5">

                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/login", {
                                        state: {
                                            role: "STUDENT",
                                        },
                                    })
                                }
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                Login
                            </button>

                        </p>

                    </form>

                </div>

            </div>


            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />

        </div>
    );
};


/* =====================================================
   SECTION TITLE
===================================================== */

const SectionTitle = ({ children }) => {

    return (
        <h2 className="text-lg font-bold text-gray-800 mb-5 pb-2 border-b border-gray-200">
            {children}
        </h2>
    );
};


/* =====================================================
   INPUT
===================================================== */

const Input = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    maxLength,
    min,
    max,
}) => {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                min={min}
                max={max}
                className="
                    w-full h-12 px-4
                    border border-gray-300
                    rounded-lg
                    outline-none
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-100
                "
            />

        </div>
    );
};


/* =====================================================
   SELECT
===================================================== */

const Select = ({
    label,
    name,
    value,
    onChange,
    options,
}) => {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="
                    w-full h-12 px-4
                    border border-gray-300
                    rounded-lg
                    outline-none
                    bg-white
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-100
                "
            >

                <option value="">
                    Select {label}
                </option>

                {options.map((option) => (

                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>

                ))}

            </select>

        </div>
    );
};


/* =====================================================
   PASSWORD INPUT
===================================================== */

const PasswordInput = ({
    label,
    name,
    value,
    onChange,
    show,
    setShow,
    placeholder,
}) => {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div className="relative">

                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="
                        w-full h-12 px-4 pr-12
                        border border-gray-300
                        rounded-lg
                        outline-none
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-100
                    "
                />

                <button
                    type="button"
                    onClick={() =>
                        setShow(!show)
                    }
                    className="
                        absolute right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-gray-600
                    "
                >

                    {show ? (
                        <EyeOff size={20} />
                    ) : (
                        <Eye size={20} />
                    )}

                </button>

            </div>

        </div>
    );
};


export default Register;