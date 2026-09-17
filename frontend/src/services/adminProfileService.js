import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/profile";

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const getAdminProfile = async () => {

    const response = await axios.get(
        API_URL,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const updateAdminProfile = async (profileData) => {

    const response = await axios.put(
        API_URL,
        profileData,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};