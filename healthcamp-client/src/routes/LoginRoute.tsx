import { lazy } from "react";
import Loadable from "../components/Loadable";
import SystemAdmin from "../auth/SystemAdmin";

const AuthLogin = Loadable(lazy(() => import("../auth/Login")));
const AuthRegister = Loadable(lazy(() => import("../auth/Register")));
const ForgotPassword = Loadable(lazy(() => import("../auth/ForgotPassword")))
const UpdatePassword = Loadable(lazy(() => import("../auth/UpdatePassword")))

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: "/",
  children: [
    {
      path: "login",
      element: <AuthLogin />,
    },
    {
      path: "register",
      element: <AuthRegister />,
    },
    {
      path: "system-admin",
      element: <SystemAdmin />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "update-password/:token",
      element: <UpdatePassword />,
    }
  ],
};

export default LoginRoutes;
