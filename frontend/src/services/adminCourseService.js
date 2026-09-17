import api from "./api";

const adminCourseService = {

    // =====================================================
    // GET ALL COURSES
    // =====================================================
    getAllCourses: async () => {
        const response = await api.get(
            "/api/admin/courses"
        );

        console.log("COURSE API:", response.data);

        return response.data;
    },

    // =====================================================
    // GET COURSE BY ID
    // =====================================================
    getCourseById: async (id) => {
        const response = await api.get(
            `/api/admin/courses/${id}`
        );

        return response.data;
    },

    // =====================================================
    // ADD COURSE
    // =====================================================
    addCourse: async (courseData) => {
        const response = await api.post(
            "/api/admin/courses",
            courseData
        );

        return response.data;
    },

    // =====================================================
    // UPDATE COURSE
    // =====================================================
    updateCourse: async (id, courseData) => {
        const response = await api.put(
            `/api/admin/courses/${id}`,
            courseData
        );

        return response.data;
    },

    // =====================================================
    // DELETE COURSE
    // =====================================================
    deleteCourse: async (id) => {
        const response = await api.delete(
            `/api/admin/courses/${id}`
        );

        return response.data;
    },

};

export default adminCourseService;