import Loadable from "../components/Loadable";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Unauthorized from "../pages/err/Unauthorized";
import ForgotPassword from "../pages/auth/ForgotPassword";

const SystemAdmin = Loadable(lazy(() => import("../pages/auth/SystemAdmin")));
const UpdatePassword = Loadable(
  lazy(() => import("../pages/auth/UpdatePassword"))
);
const AuthLogin = Loadable(lazy(() => import("../pages/auth/Login")));

const openRoutes: RouteObject = {
  path: "/",
  children: [
    {
      path: "login",
      element: <AuthLogin />,
    },
    {
      path: "system-admin",
      element: <SystemAdmin />,
    },

    {
      path: "update-password/:token",
      element: <UpdatePassword />,
    },
    {
      path: "unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
  ],
};
export default openRoutes;
