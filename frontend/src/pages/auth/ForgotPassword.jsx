import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import {
    toast,
    ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import authService from "../../services/authServices";


const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!email.trim()) {

            toast.error("Please enter your email");

            return;
        }


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            toast.error("Please enter a valid email");

            return;
        }


        try {

            setLoading(true);


            const response =
                await authService.forgotPassword({
                    email: email.trim(),
                });


            if (!response?.success) {

                toast.error(
                    response?.message ||
                    "Unable to send reset link"
                );

                return;
            }


            toast.success(
                response?.message ||
                "Password reset link sent successfully"
            );


            setEmail("");


        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Unable to connect to server"
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


                {/* Icon */}

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

                        <Mail size={30} />

                    </div>


                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-800
                        mt-5
                    ">
                        Forgot Password?
                    </h1>


                    <p className="
                        text-sm
                        text-gray-500
                        mt-2
                    ">
                        Enter your registered email and
                        we will send you a password reset link.
                    </p>

                </div>


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-7"
                >


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
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
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


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            h-12
                            mt-5
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            font-semibold
                            rounded-lg
                            transition
                            disabled:opacity-60
                        "
                    >

                        {loading
                            ? "Sending..."
                            : "Send Reset Link"
                        }

                    </button>

                </form>


                {/* Back Login */}

                <div className="
                    text-center
                    mt-6
                ">

                    <Link
                        to="/login"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-indigo-600
                            hover:underline
                        "
                    >

                        <ArrowLeft size={16} />

                        Back to Login

                    </Link>

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


export default ForgotPassword;