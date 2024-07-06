import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/tiptap/styles.css";
import "@/styles/globals.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import MantineThemeProvider from "@/components/theme/mantine-theme";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div>
      <Head>
        <title>Taskly - Modern Project Management Tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <MantineThemeProvider>
              <main className={GeistSans.className}>
                <Component {...pageProps} />
              </main>
            </MantineThemeProvider>
          </ThemeProvider>
        </>
        <Toaster />
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
