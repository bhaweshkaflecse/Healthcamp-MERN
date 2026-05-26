import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/err/NotFound";
import AuthRoute from "./AuthRoute";
import openRoutes from "./OpenRoute";
import { ErrorRoutes } from "./ErrorRoute";

const router = createBrowserRouter(
  [
    AuthRoute,
    openRoutes,
    ErrorRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: '/admin', // 👈 Change this from /dashboardmain to /admin
  }
);
export default router;
