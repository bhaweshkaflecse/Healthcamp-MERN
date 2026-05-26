import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';
import "react-big-calendar/lib/css/react-big-calendar.css"
import { MantineProvider } from "@mantine/core";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider
      // @ts-ignore

      theme={theme}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
