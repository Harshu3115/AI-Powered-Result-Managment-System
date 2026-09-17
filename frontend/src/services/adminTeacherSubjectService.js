import api from "./api";

const adminTeacherSubjectService = {

    // =====================================================
    // GET ALL TEACHER-SUBJECT ASSIGNMENTS
    // =====================================================

    getAllAssignments: async () => {

        const response = await api.get(
            "/api/admin/teacher-subjects"
        );

        console.log(
            "TEACHER SUBJECT API:",
            response.data
        );

        return response.data;
    },


    // =====================================================
    // ASSIGN SUBJECT TO TEACHER
    // =====================================================

    assignSubject: async (
        teacherId,
        subjectId
    ) => {

        const response = await api.post(
            "/api/admin/teacher-subjects",
            {
                teacherId: Number(teacherId),
                subjectId: Number(subjectId),
            }
        );

        return response.data;
    },


    // =====================================================
    // GET SUBJECTS BY TEACHER
    // =====================================================

    getSubjectsByTeacher: async (
        teacherId
    ) => {

        const response = await api.get(
            `/api/admin/teacher-subjects/teacher/${teacherId}`
        );

        return response.data;
    },


    // =====================================================
    // DELETE ASSIGNMENT
    // =====================================================

    deleteAssignment: async (
        id
    ) => {

        const response = await api.delete(
            `/api/admin/teacher-subjects/${id}`
        );

        return response.data;
    },

    // =====================================================
    // UPDATE TEACHER-SUBJECT ASSIGNMENT
    // =====================================================

    updateAssignment: async (id, teacherId, subjectId) => {

        const response = await api.put(
            `/api/admin/teacher-subjects/${id}`,
            {
                teacherId: Number(teacherId),
                subjectId: Number(subjectId),
            }
        );

        return response.data;
    },
};

export default adminTeacherSubjectService;