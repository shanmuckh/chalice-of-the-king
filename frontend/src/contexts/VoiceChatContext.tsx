import { createContext, useContext } from "react";

export type VoiceChatContextType = {
  muteMap: Record<string, boolean>;
  setUserMuted: (id: string, value: boolean) => void;
  remoteVolume: Record<string, number>;
  setUserVolume: (id: string, value: number) => void;
}

export const VoiceChatContext = createContext<VoiceChatContextType | null>(null);

export const useVoiceChatContext = () => {
  const context = useContext(VoiceChatContext);
  if (!context) throw new Error("useVoiceChatContext must be used inside a VoiceChatProvider");
  return context;
};


