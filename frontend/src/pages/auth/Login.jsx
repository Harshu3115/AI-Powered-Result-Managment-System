import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import authService from "../../services/authServices";

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const selectedRole = location.state?.role || "STUDENT";

    const registerPath =
        selectedRole === "TEACHER"
            ? "/teacher-register"
            : selectedRole === "ADMIN"
                ? "/admin-register"
                : "/register";

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.username.trim()) {
            toast.error("Please enter username");
            return;
        }

        if (!formData.password) {
            toast.error("Please enter password");
            return;
        }

        try {
            setLoading(true);

            const response = await authService.login(formData);

            console.log("Login Response:", response);

            // =====================================================
            // CHECK LOGIN RESPONSE
            // =====================================================

            if (!response?.success) {
                toast.error(
                    response?.message ||
                    "Invalid username or password"
                );
                return;
            }

            // =====================================================
            // GET TOKEN
            // =====================================================

            const token =
                response?.data?.token ||
                response?.token;

            // =====================================================
            // GET USER
            // =====================================================

            const user =
                response?.data?.user ||
                response?.data;

            if (!token) {
                toast.error(
                    "Authentication token not received"
                );
                return;
            }

            // =====================================================
            // GET ROLE
            // =====================================================

            const role =
                response?.data?.role ||
                user?.role ||
                "";

            const normalizedRole =
                role.toUpperCase();

            if (!normalizedRole) {
                toast.error(
                    "User role not found"
                );
                return;
            }

            // =====================================================
            // SAVE AUTH DATA IN CURRENT TAB
            // =====================================================

            sessionStorage.setItem(
                "token",
                token
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            sessionStorage.setItem(
                "role",
                normalizedRole
            );

            // =====================================================
            // LOGIN DEBUG
            // =====================================================

            console.log(
                "========== LOGIN DEBUG =========="
            );

            console.log(
                "Token:",
                sessionStorage.getItem("token")
            );

            console.log(
                "User:",
                sessionStorage.getItem("user")
            );

            console.log(
                "Role:",
                sessionStorage.getItem("role")
            );

            console.log(
                "Normalized Role:",
                normalizedRole
            );

            console.log(
                "================================="
            );

            // =====================================================
            // SUCCESS
            // =====================================================

            toast.success(
                "Login successful!"
            );

            // =====================================================
            // ROLE BASED NAVIGATION
            // =====================================================

            if (normalizedRole === "STUDENT") {

                navigate("/student/dashboard");

            } else if (normalizedRole === "TEACHER") {

                navigate("/teacher/dashboard");

            } else if (normalizedRole === "ADMIN") {

                navigate("/admin/dashboard");

            } else {

                toast.error(
                    "User role not found"
                );
            }

        } catch (err) {

            console.error(
                "Login Error:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-8">

                {/* Title */}

                {/* Logo */}

                <div className="text-center mb-8">

                    <img
                        src="/ftc.png"
                        alt="Fabtech Technical Campus"
                        className="w-24 h-24 object-contain mx-auto mb-4"
                    />

                    <h1 className="text-2xl font-bold text-gray-800">
                        Student Result Management System
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Fabtech Technical Campus
                    </p>

                </div>


                {/* Login */}



                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Username */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* Password */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >

                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}

                            </button>


                            <div className="text-right">

                                <Link
                                    to="/forgot-password"
                                    className="
            text-sm
            font-semibold
            text-indigo-600
            hover:underline
        "
                                >
                                    Forgot Password?
                                </Link>

                            </div>

                        </div>

                    </div>


                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-60"
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>


                {/* Register */}

                <div className="text-center mt-6">

                    <p className="text-sm text-gray-500">

                        Don't have an account?{" "}

                        <Link
                            to={
                                selectedRole === "TEACHER"
                                    ? "/teacher-register"
                                    : selectedRole === "ADMIN"
                                        ? "/admin-register"
                                        : "/register"
                            }
                            state={{ role: selectedRole }}
                            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                            Register
                        </Link>

                    </p>

                </div>

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

export default Login;