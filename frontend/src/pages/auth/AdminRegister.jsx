import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    ArrowLeft,
    ShieldCheck,
} from "lucide-react";

import {
    toast,
    ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import authService from "../../services/authServices";

const AdminRegister = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);


    // ==========================================
    // HANDLE CHANGE
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Username

        if (!formData.username.trim()) {
            toast.error("Username is required");
            return;
        }


        // Email

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


        // Password

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


        // Confirm Password

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            toast.error("Passwords do not match");
            return;
        }


        // ==========================================
        // API
        // ==========================================

        try {

            setLoading(true);

            const requestData = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: "ADMIN",
            };

            console.log(
                "Admin Registration Request:",
                requestData
            );

            const response =
                await authService.register(requestData);

            console.log(
                "Admin Registration Response:",
                response
            );


            // Backend error

            if (!response?.success) {

                toast.error(
                    response?.message ||
                    "Admin registration failed"
                );

                return;
            }


            // Success

            toast.success(
                response?.message ||
                "Admin registration successful!"
            );


            setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
            });


            // Go to Admin Login

            setTimeout(() => {

                navigate("/login", {
                    state: {
                        role: "ADMIN",
                    },
                    replace: true,
                });

            }, 1200);


        } catch (error) {

            console.error(
                "Admin Registration Error:",
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

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md">


                {/* Back */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/login", {
                            state: {
                                role: "ADMIN",
                            },
                        })
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        mb-5
                        text-gray-600
                        hover:text-indigo-600
                    "
                >

                    <ArrowLeft size={18} />

                    Back to Login

                </button>


                {/* Card */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-md
                    overflow-hidden
                ">


                    {/* Header */}

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

                                <ShieldCheck size={30} />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold">
                                    Admin Registration
                                </h1>

                                <p className="text-indigo-100 text-sm mt-1">
                                    Create your Admin SRMS account
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 md:p-8"
                    >

                        {/* Username */}

                        <div className="mb-5">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
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


                        {/* Email */}

                        <div className="mb-5">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
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


                        {/* Password */}

                        <div className="mb-5">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
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
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                >

                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* Confirm Password */}

                        <div className="mb-6">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                Confirm Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Confirm password"
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
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                >

                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                h-12
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                font-semibold
                                rounded-lg
                                transition
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Admin Account"
                            }

                        </button>


                        {/* Login */}

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
                                            role: "ADMIN",
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


            {/* Toast */}

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

export default AdminRegister;