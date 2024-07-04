import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { notifications } from "@mantine/notifications";
import { nanoid } from "nanoid";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Chip,
  Modal,
  MultiSelect,
  Tabs,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

import { type Status } from "@/components/kanban-board/types";
import { useRouter } from "next/router";

import { MainLayout } from "@/components/layouts/main-layout";
import { DatePickerWithPresets } from "@/components/ui/data-picker";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [task, setTask] = useState({
    title: "",
    description: "",
  });
  const [showInput, setShowInput] = useState(false);
  const ref = useClickOutside(() => setShowInput(false));

  const [opened, { open, close }] = useDisclosure(false);
  const [userDetails, setUserDetails] = useState([]);
  const [completedTaskNumber, setCompletedTaskNumber] = useState(5);
  const [assignee, setAssignee] = useState<Status | undefined>();
  const [collaborators, setCollaborators] = useState<Status[] | undefined>([]);
  const [taskId, setTaskId] = useState("");
  const [singleTitle, setSingleTitle] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [singleTaskId, setSingleTaskId] = useState("");

  const {
    data: todoTasks,
    refetch: refetchTodoTasks,
    isLoading: todoTaskLoading,
  } = api.task.getAllTodoTasks.useQuery();

  const {
    data: completedTask,
    isLoading: completedTaskLoading,
    refetch: refetchCompletedTasks,
  } = api.task.getAllCompletedTasks.useQuery({
    limit: completedTaskNumber,
  });

  const { mutate } = api.task.createTask.useMutation({
    onError(value) {
      toast.error(value.message);
    },
    async onSuccess() {
      toast.success("Submitted");

      setTask({
        title: "",
        description: "",
      });
      await refetchTodoTasks();
      setShowInput(false);
    },
  });

  const { mutate: updateStatus } = api.task.updateStatus.useMutation({
    async onSuccess() {
      toast.success("Status updated");

      await refetchTodoTasks();
      await refetchCompletedTasks();
    },
  });

  const { data: getSingleTask } = api.task.getSingleTask.useQuery(
    {
      id: singleTaskId,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!singleTaskId,
    },
  );

  const { mutate: getSingleTaskComments, data: getSingleTaskCommentsData } =
    api.task.getSingleTaskComments.useMutation({});

  const { mutate: addAssigned } = api.task.updateAssignee.useMutation();
  const { mutate: addCollaborators } =
    api.task.addOrUpdateCollaborators.useMutation();

  const { mutate: deleteTask } = api.task.deleteTask.useMutation({
    async onSuccess() {
      await refetchTodoTasks();
      await refetchCompletedTasks();
    },
  });

  const { data: allUsers } = api.user.allUsers.useQuery();
  const { data: descriptionData, mutate: getSingleDescription } =
    api.task.getSingleDescription.useMutation({});
  const { data: allProject } = api.project.allProjects.useQuery();
  const { mutate: connectToTask } = api.project.connectTask.useMutation({
    onSuccess() {
      toast.success("Task connected");
    },
  });

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showInput) {
      if (e.key === "Enter") {
        if (task.title.length >= 1) {
          mutate({
            title: task.title,
            description: task.description,
          });
        }
      }
    }
  };

  const handleUpdateStatus = (id: string) => {
    updateStatus({
      id: id,
      status: "COMPLETED",
    });
  };
  const handleUpdateStatusFu = ({
    id,
    status,
  }: {
    id: string;
    status: "TO_DO" | "IN_PROGRESS" | "ISSUES" | "COMPLETED" | "OVERDUE";
  }) => {
    updateStatus({
      id: id,
      status: status,
    });
  };

  const fetchSingleTask = (id: string) => {
    setSingleTaskId(id);

    getSingleTaskComments({
      id: id,
    });
    getSingleDescription({
      taskId: id,
    });
    setTaskId(id);
    void router.push({
      query: { id: id },
    });
  };
  const fetchComment = (id: string) => {
    getSingleTaskComments({
      id: id,
    });
  };
  const fetchDescription = (id: string) => {
    getSingleDescription({
      taskId: id,
    });
  };

  useEffect(() => {
    if (getSingleTask) {
      if (getSingleTask?.collaborators) {
        const collaboratorsData = getSingleTask?.collaborators?.map(
          (crmList) => {
            return {
              label: crmList.name,
              value: crmList.id,
              icon: crmList.image,
            };
          },
        );
        setCollaborators(collaboratorsData as []);
      }
      setAssignee({
        label: getSingleTask?.assigned_to?.name as string,
        value: getSingleTask?.assigned_to?.id as string,
        icon: getSingleTask?.assigned_to?.image as string,
      });
      setSingleTitle(getSingleTask?.title as string);
    }
  }, [getSingleTask]);

  useMemo(() => {
    if (allUsers && allUsers?.length > 0) {
      const data = allUsers?.map((crmList) => {
        return {
          label: crmList.name,
          value: crmList.id,
          icon: crmList.image,
        };
      });
      setUserDetails(data as []);
    }
  }, [allUsers]);

  useMemo(() => {
    if (allProject && allProject?.length > 0) {
      const data = allProject?.map((crmList) => {
        return {
          label: crmList.name,
          value: crmList.id,
        };
      });
      setAllProjects(data as []);
    }
  }, [allProject]);

  const handleAssignee = (label: string) => {
    addAssigned({
      assigned_to: label,
      taskId: taskId,
    });
  };

  const handleCollaborators = useCallback(
    (value: string[]) => {
      if (value) {
        addCollaborators({
          collaborators: value,
          taskId: taskId,
        });
      }
    },
    [addCollaborators, taskId],
  );
  const handleTaskConnect = (value: string[]) => {
    connectToTask({
      projectId: value,
      taskId: taskId,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className=" w-full">
          <Card ref={ref} className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>My tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs color="gray" defaultValue="upcoming">
                <Tabs.List>
                  <Tabs.Tab value="upcoming">Upcoming</Tabs.Tab>
                  <Tabs.Tab value="overdue">Overdue</Tabs.Tab>
                  <Tabs.Tab value="completed">Completed</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="upcoming" className="pt-2 ">
                  <button
                    onClick={handleButtonClick}
                    className=" flex w-full items-center gap-x-2  text-sm"
                  >
                    {" "}
                    <svg
                      fill="white"
                      stroke="white"
                      width="10"
                      height="15"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        fill="white"
                        stroke="white"
                        d="M26,14h-8V6c0-1.1-0.9-2-2-2l0,0c-1.1,0-2,0.9-2,2v8H6c-1.1,0-2,0.9-2,2l0,0c0,1.1,0.9,2,2,2h8v8c0,1.1,0.9,2,2,2l0,0c1.1,0,2-0.9,2-2v-8h8c1.1,0,2-0.9,2-2l0,0C28,14.9,27.1,14,26,14z"
                      ></path>
                    </svg>{" "}
                    <>Create Task</>
                  </button>
                  <ScrollArea className="h-[300px] pt-2">
                    {showInput && (
                      <div className="my-2 px-1">
                        <Input
                          type="text"
                          placeholder="Write a task name"
                          value={task.title}
                          className=""
                          onChange={(e) =>
                            setTask({ ...task, title: e.target.value })
                          }
                          onKeyPress={(e) => handleKeyPress(e)}
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-y-3 pt-2 dark:text-white">
                      {todoTasks?.map((n) => {
                        return (
                          <>
                            <ContextMenu key={nanoid()}>
                              <ContextMenuTrigger>
                                <button
                                  key={n?.id}
                                  className="group flex w-full  "
                                >
                                  <div className="flex w-full items-center justify-between border-b p-1 pb-1 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-900">
                                    <div className="pr-2">
                                      <Tooltip label="Checkbox with tooltip">
                                        <Checkbox
                                          className="relative z-10"
                                          onClick={() =>
                                            handleUpdateStatus(n?.id)
                                          }
                                        />
                                      </Tooltip>
                                    </div>
                                    <button
                                      onClick={() => {
                                        open();
                                        fetchSingleTask(n.id);
                                      }}
                                      className="flex w-full flex-1 items-center gap-x-4"
                                    >
                                      <div className="">
                                        <p>{n?.title}</p>
                                      </div>
                                    </button>
                                    <div className="">
                                      <DatePickerWithPresets />
                                    </div>
                                  </div>
                                </button>
                              </ContextMenuTrigger>
                              <ContextMenuContent>
                                <ContextMenuItem
                                  onClick={() => {
                                    deleteTask({
                                      id: n.id,
                                    });
                                  }}
                                >
                                  <div className="flex  items-center gap-x-2">
                                    <Trash2 className="h-4 w-4 " /> DeleteTask
                                  </div>
                                </ContextMenuItem>
                              </ContextMenuContent>
                            </ContextMenu>
                          </>
                        );
                      })}
                      {todoTaskLoading && (
                        <div className="flex flex-col gap-y-2">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />{" "}
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Tabs.Panel>

                <Tabs.Panel value="overdue">Messages tab content</Tabs.Panel>

                <Tabs.Panel value="completed">
                  {" "}
                  <ScrollArea className="h-[300px] pt-2">
                    <div className="flex flex-col gap-y-3 pt-2 dark:text-white">
                      {completedTask?.map((n) => {
                        return (
                          <ContextMenu key={nanoid()}>
                            <ContextMenuTrigger>
                              <button
                                key={n?.id}
                                className="group flex w-full  "
                              >
                                <div className="flex w-full items-center justify-between border-b p-1 pb-1  group-hover:bg-neutral-900">
                                  <div className="flex items-center pr-2">
                                    <Tooltip label="Checkbox with tooltip">
                                      <Checkbox
                                        className="relative z-10"
                                        defaultChecked={
                                          n?.status === "COMPLETED" && true
                                        }
                                        onClick={() => {
                                          if (n?.status === "COMPLETED") {
                                            handleUpdateStatusFu({
                                              id: n.id,
                                              status: "TO_DO",
                                            });
                                          }
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                  <button
                                    onClick={() => {
                                      open();
                                      fetchSingleTask(n.id);
                                    }}
                                    className="flex w-full flex-1 items-center gap-x-4"
                                  >
                                    <div className="">
                                      <p>{n?.title}</p>
                                    </div>
                                  </button>
                                  <div className="">
                                    <button
                                      type="button"
                                      className="flex h-5 w-5 items-center justify-center rounded-full border border-dotted border-[#8B8B8B]"
                                    >
                                      <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        focusable="false"
                                        className="h-3  w-3"
                                      >
                                        <path
                                          fill="#8B8B8B"
                                          d="M12,14c-3.859,0-7-3.14-7-7S8.141,0,12,0s7,3.14,7,7-3.141,7-7,7Zm0-12c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm10,21v-2c0-2.757-2.243-5-5-5H7c-2.757,0-5,2.243-5,5v2c0,.552,.447,1,1,1s1-.448,1-1v-2c0-1.654,1.346-3,3-3h10c1.654,0,3,1.346,3,3v2c0,.552,.447,1,1,1s1-.448,1-1Z"
                                        ></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </button>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <ContextMenuItem
                                onClick={() => {
                                  deleteTask({
                                    id: n.id,
                                  });
                                }}
                              >
                                <div className="flex  items-center gap-x-2">
                                  <Trash2 className="h-4 w-4 " /> DeleteTask
                                </div>
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        );
                      })}
                      {completedTaskLoading && (
                        <div className="flex flex-col gap-y-2">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />{" "}
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => setCompletedTaskNumber((prev) => prev + 5)}
                      variant="ghost"
                      className="text-sm"
                    >
                      Show more
                    </Button>
                  </ScrollArea>
                </Tabs.Panel>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
