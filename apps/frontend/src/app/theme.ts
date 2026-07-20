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
    sm: "8px",
    md: "10px",
    lg: "12px",
    xl: "12px"
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "xs",
        size: "md"
      }
    })
  },
  colors: {
    teal: [
      "#e0fff9",
      "#b3fff0",
      "#88f8de",
      "#62f5d2",
      "#43f2c8",
      "#2ccfaa",
      "#1fa080",
      "#127558",
      "#074d35",
      "#012618"
    ]
  }
});
