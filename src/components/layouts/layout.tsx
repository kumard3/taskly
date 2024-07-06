import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Inbox,
  CircleDot,
  Layers,
  FolderKanban,
  Users,
  Calendar,
  UserPlus,
  GitBranch,
  Github,
  LucideIcon,
  Home,
  CheckCircle,
  CheckCheckIcon,
  CheckCircle2Icon,
} from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href?: string;
  }[];
}

interface LayoutProps {
  children: React.ReactNode;
}

export function HybridLayout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  return (
    <div className="flex h-screen bg-background font-sans text-white">
      <TooltipProvider>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full min-h-1 items-stretch"
        >
          <ResizablePanel
            defaultSize={200}
            collapsedSize={4}
            collapsible={true}
            minSize={10}
            maxSize={14}
            onCollapse={() => setIsCollapsed(true)}
            onExpand={() => setIsCollapsed(false)}
            className={cn(
              isCollapsed &&
                "w-full min-w-[50px] max-w-48 transition-all duration-300 ease-in-out",
            )}
          >
            <aside className="h-full p-4 hover:border-r hover:border-gray-800">
              <div className="mb-6 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-md bg-purple-600"></div>
                <span className="text-sm font-semibold">Workspace</span>
              </div>

              <Nav
                isCollapsed={isCollapsed}
                links={[
                  {
                    title: "Home",
                    icon: Home,
                    variant: "default",
                    href: "/dashboard/",
                  },
                  {
                    title: "My Task",
                    icon: CheckCircle2Icon,
                    variant: "ghost",
                    href: "/dashboard/home",
                  },
                  // {
                  //   title: "Projects",
                  //   label: "",
                  //   icon: FolderKanban,
                  //   variant: "ghost",
                  //   href: "/dashboard/inbox",
                  // },
                  // {
                  //   title: "Teams",
                  //   label: "23",
                  //   icon: Users,
                  //   variant: "ghost",
                  //   href: "/dashboard/inbox",
                  // },
                ]}
              />
            </aside>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className=" " minSize={30} defaultSize={445}>
            <div>
              <main className="flex flex-1 flex-col  ">{children}</main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href ?? ""}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href ?? ""}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
