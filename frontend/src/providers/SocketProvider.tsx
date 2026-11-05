
import { useEffect, useState } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { Socket, io } from "socket.io-client";
import { reconnectRoom } from "../utils/socket";
import { getOrCreatePlayerId, getStoredRoomId } from "../utils/reconnection";
const URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3001";


export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // Lazy init so a new Socket/Manager isn't constructed on every render
  const [socket] = useState<Socket>(() => io(URL, { autoConnect: false, transports: ["websocket"] }));
  const [socketId, setSocketId] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    // The server emits "connected" on every (re)connection, so this also
    // covers automatic reconnects after a network drop.
    socket.on("connected", (socketId: string) => {
      setSocketId(socketId);
      setIsReconnecting(false);
      const roomId = getStoredRoomId();
      if (roomId) {
        const playerId = getOrCreatePlayerId();
        reconnectRoom(socket, roomId, playerId);
      }
    });

    socket.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        setIsReconnecting(true);
      }
    });

    // In socket.io v4, reconnection lifecycle events fire on the Manager (socket.io)
    const onManagerReconnectFailed = () => setIsReconnecting(false);
    socket.io.on("reconnect_failed", onManagerReconnectFailed);


    return () => {
      socket.off("connected");
      socket.off("disconnect");
      socket.io.off("reconnect_failed", onManagerReconnectFailed);
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, socketId, isReconnecting }}>
      {children}
    </SocketContext.Provider>
  );
};