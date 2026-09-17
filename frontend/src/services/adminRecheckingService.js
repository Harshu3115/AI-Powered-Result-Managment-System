import api from "./api";

const adminRecheckingService = {

    // =====================================================
    // GET ALL RECHECKING REQUESTS
    // =====================================================

    getAllRequests: async () => {
        const response = await api.get(
            "/api/admin/rechecking"
        );

        console.log(
            "ADMIN RECHECKING API:",
            response.data
        );

        return response.data;
    },


    // =====================================================
    // GET RECHECKING REQUEST BY ID
    // =====================================================

    getRequestById: async (id) => {
        const response = await api.get(
            `/api/admin/rechecking/${id}`
        );

        return response.data;
    },

};

export default adminRecheckingService;