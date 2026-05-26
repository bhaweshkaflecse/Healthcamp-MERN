import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import theme from "./theme";
import "react-toastify/dist/ReactToastify.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider
      // @ts-ignore
      theme={theme}
    >
      {/* <ErrorBoundary> */}
      <App />
      {/* </ErrorBoundary> */}
    </MantineProvider>
  </React.StrictMode>
);
