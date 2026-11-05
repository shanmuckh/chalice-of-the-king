import { createContext } from "react";
import type { RoomData } from "../../../shared/types/types";

const AppStateContext = createContext<{
  roomData: RoomData | null;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData | null>>;
  myPlayerId: string | null;
  setMyPlayerId: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

export default AppStateContext;
