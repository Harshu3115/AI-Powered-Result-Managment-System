import api from "./api";

const adminUserService = {

    // =====================================================
    // GET ALL USERS
    // =====================================================

    getAllUsers: async () => {
        return await api.get("/api/admin/users");
    },

    // =====================================================
    // GET USER BY ID
    // =====================================================

    getUserById: async (id) => {
        return await api.get(`/api/admin/users/${id}`);
    },

    // =====================================================
    // ADD USER
    // =====================================================

    addUser: async (userData) => {
        return await api.post(
            "/api/admin/users",
            userData
        );
    },

    // =====================================================
    // UPDATE USER
    // =====================================================

    updateUser: async (id, userData) => {
        return await api.put(
            `/api/admin/users/${id}`,
            userData
        );
    },

    // =====================================================
    // DELETE USER
    // =====================================================

    deleteUser: async (id) => {
        return await api.delete(
            `/api/admin/users/${id}`
        );
    },

    // =====================================================
    // ENABLE / DISABLE
    // =====================================================

    toggleUserStatus: async (id) => {
        return await api.patch(
            `/api/admin/users/${id}/toggle-status`
        );
    },
};

export default adminUserService;