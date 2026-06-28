import { createTheme } from "@mantine/core";

/**
 * Mantine cannot consume the CSS custom-property palette as a typed color tuple.
 * Keep these values aligned with styles/variables.css until the theme is generated
 * from a shared build-time source.
 */
export const appTheme = createTheme({
  primaryColor: "blue",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontFamilyMonospace:
    "JetBrains Mono, ui-monospace, SFMono-Regular, Consolas, monospace",
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
