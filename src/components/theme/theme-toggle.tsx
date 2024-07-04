import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
// import { Button } from "../ui/button"

// import { Button } from "@/compon"
import { Button } from "@/components/ui/button";
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  React.useEffect(() => {
    document.body.classList.forEach((className) => {
      if (className.match(/^theme.*/)) {
        document.body.classList.remove(className);
      }
    });

    const theme = "themes";
    if (theme) {
      return document.body.classList.add(`${theme}`);
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
