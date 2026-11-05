import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import HomeScreen from "../pages/HomeScreen";
import MultiplayerLobby from "../pages/MultiPlayerLobby";
import MultiPlayerMode from "../pages/MultiPlayerMode";
import AppStateContext from "../contexts/AppStateContext";

export const HomeRouteHandler = () => {
  const navigate = useNavigate();

  const handleSelect = (mode: string) => {
    switch (mode) {
      case "Single Player":
        navigate("/singleplayer");
        break;
      case "Multi Player":
        navigate("/multiplayerlobby");
        break;
      case "How to Play":
        navigate("/how-to-play");
        break;
      case "Lore":
        navigate("/lore");
        break;
      case "Credits":
        navigate("/credits");
        break;
      default:
        break;
    }
  };

  return <HomeScreen onSelect={handleSelect} />;
};

export const MultiplayerLobbyWrapper = () => {
  const state = useContext(AppStateContext);
  if (!state) return null;
  const { setRoomData, setMyPlayerId } = state;

  return (
    <MultiplayerLobby
      setRoomData={setRoomData}
      setMyPlayerId={setMyPlayerId}
    />
  );
};

export const MultiPlayerModeWrapper = () => {
  const state = useContext(AppStateContext);
  if (!state) return null;
  const { roomData, myPlayerId } = state;

  return <MultiPlayerMode room={roomData} myPlayerId={myPlayerId} />;
};
