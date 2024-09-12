import {
  createTheme,
  type MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import React, { type ReactNode } from "react";
import { useTheme } from "next-themes";
const myColor: MantineColorsTuple = [
  "#ffffff", // Lightest shade, typically used for backgrounds
  "#f5f7fa", // Slightly darker, often used for secondary backgrounds
  "#e5e9f0", // Light gray for borders or secondary backgrounds
  "#c0c7d1", // Mid gray, used for subtle accents
  "#8892b0", // Medium grayish blue
  "#606b85", // Darker grayish blue
  "#4b566b", // Darker blue
  "#373e4a", // Darker still, used for text on light backgrounds
  "#2c323c", // Very dark blue, used for text on light backgrounds
  "#00000", // Darkest shade, used for text or backgrounds in dark mode
];

const Mytheme = createTheme({
  colors: {
    myColor,
  },
});
export default function MantineThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <MantineProvider
      theme={Mytheme}
      defaultColorScheme={theme as "light" | "dark"}
    >
      {children}
    </MantineProvider>
  );
}
