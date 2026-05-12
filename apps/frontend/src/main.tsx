import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import App from "./app/App";
import "./styles/global.css";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: {
    fontFamily:
      "Hanken Grotesk, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  },
  radius: {
    xs: "2px",
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px"
  },
  colors: {
    blue: [
      "#eef5ff",
      "#d8e7ff",
      "#adc6ff",
      "#82a6ff",
      "#5a8aff",
      "#3b82f6",
      "#256de0",
      "#1d59b8",
      "#164691",
      "#0f3268"
    ]
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>
);
