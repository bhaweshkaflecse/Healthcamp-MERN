import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "@mantine/dates/styles.css";
const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
      },
    },
  });

  return (
    <>
      {/* <AuthProvider> */}
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </QueryClientProvider>
      {/* </AuthProvider> */}
    </>
  );
};

export default App;
