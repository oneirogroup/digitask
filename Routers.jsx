import { createBrowserRouter } from "react-router-dom";
import Layout from "./src/features/Layout";
import Login from "./src/pages/Login/index";

export const routers = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Login />,
        path: "/login/",
      },
    ],
  },
]);