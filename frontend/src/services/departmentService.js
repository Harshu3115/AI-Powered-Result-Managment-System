import api from "./api";

const departmentService = {

    getAllDepartments: async () => {
        const response = await api.get(
            "/api/departments"
        );

        return response.data;
    },

};

export default departmentService;