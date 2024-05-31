import { createBrowserRouter } from "react-router-dom";
import Layout from "./src/features/Layout";
import Login from "./src/pages/Login/index";
import Home from "./src/pages/Home/index";
import Tasks from "./src/pages/Tasks/index";
import Warehouse from "./src/pages/Warehouse/index";
import Performance from "./src/pages/Performance/index";
import Employees from "./src/pages/Employees/index";
import Settings from "./src/pages/Settings/index";
import Contact from "./src/pages/Contact/index";

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
        element: <Tasks />,
        path: "/tasks/",
      },
      {
        element: <Warehouse />,
        path: "/warehouse/",
      },
      {
        element: <Performance />,
        path: "/performance/",
      },
      {
        element: <Employees />,
        path: "/employees/",
      },
      {
        element: <Settings />,
        path: "/settings/",
      },
      {
        element: <Contact />,
        path: "/contact/",
      },
    ],
  },
]);