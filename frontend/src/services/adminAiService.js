import axios from "axios";

const API_URL = "http://localhost:8080/api/student/ai";

export const adminAiChat = async (question) => {
    const token = sessionStorage.getItem("token");

    console.log("ADMIN AI TOKEN:", token);

    const response = await axios.post(
        `${API_URL}/admin/chat`,
        {
            question: question,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};