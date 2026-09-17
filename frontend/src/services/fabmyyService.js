import api from "./api";

const fabmyyService = {
    chat: async (question) => {
        const response = await api.post(
            "/fabmyy/chat",
            {
                question: question
            }
        );

        console.log("Fabmyy Response:", response.data);

        return response.data;
    }
};

export default fabmyyService;