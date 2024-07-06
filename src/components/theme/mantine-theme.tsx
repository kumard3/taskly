import { MantineProvider } from "@mantine/core";
import React, { ReactNode } from "react";
import { linearTheme } from "./theme";
import { useTheme } from "next-themes";

export default function MantineThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <>
      {" "}
      <MantineProvider
        theme={{ ...linearTheme }}
        defaultColorScheme={theme as "light" | "dark"}
      >
        {children}
      </MantineProvider>
    </>
  );
}
