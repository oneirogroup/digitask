import { createBrowserRouter } from "react-router-dom";

import Layout from "./src/features/Layout";
import Chat from "./src/pages/Chat";
import Contact from "./src/pages/Contact/index";
import Employees from "./src/pages/Employees/index";
import Home from "./src/pages/Home/index";
import Login from "./src/pages/Login/index";
import OneTimePassword from "./src/pages/OneTimePassword/index";
import Performance from "./src/pages/Performance/index";
import Profile from "./src/pages/Profile";
import RePassword from "./src/pages/RePassword/index";
import Report from "./src/pages/Report/index.jsx";
import SetNewPassword from "./src/pages/SetNewPassword/index";
import Settings from "./src/pages/Settings/index";
import Tasks from "./src/pages/Tasks/index";
import Warehouse from "./src/pages/Warehouse/index";

export const routers = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Login />,
        path: "/login"
      },
      {
        element: <RePassword />,
        path: "/re-password"
      },
      {
        element: <OneTimePassword />,
        path: "/re-password-code"
      },
      {
        element: <Home />,
        path: "/"
      },
      {
        element: <Tasks />,
        path: "/tasks/"
      },
      {
        element: <Warehouse />,
        path: "/warehouse/"
      },
      {
        element: <Performance />,
        path: "/performance/"
      },
      {
        element: <Employees />,
        path: "/employees/"
      },
      {
        element: <Settings />,
        path: "/settings/"
      },
      {
        element: <Contact />,
        path: "/contact/"
      },
      {
        element: <Profile />,
        path: "/profile/"
      },
      {
        element: <SetNewPassword />,
        path: "/set-new-password/"
      },
      {
        element: <Chat />,
        path: "/chat/"
      },
      {
        element: <Report />,
        path: "/report/"
      }
    ]
  }
]);
