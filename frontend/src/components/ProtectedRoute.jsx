import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {

    const location = useLocation();

    // =====================================================
    // GET AUTH DATA FROM CURRENT TAB
    // =====================================================

    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!token) {

        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // =====================================================
    // GET USER
    // =====================================================

    let user = null;

    try {

        user = userData
            ? JSON.parse(userData)
            : null;

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // =====================================================
    // GET ROLE
    // =====================================================

    const role = (
        user?.role ||
        user?.user?.role ||
        sessionStorage.getItem("role") ||
        ""
    ).toUpperCase();

    console.log(
        "🔐 ProtectedRoute:",
        {
            token: !!token,
            role,
            allowedRoles
        }
    );

    // =====================================================
    // ROLE PROTECTION
    // =====================================================

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(role)
    ) {

        console.error(
            "❌ Role not allowed:",
            role,
            "Allowed:",
            allowedRoles
        );

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    // =====================================================
    // ALLOW ACCESS
    // =====================================================

    return <Outlet />;
};

export default ProtectedRoute;