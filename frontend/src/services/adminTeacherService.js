import api from "./api";

const adminTeacherService = {

    // =====================================================
    // GET TEACHERS - PAGINATED
    // =====================================================

    getTeachers: async (page = 0, size = 10) => {

        const response = await api.get(
            "/api/admin/teachers",
            {
                params: {
                    page,
                    size,
                },
            }
        );

        return response.data;
    },


    // =====================================================
    // GET TEACHER BY ID
    // =====================================================

    getTeacherById: async (id) => {

        const response = await api.get(
            `/api/admin/teachers/${id}`
        );

        return response.data;
    },


    // =====================================================
    // ADD TEACHER
    // =====================================================

    addTeacher: async (data) => {

        const response = await api.post(
            "/api/admin/teachers",
            data
        );

        return response.data;
    },


    // =====================================================
    // UPDATE TEACHER
    // =====================================================

    updateTeacher: async (id, data) => {

        const response = await api.put(
            `/api/admin/teachers/${id}`,
            data
        );

        return response.data;
    },


    // =====================================================
    // DELETE TEACHER
    // =====================================================

    deleteTeacher: async (id) => {

        const response = await api.delete(
            `/api/admin/teachers/${id}`
        );

        return response.data;
    },

};

export default adminTeacherService;