import React, { useEffect, useState } from "react";

import { HybridLayout } from "@/components/layouts/layout";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, Tooltip } from "@mantine/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useClickOutside } from "@mantine/hooks";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerWithPresets } from "@/components/ui/data-picker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
export default function Dashboard() {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const ref = useClickOutside(() => setShowInput(false));
  const [singleTaskId, setSingleTaskId] = useState("");
  const [completedTaskNumber, setCompletedTaskNumber] = useState(10);
  const [allTask, setAllTask] = useState<typeof todoTasks>([]);
  const [addTask, setAddTask] = useState({
    title: "",
    description: "",
  });
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

  const { mutate: createTask } = api.task.createTask.useMutation({
    onError(value) {
      toast.error(value.message);
    },
    async onSuccess() {
      toast.success("Submitted");

      setAddTask({
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

  useEffect(() => {
    if (todoTasks) {
      setAllTask(todoTasks);
    }
  }, [todoTasks]);

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showInput) {
      if (e.key === "Enter") {
        if (addTask.title.length >= 1) {
          createTask({
            title: addTask.title,
            description: addTask.description,
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

    // getSingleTaskComments({
    //   id: id,
    // });
    // getSingleDescription({
    //   taskId: id,
    // });
    // setTaskId(id);
    void router.push({
      query: { id: id },
    });
  };

  return (
    <HybridLayout>
      <div className="container mx-auto py-4 ">
        <div className="grid md:grid-cols-2">
          <Card
            ref={ref}
            className="h-full max-h-[500px] min-h-1 w-full max-w-lg"
          >
            <CardHeader>
              <CardTitle>My tasks</CardTitle>
            </CardHeader>
            <CardContent className="h-full min-h-1 px-0">
              <Tabs
                classNames={{
                  tab: "!focus:bg-none hover:bg-transparent h-full ",
                }}
                color="gray"
                defaultValue="upcoming"
              >
                <Tabs.List>
                  <Tabs.Tab value="upcoming">Upcoming</Tabs.Tab>
                  <Tabs.Tab value="overdue">Overdue</Tabs.Tab>
                  <Tabs.Tab value="completed">Completed</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="upcoming" className="px-4 pt-2 ">
                  <div className="flex w-full items-start justify-start">
                    <Button
                      variant="ghost"
                      onClick={handleButtonClick}
                      className=" flex items-center  gap-x-2 text-center  text-sm"
                    >
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
                      </svg>
                      Create Task
                    </Button>
                  </div>
                  <ScrollArea className="h-[300px] pt-2 ">
                    {showInput && (
                      <div>
                        <>
                          <div className="flex w-full  items-center justify-between border-t text-sm  hover:bg-neutral-100 dark:hover:bg-neutral-900">
                            <input
                              type="text"
                              placeholder="Write a task name"
                              value={addTask.title}
                              className=" h-full w-full border-none bg-transparent py-2 pl-3 outline-none"
                              onChange={(e) =>
                                setAddTask({
                                  ...addTask,
                                  title: e.target.value,
                                })
                              }
                              onKeyPress={(e) => handleKeyPress(e)}
                            />
                          </div>
                        </>
                      </div>
                    )}
                    <div className=" flex flex-col   dark:text-white">
                      {allTask?.map((n, idx) => {
                        return (
                          <button key={n?.id} className="group flex w-full ">
                            <div
                              className={cn(
                                "flex w-full items-center justify-between border-b py-2 text-sm group-hover:bg-neutral-100 dark:group-hover:bg-neutral-900",
                                idx === 0 && "border-t",
                              )}
                            >
                              <div className="pr-2">
                                <Tooltip label="Checkbox with tooltip">
                                  <Checkbox
                                    className="relative z-10"
                                    onClick={() => handleUpdateStatus(n?.id)}
                                  />
                                </Tooltip>
                              </div>
                              <button
                                onClick={() => {
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
                        );
                      })}
                      {todoTaskLoading && (
                        <div className="flex flex-col gap-y-2">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Tabs.Panel>

                <Tabs.Panel value="overdue" className="h-full min-h-1">
                  <div className=""></div>
                </Tabs.Panel>

                <Tabs.Panel value="completed" className="h-full min-h-1">
                  <ScrollArea className="h-[300px] pt-2">
                    <div className="flex flex-col gap-y-3 pt-2 dark:text-white">
                      {completedTask?.map((n) => {
                        return (
                          <ContextMenu key={n.id}>
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
                                    // onClick={() => {
                                    //   open();
                                    //   fetchSingleTask(n.id);
                                    // }}
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
                              // onClick={() => {
                              //   deleteTask({
                              //     id: n.id,
                              //   });
                              // }}
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
                          <Skeleton className="h-5 w-full" />
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
            <CardFooter></CardFooter>
          </Card>
        </div>
      </div>
    </HybridLayout>
  );
}
