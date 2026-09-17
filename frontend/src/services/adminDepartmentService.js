import api from "./api";

const adminDepartmentService = {

    // =====================================================
    // GET ALL DEPARTMENTS
    // =====================================================

    getAllDepartments: async () => {
        const response = await api.get(
            "/api/admin/departments"
        );

        return response.data;
    },


    // =====================================================
    // GET DEPARTMENT BY ID
    // =====================================================

    getDepartmentById: async (id) => {
        const response = await api.get(
            `/api/admin/departments/${id}`
        );

        return response.data;
    },


    // =====================================================
    // ADD DEPARTMENT
    // =====================================================

    addDepartment: async (departmentData) => {
        const response = await api.post(
            "/api/admin/departments",
            departmentData
        );

        return response.data;
    },


    // =====================================================
    // UPDATE DEPARTMENT
    // =====================================================

    updateDepartment: async (id, departmentData) => {
        const response = await api.put(
            `/api/admin/departments/${id}`,
            departmentData
        );

        return response.data;
    },


    // =====================================================
    // DELETE DEPARTMENT
    // =====================================================

    deleteDepartment: async (id) => {
        const response = await api.delete(
            `/api/admin/departments/${id}`
        );

        return response.data;
    },
};

export default adminDepartmentService;