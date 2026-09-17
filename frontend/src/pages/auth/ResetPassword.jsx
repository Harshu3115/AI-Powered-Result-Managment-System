import React, { useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    Eye,
    EyeOff,
    Lock,
} from "lucide-react";

import {
    toast,
    ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import authService from "../../services/authServices";


const ResetPassword = () => {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // Get token from URL
    const token = searchParams.get("token");


    const [formData, setFormData] = useState({
        newPassword: "",
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


        // Token validation

        if (!token) {

            toast.error(
                "Invalid or missing reset token"
            );

            return;
        }


        // Password validation

        if (!formData.newPassword) {

            toast.error(
                "Please enter a new password"
            );

            return;
        }


        if (formData.newPassword.length < 8) {

            toast.error(
                "Password must contain at least 8 characters"
            );

            return;
        }


        // Confirm password

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            toast.error(
                "Passwords do not match"
            );

            return;
        }


        try {

            setLoading(true);


            const requestData = {

                token: token,

                newPassword:
                    formData.newPassword,

            };


            console.log(
                "Reset Password Request:",
                requestData
            );


            const response =
                await authService.resetPassword(
                    requestData
                );


            console.log(
                "Reset Password Response:",
                response
            );


            // Backend error

            if (!response?.success) {

                toast.error(
                    response?.message ||
                    "Password reset failed"
                );

                return;
            }


            // Success

            toast.success(
                response?.message ||
                "Password reset successfully!"
            );


            // Redirect to login

            setTimeout(() => {

                navigate("/login", {
                    replace: true,
                });

            }, 1500);


        } catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to reset password"
            );


        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-gray-100
            px-4
        ">


            <div className="
                w-full
                max-w-md
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-md
                p-8
            ">


                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="text-center">

                    <div className="
                        w-16
                        h-16
                        mx-auto
                        rounded-full
                        bg-indigo-100
                        text-indigo-600
                        flex
                        items-center
                        justify-center
                    ">

                        <Lock size={30} />

                    </div>


                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-800
                        mt-5
                    ">
                        Reset Password
                    </h1>


                    <p className="
                        text-sm
                        text-gray-500
                        mt-2
                    ">
                        Enter your new password below.
                    </p>

                </div>


                {/* ================================= */}
                {/* FORM */}
                {/* ================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 space-y-5"
                >


                    {/* New Password */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-medium
                            text-gray-700
                            mb-2
                        ">
                            New Password
                        </label>


                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="newPassword"
                                value={
                                    formData.newPassword
                                }
                                onChange={handleChange}
                                placeholder="Enter new password"
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

                    <div>

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
                                placeholder="Confirm new password"
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
                            ? "Resetting Password..."
                            : "Reset Password"
                        }

                    </button>

                </form>

            </div>


            {/* Toast */}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />

        </div>
    );
};


export default ResetPassword;