import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  Loader,
  Modal,
  Skeleton,
} from "@mantine/core";
import { Button, buttonVariants } from "../ui/button";
import { useState, type ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ScrollArea } from "../ui/scroll-area";
import { cn, hashStringToColorHex } from "@/lib/utils";
import { Bell, CalendarDays, CheckCircle2, Home, Plus } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { nanoid } from "nanoid";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const iconStyles = "mr-2 h-4 w-4";

export function MainLayout({
  children,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [task, setTask] = useState("");
  // const [showInput, setShowInput] = useState(false);

  const [opened, { open, close }] = useDisclosure();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { status, data: sessionData } = useSession();
  const {
    data: allProjects,
    isLoading: isLoadingProjects,
    refetch,
  } = api.project.allProjects.useQuery();

  const { mutate } = api.project.createProject.useMutation({
    onSuccess() {
      void refetch();
      close();
      setTask("");
      toast.success("Project created");
    },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (task.length >= 1) {
        mutate({
          name: task,
        });
      }
    }
  };
  if (status === "unauthenticated") {
    void signIn();
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-custom-blue text-2xl">
            Redirecting to Login Page
          </h1>
          <Loader />
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 250,
            breakpoint: "sm",
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
          padding="md"
        >
          <AppShell.Header className="bg-card text-card-foreground">
            <Group
              h="100%"
              px="md"
              className="relative flex w-full items-center justify-between"
            >
              <div className="flex items-center ">
                <Burger
                  opened={mobileOpened}
                  onClick={toggleMobile}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Burger onClick={toggleDesktop} visibleFrom="sm" size="sm" />{" "}
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full border px-4 py-2">
                    <button className="flex gap-x-2">
                      <div className="flex  h-6 w-6 items-center justify-center rounded-full bg-orange-700">
                        <Plus className={cn("h-4 w-4")} />
                      </div>
                      <p>Create</p>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" className="mt-3">
                    <DropdownMenuItem className="text-base">
                      {" "}
                      <div className="flex items-center">
                        <CheckCircle2 className={iconStyles} />
                        <p>Task</p>
                      </div>{" "}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-base"
                      onClick={() => open()}
                    >
                      <div className="flex items-center">
                        <CalendarDays className={iconStyles} />
                        <p>Project</p>
                      </div>{" "}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button>
                      <Avatar>
                        <AvatarImage src={sessionData?.user?.image as string} />
                        <AvatarFallback>
                          {sessionData?.user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => void signOut()}
                      className="cursor-pointer"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p="xs" className="bg-card text-card-foreground ">
            <>
              <div className="space-y-4 py-4">
                <div className="py-2">
                  <div className="space-y-1">
                    <Link
                      href="/"
                      className={cn(
                        "w-full !justify-start",

                        buttonVariants({
                          variant:
                            router.asPath === "/" ? "secondary" : "ghost",
                        }),
                      )}
                    >
                      <>
                        <Home className={iconStyles} />
                        Home
                      </>
                    </Link>
                    <Link
                      href="/board"
                      className={cn(
                        "w-full !justify-start",

                        buttonVariants({
                          variant: router.asPath.includes("/board")
                            ? "secondary"
                            : "ghost",
                        }),
                      )}
                    >
                      <>
                        <CheckCircle2 className={iconStyles} />
                        My Tasks
                      </>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start">
                      <>
                        <Bell className={iconStyles} />
                        Inbox
                      </>
                    </Button>
                  </div>
                </div>

                <div className="py-2">
                  <div className="flex items-start justify-between">
                    <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                      Projects
                    </h2>
                    <button
                      onClick={() => open()}
                      className="flex items-center  justify-center rounded py-1 pl-1 hover:bg-accent"
                    >
                      <Plus className={iconStyles} />
                    </button>
                  </div>
                  <ScrollArea className="h-[300px] px-1">
                    <div className="space-y-1 p-2">
                      {isLoadingProjects && (
                        <>
                          {" "}
                          {Array(5)
                            .fill(0)
                            .map((_, index) => (
                              <Skeleton key={index} h={15} mt="sm" animate />
                            ))}
                        </>
                      )}
                      {allProjects?.map((project) => (
                        <>
                          <Link
                            key={nanoid()}
                            href={`/project/${project.id}`}
                            className={cn(
                              "w-full !justify-start",

                              buttonVariants({
                                variant: router.asPath.includes(
                                  `/project/${project.id}`,
                                )
                                  ? "secondary"
                                  : "ghost",
                              }),
                            )}
                          >
                            <>
                              <div
                                className="mr-2 h-4 w-4 rounded-xl"
                                style={{
                                  background: hashStringToColorHex(project.id),
                                }}
                              ></div>
                              {project.name}
                            </>
                          </Link>
                        </>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </>
          </AppShell.Navbar>
          <AppShell.Main className="bg-card text-card-foreground">
            {children}
          </AppShell.Main>
        </AppShell>
        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          styles={{
            body: {
              background: "black",
              border: "1px solid #27272A",
              borderRadius: "4px",
            },
            content: {
              borderRadius: "4px",
            },
          }}
          centered
        >
          <div className="float-right flex w-full justify-end">
            <Modal.CloseButton />
          </div>
          <>
            <div className="grid w-full gap-4 py-4">
              <div className="grid w-full  grid-cols-4 items-center gap-4">
                <Label htmlFor="projectName" className="text-right">
                  Project Name
                </Label>
                <Input
                  type="text"
                  placeholder="Write a project name"
                  value={task}
                  className="col-span-3 !bg-background"
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (task.length > 1) {
                    mutate({
                      name: task,
                    });
                  } else {
                    toast.error("Enter a Title");
                  }
                }}
                type="submit"
              >
                Create Project
              </Button>
            </div>
          </>
        </Modal>
      </>
    );
  }
}
