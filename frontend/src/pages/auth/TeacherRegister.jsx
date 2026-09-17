import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    ArrowLeft,
    Users,
} from "lucide-react";

import {
    toast,
    ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import authService from "../../services/authServices";

const TeacherRegister = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",

        firstName: "",
        lastName: "",
        mobile: "",
        gender: "",
        dateOfBirth: "",

        teacherCode: "",
        qualification: "",
        designation: "",
        experience: "",
        departmentId: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        // Mobile: maximum 10 digits
        if (name === "mobile") {

            if (!/^\d{0,10}$/.test(value)) {
                return;
            }
        }

        // Experience: numbers only
        if (name === "experience") {

            if (!/^\d*$/.test(value)) {
                return;
            }
        }

        // Department ID: numbers only
        if (name === "departmentId") {

            if (!/^\d*$/.test(value)) {
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =================================================
        // ACCOUNT VALIDATION
        // =================================================

        if (!formData.username.trim()) {
            toast.error("Username is required");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Email is required");
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {
            toast.error("Enter a valid email address");
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
            toast.error("Passwords do not match");
            return;
        }


        // =================================================
        // PERSONAL VALIDATION
        // =================================================

        if (!formData.firstName.trim()) {
            toast.error("First name is required");
            return;
        }

        if (!formData.lastName.trim()) {
            toast.error("Last name is required");
            return;
        }

        if (!formData.mobile) {
            toast.error("Mobile number is required");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            toast.error(
                "Enter a valid 10 digit mobile number"
            );
            return;
        }

        if (!formData.gender) {
            toast.error("Please select gender");
            return;
        }

        if (!formData.dateOfBirth) {
            toast.error("Date of birth is required");
            return;
        }


        // =================================================
        // TEACHER VALIDATION
        // =================================================

        if (!formData.teacherCode.trim()) {
            toast.error("Teacher code is required");
            return;
        }

        if (!formData.qualification.trim()) {
            toast.error("Qualification is required");
            return;
        }

        if (!formData.designation.trim()) {
            toast.error("Designation is required");
            return;
        }

        if (formData.experience === "") {
            toast.error("Experience is required");
            return;
        }

        if (Number(formData.experience) < 0) {
            toast.error("Experience cannot be negative");
            return;
        }

        if (!formData.departmentId) {
            toast.error("Department ID is required");
            return;
        }


        // =================================================
        // API REQUEST
        // =================================================

        try {

            setLoading(true);

            const requestData = {

                // User Account
                username: formData.username.trim(),

                email: formData.email.trim(),

                password: formData.password,

                role: "TEACHER",


                // Personal Details
                firstName: formData.firstName.trim(),

                lastName: formData.lastName.trim(),

                mobile: formData.mobile,

                gender: formData.gender,

                dateOfBirth: formData.dateOfBirth,


                // Teacher Details
                teacherCode: formData.teacherCode.trim(),

                qualification: formData.qualification.trim(),

                designation: formData.designation.trim(),

                experience: Number(formData.experience),

                departmentId: Number(formData.departmentId),
            };


            console.log(
                "Teacher Registration Request:",
                requestData
            );


            const response =
                await authService.register(requestData);


            console.log(
                "Teacher Registration Response:",
                response
            );


            // =================================================
            // BACKEND ERROR
            // =================================================

            if (!response?.success) {

                toast.error(
                    response?.message ||
                    "Teacher registration failed"
                );

                return;
            }


            // =================================================
            // SUCCESS
            // =================================================

            toast.success(
                response?.message ||
                "Teacher registration successful!"
            );


            // Clear form

            setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",

                firstName: "",
                lastName: "",
                mobile: "",
                gender: "",
                dateOfBirth: "",

                teacherCode: "",
                qualification: "",
                designation: "",
                experience: "",
                departmentId: "",
            });


            // Go to Teacher Login

            setTimeout(() => {

                navigate("/login", {
                    state: {
                        role: "TEACHER",
                    },
                    replace: true,
                });

            }, 1200);


        } catch (error) {

            console.error(
                "Teacher Registration Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-screen bg-gray-100 py-8 px-4">

            <div className="max-w-4xl mx-auto">


                {/* BACK */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/login", {
                            state: {
                                role: "TEACHER",
                            },
                        })
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        text-gray-600
                        hover:text-indigo-600
                        mb-5
                    "
                >

                    <ArrowLeft size={18} />

                    Back to Login

                </button>


                {/* CARD */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    border
                    border-gray-200
                    overflow-hidden
                ">


                    {/* HEADER */}

                    <div className="
                        bg-indigo-600
                        px-6
                        py-7
                        text-white
                    ">

                        <div className="flex items-center gap-4">

                            <div className="
                                w-14
                                h-14
                                rounded-xl
                                bg-white/15
                                flex
                                items-center
                                justify-center
                            ">

                                <Users size={30} />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold">
                                    Teacher Registration
                                </h1>

                                <p className="text-indigo-100 text-sm mt-1">
                                    Create your Teacher SRMS account
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 md:p-8"
                    >


                        {/* ===================================== */}
                        {/* ACCOUNT INFORMATION */}
                        {/* ===================================== */}

                        <h2 className="
                            text-lg
                            font-bold
                            text-gray-800
                            mb-5
                            pb-2
                            border-b
                            border-gray-200
                        ">
                            Account Information
                        </h2>

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        ">

                            <Input
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                            />

                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />

                            <PasswordInput
                                label="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                show={showPassword}
                                setShow={setShowPassword}
                                placeholder="Enter password"
                            />

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


                        {/* ===================================== */}
                        {/* PERSONAL INFORMATION */}
                        {/* ===================================== */}

                        <h2 className="
                            text-lg
                            font-bold
                            text-gray-800
                            mt-8
                            mb-5
                            pb-2
                            border-b
                            border-gray-200
                        ">
                            Personal Information
                        </h2>

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        ">

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
                                label="Mobile Number"
                                name="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="10 digit mobile number"
                                maxLength={10}
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

                            <Input
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />

                        </div>


                        {/* ===================================== */}
                        {/* TEACHER INFORMATION */}
                        {/* ===================================== */}

                        <h2 className="
                            text-lg
                            font-bold
                            text-gray-800
                            mt-8
                            mb-5
                            pb-2
                            border-b
                            border-gray-200
                        ">
                            Teacher Information
                        </h2>

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        ">

                            <Input
                                label="Teacher Code"
                                name="teacherCode"
                                value={formData.teacherCode}
                                onChange={handleChange}
                                placeholder="Enter teacher code"
                            />

                            <Input
                                label="Qualification"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                placeholder="Example: M.Tech"
                            />

                            <Input
                                label="Designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                placeholder="Example: Assistant Professor"
                            />

                            <Input
                                label="Experience"
                                name="experience"
                                type="number"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="Experience in years"
                                min="0"
                            />

                            <Input
                                label="Department ID"
                                name="departmentId"
                                type="number"
                                value={formData.departmentId}
                                onChange={handleChange}
                                placeholder="Enter department ID"
                                min="1"
                            />

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                mt-8
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
                                : "Create Teacher Account"
                            }

                        </button>


                        {/* LOGIN */}

                        <p className="
                            text-center
                            text-sm
                            text-gray-500
                            mt-5
                        ">

                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/login", {
                                        state: {
                                            role: "TEACHER",
                                        },
                                    })
                                }
                                className="
                                    text-indigo-600
                                    font-semibold
                                    hover:underline
                                "
                            >
                                Login
                            </button>

                        </p>

                    </form>

                </div>

            </div>


            {/* TOAST */}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />

        </div>
    );
};


// =====================================================
// INPUT COMPONENT
// =====================================================

const Input = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    maxLength,
    min,
}) => {

    return (

        <div>

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">
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
                className="
                    w-full
                    h-12
                    px-4
                    border
                    border-gray-300
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


// =====================================================
// SELECT COMPONENT
// =====================================================

const Select = ({
    label,
    name,
    value,
    onChange,
    options,
}) => {

    return (

        <div>

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="
                    w-full
                    h-12
                    px-4
                    border
                    border-gray-300
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


// =====================================================
// PASSWORD COMPONENT
// =====================================================

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

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">
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
                        w-full
                        h-12
                        px-4
                        pr-12
                        border
                        border-gray-300
                        rounded-lg
                        outline-none
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-100
                    "
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="
                        absolute
                        right-4
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

export default TeacherRegister;