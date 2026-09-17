
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");

        config.headers = config.headers || {};

        if (token && token !== "null" && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
            console.warn("JWT token not found in sessionStorage");
        }

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("role");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;