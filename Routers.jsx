import { createBrowserRouter } from "react-router-dom";
import Layout from "./src/features/Layout";
import Home from "./src/pages/Home";

export const routers = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Home />,
        path: "/",
      },
    ],
  },
]);