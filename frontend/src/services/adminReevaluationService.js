import api from "./api";

const adminReevaluationService = {

    // =====================================================
    // GET ALL REEVALUATION REQUESTS
    // =====================================================

    getAllRequests: async () => {

        const response = await api.get(
            "/api/admin/reevaluation"
        );

        console.log(
            "ADMIN REEVALUATION API:",
            response.data
        );

        return response.data;
    },


    // =====================================================
    // GET REQUEST BY ID
    // =====================================================

    getRequestById: async (id) => {

        const response = await api.get(
            `/api/admin/reevaluation/${id}`
        );

        return response.data;
    },

};

export default adminReevaluationService;