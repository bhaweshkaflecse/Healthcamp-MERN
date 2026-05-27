import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginRoutes from "./LoginRoute";
import ClientRoutes from "./ClientRoutes";

const router = createBrowserRouter(
  [
    {
      // If someone visits the root URL, instantly redirect them to login
      path: "/",
      element: <Navigate to="/login" replace />
    },
    ClientRoutes,
    LoginRoutes
  ]
  // The basename configuration has been completely removed!
);

export default router;