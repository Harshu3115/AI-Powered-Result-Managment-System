import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";


const login = async (data) => {

    const response = await axios.post(
        `${API_URL}/login`,
        data
    );

    return response.data;
};


const register = async (data) => {

    const response = await axios.post(
        `${API_URL}/register`,
        data
    );

    return response.data;
};


const forgotPassword = async (data) => {

    const response = await axios.post(
        `${API_URL}/forgot-password`,
        data
    );

    return response.data;
};


const resetPassword = async (data) => {

    const response = await axios.post(
        `${API_URL}/reset-password`,
        data
    );

    return response.data;
};


const authService = {
    login,
    register,
    forgotPassword,
    resetPassword,
};


export default authService;