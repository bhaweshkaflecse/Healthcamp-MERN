import { createBrowserRouter } from "react-router-dom";
import LoginRoutes from "./LoginRoute";
import ClientRoutes from "./ClientRoutes";

const router = createBrowserRouter([
  ClientRoutes,
  LoginRoutes
]);

export default router;
