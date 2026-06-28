import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import App from "./app/App";
import { appTheme } from "./app/theme";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={appTheme}>
      <App />
    </MantineProvider>
  </StrictMode>
);
