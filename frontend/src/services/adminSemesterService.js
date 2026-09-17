import api from "./api";

const adminSemesterService = {

    // =====================================================
    // GET ALL SEMESTERS
    // =====================================================
    getAllSemesters: async () => {
        const response = await api.get(
            "/api/admin/semesters"
        );

        console.log("SEMESTER API:", response.data);

        return response.data;
    },

    // =====================================================
    // GET SEMESTER BY ID
    // =====================================================
    getSemesterById: async (id) => {
        const response = await api.get(
            `/api/admin/semesters/${id}`
        );

        return response.data;
    },

    // =====================================================
    // ADD SEMESTER
    // =====================================================
    addSemester: async (semesterData) => {
        const response = await api.post(
            "/api/admin/semesters",
            semesterData
        );

        return response.data;
    },

    // =====================================================
    // UPDATE SEMESTER
    // =====================================================
    updateSemester: async (id, semesterData) => {
        const response = await api.put(
            `/api/admin/semesters/${id}`,
            semesterData
        );

        return response.data;
    },

    // =====================================================
    // DELETE SEMESTER
    // =====================================================
    deleteSemester: async (id) => {
        const response = await api.delete(
            `/api/admin/semesters/${id}`
        );

        return response.data;
    },

};

export default adminSemesterService;