import { createBrowserRouter } from "react-router-dom";
import Layout from "./src/features/Layout";
import Login from "./src/pages/Login/index";
import Home from "./src/pages/Home/index";
import Settings from "./src/pages/Settings/index";

export const routers = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Login />,
        path: "/login/",
      },
      {
        element: <Home />,
        path: "/",
      },
      {
        element: <Settings />,
        path: "/settings/",
      },
    ],
  },
]);