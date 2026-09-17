import api from "./api";

const adminResultService = {

    // =====================================================
    // GET ALL RESULTS
    // =====================================================

    getAllResults: async () => {
        const response = await api.get(
            "/api/admin/results"
        );

        console.log(
            "RESULT API:",
            response.data
        );

        return response.data;
    },


    // =====================================================
    // GET RESULT BY ID
    // =====================================================

    getResultById: async (id) => {
        const response = await api.get(
            `/api/admin/results/${id}`
        );

        return response.data;
    },


    // =====================================================
    // GENERATE RESULT
    // =====================================================

    generateResult: async (
        studentId,
        semesterId
    ) => {

        const response = await api.post(
            "/api/admin/results/generate",
            {
                studentId: Number(studentId),
                semesterId: Number(semesterId),
            }
        );

        return response.data;
    },


    // =====================================================
    // GET STUDENT SEMESTER RESULT
    // =====================================================

    getStudentSemesterResult: async (
        studentId,
        semesterId
    ) => {

        const response = await api.get(
            `/api/admin/results/student/${studentId}/semester/${semesterId}`
        );

        return response.data;
    },


    // =====================================================
    // GET ALL STUDENT RESULTS
    // =====================================================

    getStudentResults: async (studentId) => {

        const response = await api.get(
            `/api/admin/results/student/${studentId}`
        );

        return response.data;
    },


    // =====================================================
    // GET STUDENT CGPA
    // =====================================================

    getStudentCGPA: async (studentId) => {

        const response = await api.get(
            `/api/admin/results/student/${studentId}/cgpa`
        );

        return response.data;
    },


    // =====================================================
    // DELETE RESULT
    // =====================================================

    deleteResult: async (id) => {

        const response = await api.delete(
            `/api/admin/results/${id}`
        );

        return response.data;
    },


    // =====================================================
    // DOWNLOAD / VIEW MARKSHEET
    // =====================================================

    getMarksheet: async (id) => {

        const response = await api.get(
            `/api/admin/results/${id}/marksheet`,
            {
                responseType: "blob",
            }
        );

        return response.data;
    },
};

export default adminResultService;