import axios from "axios";

const API_URL =
    "http://localhost:8080/api/admin/notifications";


// =====================================================
// GET ADMIN NOTIFICATIONS
// =====================================================

export const getAdminNotifications = async () => {

    const token =
        sessionStorage.getItem("token");

    const response = await axios.get(
        API_URL,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


// =====================================================
// MARK ONE AS READ
// =====================================================

export const markAdminNotificationAsRead =
    async (id) => {

        const token = sessionStorage.getItem("token");

        const response = await axios.put(
            `${API_URL}/${id}/read`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    };


// =====================================================
// MARK ALL AS READ
// =====================================================

export const markAllAdminNotificationsAsRead =
    async () => {

        const token = sessionStorage.getItem("token");

        const response = await axios.put(
            `${API_URL}/read-all`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    };


// =====================================================
// DELETE
// =====================================================

export const deleteAdminNotification =
    async (id) => {

        const token = sessionStorage.getItem("token");

        const response = await axios.delete(
            `${API_URL}/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    };