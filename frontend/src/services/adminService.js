import api from "./api";

const adminService = {
    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    getDashboard: async () => {
        const response = await api.get(
            "/admin/dashboard"
        );

        console.log(
            "Admin Dashboard Response:",
            response.data
        );

        return response.data;
    },
};

export default adminService;