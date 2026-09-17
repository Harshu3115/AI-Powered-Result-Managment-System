import api from "./api";

// =========================================================
// STUDENT API
// =========================================================

const API_URL = "/student";
const NOTIFICATION_API_URL = "/notifications";

// =========================================================
// STUDENT PROFILE
// =========================================================

const getProfile = async () => {
    const response = await api.get(`${API_URL}/profile`);
    return response.data;
};

const updateProfile = async (profileData) => {
    const response = await api.put(
        `${API_URL}/profile`,
        profileData
    );
    return response.data;
};

// =========================================================
// STUDENT RESULTS
// =========================================================

const getResults = async () => {
    const response = await api.get(`${API_URL}/results`);
    return response.data;
};

// =========================================================
// PERFORMANCE
// =========================================================

const getPerformanceAnalysis = async () => {
    const response = await api.get(
        `${API_URL}/ai/performance-analysis`
    );
    return response.data;
};

// =========================================================
// SUBJECT ANALYSIS
// =========================================================

const getSubjectAnalysis = async () => {
    const response = await api.get(
        `${API_URL}/ai/subjects`
    );
    return response.data;
};

// =========================================================
// STUDY PLAN
// =========================================================

const getStudyPlan = async () => {
    const response = await api.get(
        `${API_URL}/ai/study-plan`
    );
    return response.data;
};

// =========================================================
// CAREER RECOMMENDATION
// =========================================================

const getCareerRecommendation = async () => {
    const response = await api.get(
        `${API_URL}/ai/career`
    );
    return response.data;
};

// =========================================================
// AI CHAT
// =========================================================

const chat = async (question) => {
    const response = await api.post(
        `${API_URL}/ai/chat`,
        {
            question,
        }
    );
    return response.data;
};

// =========================================================
// STUDENT DASHBOARD
// =========================================================

const getDashboard = async () => {
    const response = await api.get(
        `${API_URL}/results/dashboard`
    );
    return response.data;
};

// =========================================================
// RECHECKING
// =========================================================

const submitRechecking = async (request) => {
    const response = await api.post(
        `${API_URL}/rechecking`,
        request
    );
    return response.data;
};

const getRecheckingRequests = async () => {
    const response = await api.get(
        `${API_URL}/rechecking/my-requests`
    );
    return response.data;
};

const cancelRechecking = async (id) => {
    const response = await api.delete(
        `${API_URL}/rechecking/${id}`
    );
    return response.data;
};

// =========================================================
// REEVALUATION
// =========================================================

const submitReevaluation = async (request) => {
    const response = await api.post(
        `${API_URL}/reevaluation`,
        request
    );
    return response.data;
};

const getReevaluationRequests = async () => {
    const response = await api.get(
        `${API_URL}/reevaluation/my-requests`
    );
    return response.data;
};

const cancelReevaluation = async (id) => {
    const response = await api.delete(
        `${API_URL}/reevaluation/${id}`
    );
    return response.data;
};

// =========================================================
// NOTIFICATIONS
// =========================================================

const getNotifications = async () => {
    const response = await api.get(
        NOTIFICATION_API_URL
    );
    return response.data;
};

const getUnreadNotificationCount = async () => {
    const response = await api.get(
        `${NOTIFICATION_API_URL}/unread-count`
    );
    return response.data;
};

const markNotificationAsRead = async (id) => {
    const response = await api.put(
        `${NOTIFICATION_API_URL}/${id}/read`,
        {}
    );
    return response.data;
};

const markAllNotificationsAsRead = async () => {
    const response = await api.put(
        `${NOTIFICATION_API_URL}/read-all`,
        {}
    );
    return response.data;
};

// =========================================================
// EXPORT
// =========================================================

export default {
    // Profile
    getProfile,
    updateProfile,

    // Results
    getResults,

    // AI
    getPerformanceAnalysis,
    getSubjectAnalysis,
    getStudyPlan,
    getCareerRecommendation,
    chat,

    // Dashboard
    getDashboard,

    // Rechecking
    submitRechecking,
    getRecheckingRequests,
    cancelRechecking,

    // Reevaluation
    submitReevaluation,
    getReevaluationRequests,
    cancelReevaluation,

    // Notifications
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};