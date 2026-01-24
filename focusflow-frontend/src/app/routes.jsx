import Home from "../pages/Home";
import Player from "../pages/Player";
import Setup from "../pages/Setup";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/setup", element: <Setup /> },
  { path: "/player", element: <Player /> },
];
