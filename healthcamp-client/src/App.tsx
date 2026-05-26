import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "@mantine/core/styles.css";
import { AuthProvider } from "./providers/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { KycContextProvider } from "./providers/context/KycContext";

function App() {
  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      }
    }
  });

  return (
    <AuthProvider>
      <KycContextProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position="bottom-right"/>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </QueryClientProvider>
      </KycContextProvider>
    </AuthProvider>
  );
}

export default App;
