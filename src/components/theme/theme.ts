// // theme.js
// export const lightTheme = {
//   colorScheme: "light",
//   colors: {
//     background: "#FFFFFF",
//     foreground: "#1A1A1A",
//     card: "#FFFFFF",
//     cardForeground: "#1A1A1A",
//     popover: "#FFFFFF",
//     popoverForeground: "#1A1A1A",
//     primary: "#1A1A1A",
//     primaryForeground: "#FFFFFF",
//     secondary: "#FAFBFC",
//     secondaryForeground: "#1A1A1A",
//     muted: "#FAFBFC",
//     mutedForeground: "#6B7280",
//     accent: "#3B82F6",
//     accentForeground: "#FFFFFF",
//     destructive: "#EF4444",
//     destructiveForeground: "#FFFFFF",
//     border: "#E5E7EB",
//     input: "#E5E7EB",
//     ring: "#1A1A1A",
//   },
//   radius: "0.5rem",
// };

// export const darkTheme = {
//   colorScheme: "dark",
//   colors: {
//     background: "#18181B",
//     foreground: "#FFFFFF",
//     card: "#18181B",
//     cardForeground: "#FFFFFF",
//     popover: "#18181B",
//     popoverForeground: "#FFFFFF",
//     primary: "#FFFFFF",
//     primaryForeground: "#1A1A1A",
//     secondary: "#1F2937",
//     secondaryForeground: "#FFFFFF",
//     muted: "#1F2937",
//     mutedForeground: "#9CA3AF",
//     accent: "#3B82F6",
//     accentForeground: "#FFFFFF",
//     destructive: "#DC2626",
//     destructiveForeground: "#FFFFFF",
//     border: "#374151",
//     input: "#374151",
//     ring: "#1A1A1A",
//   },
//   radius: "0.5rem",
// };

import { MantineThemeOverride } from "@mantine/core";

export const linearTheme: MantineThemeOverride = {
  colors: {
    dark: [
      "#FFFFFF",
      "#F4F4F5",
      "#E4E4E7",
      "#D4D4D8",
      "#A1A1AA",
      "#71717A",
      "#52525B",
      "#3F3F46",
      "#27272A",
      "#18181B",
    ],
  },
  primaryColor: "dark",
  primaryShade: { light: 6, dark: 8 },
  defaultRadius: "md",
  components: {
    Button: {
      styles: (theme) => ({
        root: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color:
            theme.colorScheme === "dark" ? theme.white : theme.colors.dark[9],
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
          },
        },
      }),
    },
  },
};
