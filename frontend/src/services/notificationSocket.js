import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectNotificationSocket = (
    onNotification
) => {

    const token = sessionStorage.getItem("token");

    stompClient = new Client({

        brokerURL: "ws://localhost:8080/ws",

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,

        onConnect: () => {

            console.log("WebSocket connected");

            stompClient.subscribe(
                "/user/queue/notifications",
                (message) => {

                    const notification =
                        JSON.parse(message.body);

                    console.log(
                        "New notification:",
                        notification
                    );

                    onNotification(notification);
                }
            );
        },

        onStompError: (frame) => {

            console.error(
                "STOMP error:",
                frame.headers["message"]
            );

            console.error(
                "Details:",
                frame.body
            );
        },

        onWebSocketError: (error) => {

            console.error(
                "WebSocket error:",
                error
            );
        },

        onWebSocketClose: () => {

            console.log(
                "WebSocket disconnected"
            );
        }
    });

    stompClient.activate();
};


export const disconnectNotificationSocket = () => {

    if (stompClient) {

        stompClient.deactivate();

        stompClient = null;
    }
};