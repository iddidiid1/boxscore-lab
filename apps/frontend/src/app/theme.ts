import { Button, createTheme } from "@mantine/core";

/**
 * Mantine cannot consume the CSS custom-property palette as a typed color tuple.
 * Keep these values aligned with styles/variables.css until the theme is generated
 * from a shared build-time source.
 */
export const appTheme = createTheme({
  primaryColor: "teal",
  primaryShade: { light: 4, dark: 4 },
  fontFamily:
    "'Space Grotesk', 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif",
  fontFamilyMonospace:
    "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace",
  headings: {
    fontFamily:
      "'Space Grotesk', 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif"
  },
  radius: {
    xs: "4px",
    sm: "4px",
    md: "16px",
    lg: "16px",
    xl: "24px"
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "xl",
        size: "md"
      }
    })
  },
  colors: {
    teal: [
      "#e0fff9",
      "#b3fff0",
      "#80ffe6",
      "#4dffdb",
      "#3cffd0",
      "#2ccfaa",
      "#1fa080",
      "#127558",
      "#074d35",
      "#012618"
    ]
  }
});
