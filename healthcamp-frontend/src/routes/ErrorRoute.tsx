import ErrLayout from "../layout/err-layout/err-layout";
import NotFound from "../pages/err/NotFound";
import ServerError from "../pages/err/ServerError";

export const ErrorRoutes = {
  path: "/error",
  element: <ErrLayout />,
  children: [
    {
      path: "serverError",
      element: <ServerError />,
    },
    {
      path: "notFoundError",
      element: <NotFound />,
    },
    
  ],
};
