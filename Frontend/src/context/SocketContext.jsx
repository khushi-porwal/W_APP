import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";

export const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token && user) {
            const socketInstance = connectSocket(token);
            setSocket(socketInstance);

            if (socketInstance) {
                const handleConnect = () => setIsConnected(true);
                const handleDisconnect = () => setIsConnected(false);

                socketInstance.on("connect", handleConnect);
                socketInstance.on("disconnect", handleDisconnect);

                // Global Listener: Customer & Admin Real-time Notifications
                const handleGlobalNotification = (data) => {
                    console.log("[Socket.IO] Notification received:", data);
                    toast.success(data.message || "New notification received!", {
                        duration: 5000,
                        icon: "🔔"
                    });
                };

                socketInstance.on("notification", handleGlobalNotification);

                return () => {
                    socketInstance.off("connect", handleConnect);
                    socketInstance.off("disconnect", handleDisconnect);
                    socketInstance.off("notification", handleGlobalNotification);
                };
            }
        } else {
            disconnectSocket();
            setSocket(null);
            setIsConnected(false);
        }
    }, [token, user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected, getSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
