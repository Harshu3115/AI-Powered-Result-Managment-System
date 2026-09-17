import api from "./api";

const adminPerformanceService = {

    getPerformance: async () => {

        const response = await api.get(
            "/api/admin/performance"
        );

        console.log(
            "Admin Performance API:",
            response.data
        );

        return response.data;
    }

};

export default adminPerformanceService;