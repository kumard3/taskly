import React from "react";

import { CheckCircle2Icon, type LucideIcon, Home } from "lucide-react";

import { TbEdit } from "react-icons/tb";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar } from "@mantine/core";

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
  const session = useSession();

  return (
    <div className="flex h-screen bg-background font-sans text-white">
      <TooltipProvider>
        <aside className="h-full w-52 p-2">
          <div className=" mb-6 flex items-center justify-between space-x-1">
            <div className=" flex items-center space-x-2">
              <Avatar size={25} src={session.data?.user.image} />
              <span className="text-xs font-semibold text-white">
                {session.data?.user.name}
              </span>
            </div>
            <div>
              <Button variant="ghost" className="h-auto w-auto  p-0">
                <TbEdit />
              </Button>
            </div>
          </div>

          <Nav
            isCollapsed={false}
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
        <div className="flex h-full w-full   flex-1 flex-col  ">
          <main className="relative mb-2 ml-0 mr-2 mt-2 flex flex-1 flex-col  items-stretch overflow-auto rounded border bg-secondary ">
            {children}
          </main>
        </div>
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
