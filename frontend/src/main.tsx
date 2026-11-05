import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import SinglePlayerMode from "./pages/SinglePlayerMode";
import HowToPlay from "./pages/HotToPlay";
import Lore from "./pages/Lore";
import Credits from "./pages/Credits";
import AppLayout from "./AppLayout"; 

import {
  HomeRouteHandler,
  MultiplayerLobbyWrapper,
  MultiPlayerModeWrapper,
  
} from "./wrappers/RouteWrappers";

import MultiplayerWrapper from "./wrappers/MultiplayerWrapper";

import "./index.css";
import Tutorial from "./pages/Tutorial";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomeRouteHandler /> },
      { path: "singleplayer", element: <SinglePlayerMode /> },
      {
        element: <MultiplayerWrapper />,
        children: [
          { path: "multiplayerlobby", element: <MultiplayerLobbyWrapper /> },
          { path: "multiplayer", element: <MultiPlayerModeWrapper /> },
        ],
      },
      { path: "tutorial" , element: <Tutorial />},
      { path: "how-to-play", element: <HowToPlay /> },
      { path: "lore", element: <Lore /> },
      { path: "credits", element: <Credits /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
