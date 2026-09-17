import api from "./api";

const adminSubjectService = {

    // =====================================================
    // GET ALL SUBJECTS
    // =====================================================

    getAllSubjects: async () => {
        const response = await api.get(
            "/api/admin/subjects"
        );

        console.log(
            "SUBJECT API:",
            response.data
        );

        return response.data;
    },

    // =====================================================
    // GET SUBJECT BY ID
    // =====================================================

    getSubjectById: async (id) => {
        const response = await api.get(
            `/api/admin/subjects/${id}`
        );

        return response.data;
    },

    // =====================================================
    // ADD SUBJECT
    // =====================================================

    addSubject: async (subjectData) => {
        const response = await api.post(
            "/api/admin/subjects",
            subjectData
        );

        return response.data;
    },

    // =====================================================
    // UPDATE SUBJECT
    // =====================================================

    updateSubject: async (id, subjectData) => {
        const response = await api.put(
            `/api/admin/subjects/${id}`,
            subjectData
        );

        return response.data;
    },

    // =====================================================
    // DELETE SUBJECT
    // =====================================================

    deleteSubject: async (id) => {
        const response = await api.delete(
            `/api/admin/subjects/${id}`
        );

        return response.data;
    },
};

export default adminSubjectService;