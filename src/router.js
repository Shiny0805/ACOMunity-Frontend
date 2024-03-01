import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Home = lazy(() => import("pages/Home"));
const AboutUs = lazy(() => import("pages/AboutUs"));
const AgemsToken = lazy(() => import("pages/AgemsToken"));
const Technology = lazy(() => import("pages/Technology"));
const Community = lazy(() => import("pages/Community"));
const Blog = lazy(() => import("pages/Blog"));
const Partnerships = lazy(() => import("pages/Partnerships"));
const NotFound = lazy(() => import("pages/Notfound"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
  },
  {
    path: "/agems-token",
    element: <AgemsToken />,
  },
  {
    path: "/technology",
    element: <Technology />,
  },
  {
    path: "/community",
    element: <Community />
  },
  {
    path: "/blog",
    element: <Blog />
  },
  {
    path: "/partnerships",
    element: <Partnerships />
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
