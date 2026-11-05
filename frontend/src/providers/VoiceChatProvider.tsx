import { useSocket } from "../contexts/SocketContext";
import { useVoiceChat } from "../hooks/useVoiceChat";
import { VoiceChatContext } from "../contexts/VoiceChatContext";

export const VoiceChatProvider = ({
  roomId,
  voiceChatEnabled,
  children,
}: {
  roomId: string;
  voiceChatEnabled: boolean;
  children: React.ReactNode;
}) => {
  const { socket, socketId } = useSocket();
  const voiceChatValues = useVoiceChat(socket, socketId, roomId, voiceChatEnabled);

  return (
    <VoiceChatContext.Provider value={voiceChatValues}>
      {children}
    </VoiceChatContext.Provider>
  );
};