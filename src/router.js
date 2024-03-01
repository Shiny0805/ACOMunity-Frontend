import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Dashboard = lazy(() => import("pages/Dashboard"));
const MintNFT = lazy(() => import("pages/MintNFT"));
const NotFound = lazy(() => import("pages/Notfound"));
const Explorer = lazy(() => import("pages/Explorer"));
const NFToffer = lazy(() => import("pages/NFToffer"));
const Game = lazy(() => import("pages/ComingSoon"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/mintnft",
    element: <MintNFT />,
  },
  {
    path: "/explorer",
    element: <Explorer />,
  },
  {
    path: "/game",
    element: <Game />,
  },
  {
    path: "/nftoffer/:id",
    element: <NFToffer />
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
