import api from "./api";

const adminStudentService = {

    getAllStudents: async () => {
        const response = await api.get("/api/admin/students");

        console.log("STUDENT API:", response.data);

        return response.data;
    },

    getStudentById: async (id) => {
        const response = await api.get(
            `/api/admin/students/${id}`
        );

        return response.data;
    },

    addStudent: async (student) => {
        const response = await api.post(
            "/api/admin/students",
            student
        );

        return response.data;
    },

    updateStudent: async (id, student) => {
        const response = await api.put(
            `/api/admin/students/${id}`,
            student
        );

        return response.data;
    },

    deleteStudent: async (id) => {
        const response = await api.delete(
            `/api/admin/students/${id}`
        );

        return response.data;
    },

};

export default adminStudentService;