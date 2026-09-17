import axios from "axios";
import api from "./api";

const teacherService = {

    // ==========================================
    // DASHBOARD
    // ==========================================

    getDashboard: async () => {
        const response = await api.get(
            "/api/teacher/dashboard"
        );

        return response.data;
    },


    // ==========================================
    // NOTIFICATIONS
    // ==========================================

    getNotifications: async () => {
        const response = await api.get(
            "/api/notifications"
        );

        return response.data;
    },

    getUnreadNotificationCount: async () => {
        const response = await api.get(
            "/api/notifications/unread-count"
        );

        return response.data;
    },

    markNotificationAsRead: async (id) => {
        const response = await api.put(
            `/api/notifications/${id}/read`
        );

        return response.data;
    },

    markAllNotificationsAsRead: async () => {
        const response = await api.put(
            "/api/notifications/read-all"
        );

        return response.data;
    },

    // ==========================================
    // SUBJECTS
    // ==========================================

    getSubjects: async () => {
        const response = await api.get(
            "/api/teacher/subjects"
        );

        return response.data;
    },


    // ==========================================
    // STUDENTS
    // ==========================================

    getStudents: async () => {
        const response = await api.get(
            "/api/teacher/students"
        );

        return response.data;
    },


    // ==========================================
    // SUBJECT PERFORMANCE
    // ==========================================

    getSubjectPerformance: async () => {
        const response = await api.get(
            "/api/teacher/subject-performance"
        );

        return response.data;
    },


    // ==========================================
    // RESULTS
    // ==========================================

    getResults: async () => {
        const response = await api.get(
            "/api/teacher/results"
        );

        return response.data;
    },


    // ==========================================
    // SAVE / UPDATE RESULTS
    // ==========================================

    saveResults: async (results) => {
        const response = await api.post(
            "/api/teacher/marks/bulk",
            results
        );

        return response.data;
    },


    // ==========================================
    // TEACHER RECHECKING
    // ==========================================

    getRecheckingRequests: async () => {
        const response = await api.get(
            "/api/teacher/rechecking"
        );

        console.log(
            "Teacher Rechecking API:",
            response.data
        );

        return response.data;
    },


    // ==========================================
    // REVIEW RECHECKING
    // ==========================================

    reviewRecheckingRequest: async (
        id,
        approved
    ) => {
        const response = await api.put(
            `/api/teacher/rechecking/${id}/review`,
            {
                approved: approved
            }
        );

        console.log(
            "Review Rechecking API:",
            response.data
        );

        return response.data;
    },


    // ==========================================
    // COMPLETE RECHECKING
    // ==========================================

    completeRechecking: async (
        recheckingSubjectId,
        data
    ) => {
        const response = await api.put(
            `/api/teacher/rechecking/${recheckingSubjectId}/complete`,
            data
        );

        console.log(
            "Complete Rechecking API:",
            response.data
        );

        return response.data;
    },

    deleteRecheckingRequest: async (id) => {
        const response = await api.delete(
            `/api/teacher/rechecking/${id}`
        );

        console.log(
            "Delete Rechecking API:",
            response.data
        );

        return response.data;
    },


    // =========================================================
    // REEVALUATION
    // =========================================================

    getReevaluationRequests: async () => {
        const response = await api.get(
            "/api/teacher/reevaluation"
        );

        return response.data;
    },

    reviewReevaluation: async (id, reviewResult) => {
        const response = await api.put(
            `/api/teacher/reevaluation/${id}/review`,
            null,
            {
                params: {
                    reviewResult: reviewResult
                }
            }
        );

        console.log(
            "Review Reevaluation API:",
            response.data
        );

        return response.data;
    },

    completeReevaluation: async (
        id,
        reviewResult,
        newMarks = null
    ) => {

        const params = {
            reviewResult
        };

        // Send newMarks only when marks are increased
        if (
            reviewResult === "MARKS_INCREASED" &&
            newMarks !== null &&
            newMarks !== undefined
        ) {
            params.newMarks = newMarks;
        }

        const response = await api.put(
            `/api/teacher/reevaluation/${id}/complete`,
            null,
            {
                params
            }
        );

        return response.data;
    },

    deleteReevaluationRequest: async (id) => {
        const response = await api.delete(
            `/api/teacher/reevaluation/${id}`
        );

        return response.data;
    },


    teacherAIChat: async (question) => {
        try {
            const response = await api.post(
                "/api/teacher/ai/chat",
                {
                    question: question
                }
            );

            return response.data;
        } catch (error) {
            console.error("Teacher AI Chat Error:", error);
            throw error;
        }
    },

    teacherAIInsights: async (question) => {
        try {
            const response = await api.post(
                "/api/teacher/ai/insights",
                {
                    question: question
                }
            );

            return response.data;
        } catch (error) {
            console.error("Teacher AI Insights Error:", error);
            throw error;
        }
    },


    // ==========================================
    // PROFILE
    // ==========================================

    getProfile: async () => {

        const response = await api.get(
            "/api/teacher/profile"
        );

        return response.data;
    },

    updateProfile: async (
        firstName,
        lastName,
        email,
        mobile,
        department,
        qualification,
        designation,
        experience,
        profileImage
    ) => {
        const formData = new FormData();

        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append(
            "experience",
            experience || ""
        );

        // ✅ IMPORTANT
        formData.append("department", department || "");

        formData.append("qualification", qualification);
        formData.append("designation", designation);

        if (profileImage instanceof File) {
            formData.append(
                "profileImage",
                profileImage
            );
        }

        try {
            console.log(
                "Department being sent:",
                department
            );

            const response = await api.put(
                "/api/teacher/profile",
                formData
            );

            console.log(
                "Update Teacher Profile Response:",
                response.data
            );

            return response.data;

        } catch (error) {
            console.error(
                "Update Teacher Profile API Error:",
                error.response?.data || error
            );

            throw error;
        }
    },

};

export default teacherService;