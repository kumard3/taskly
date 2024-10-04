/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react"

import { Label } from "@/components/ui/label"

import {
  AssignToSelect,
  CollaboratorMultiSelect,
} from "@/components/ui/CollaboratorMultiSelect"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithPresets } from "@/components/ui/date-picker"
import { ComboBoxResponsive } from "@/components/ui/responsive-select"
import { AddCommentToTask } from "@/components/ui/rich-text-editor/CommentTextEditor"
import { StatusSelect } from "@/components/ui/select-status"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { prioritiesData } from "@/data"
import { cn } from "@/lib/utils"
import { useTaskStore } from "@/store/project"
import type { StatusSelectType } from "@/types"
import type {
  IPAllUserData,
  IPSingleTaskData,
  IPUpdateFormValueKeys,
} from "@/types/projects"
import { api } from "@/utils/api"
import { Input, Skeleton, Textarea } from "@mantine/core"
import { useDebouncedCallback } from "@mantine/hooks"
import moment from "moment"
import { nanoid } from "nanoid"
import {} from "react-icons/bs"
import { MdDelete } from "react-icons/md"
import { PiPlus } from "react-icons/pi"
import { toast } from "sonner"

import {} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {} from "@/components/ui/dialog"
import {} from "@mantine/core"
import {} from "react-icons/tb"
export default function UpdateTaskFrom() {
  const {
    toggleUpdateTask: open,
    taskId,
    allUsers,
    status,
    refetchStatus,
    handleOpenTask,
    setTaskId,
    refetchAllTask,
    updateAllTask,
  } = useTaskStore()

  const [columns, setColumns] = useState(
    [] as {
      value: string
      label: string
    }[],
  )
  const [userDetails, setUserDetails] = useState<IPAllUserData>({
    data: [],
    allData: [],
  })
  const [selectedStatus, setSelectedStatus] = useState<StatusSelectType>()

  const [singleRequestData, setSingleRequestData] = useState(
    {} as IPSingleTaskData,
  )
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const {
    data: getTaskById,
    refetch: refetchSingleTask,
    isLoading,
  } = api.task.getTaskById.useQuery(
    {
      id: taskId ?? "",
    },
    {
      enabled: !!taskId,
    },
  )

  const { mutate: updateTaskMutation } = api.task.updateTask.useMutation()

  useEffect(() => {
    if (getTaskById) {
      setSingleRequestData(getTaskById)

      setSelectedStatus({
        value: getTaskById?.status ?? "",
        label: getTaskById?.status?.replace("_", " ") ?? "",
      })
    }
  }, [getTaskById])

  useEffect(() => {
    if (allUsers) {
      setUserDetails(allUsers)
    }
  }, [allUsers])

  useEffect(() => {
    if (status) {
      setColumns(status)
    }
  }, [status])

  useEffect(() => {
    if (getTaskById) {
      setSingleRequestData(getTaskById)
    }
  }, [getTaskById])

  const handleUpdate = useCallback(
    <T extends string | undefined | string[]>(
      query: T,
      key: IPUpdateFormValueKeys,
    ) => {
      updateTaskMutation({
        id: taskId ?? "",
        [key]: query,
      })
      updateAllTask((prev) => {
        return prev.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              [key]: query,
            }
          }
          return task
        })
      })
    },
    [taskId, updateTaskMutation, updateAllTask],
  )

  const debouncedHandleSearch = useDebouncedCallbackWithGeneric(
    handleUpdate,
    500,
  )
  const handleCollaborators = useCallback(
    (values: string[]) => {
      setSingleRequestData((prevTasks) => ({
        ...prevTasks,
        collaborators: values,
      }))
      handleUpdate(values, "collaborators")
    },
    [handleUpdate],
  )
  const handleAssignTo = useCallback(
    (values: string) => {
      setSingleRequestData((prevTasks) => ({
        ...prevTasks,
        assigned_to: values,
      }))
      handleUpdate(values, "assigned_to")
    },
    [handleUpdate],
  )
  const updateTaskStatus = useCallback(
    (values: string) => {
      setSingleRequestData((prevTasks) => ({
        ...prevTasks,
        status: values,
      }))
      handleUpdate(values, "status")
    },
    [handleUpdate],
  )
  const updateTaskPriority = useCallback(
    (values: string) => {
      setSingleRequestData((prevTasks) => ({
        ...prevTasks,
        priority: values,
      }))
      handleUpdate(values, "priority")
    },
    [handleUpdate],
  )
  const updateTaskDueDate = useCallback(
    (values: string) => {
      setSingleRequestData((prevTasks) => ({
        ...prevTasks,
        dueDate: values,
      }))

      handleUpdate(values, "dueDate")
    },
    [handleUpdate],
  )

  const updateTaskDescription = useCallback(
    (values: string) => {
      setSingleRequestData((prevTasks) => ({
        ...prevTasks,
        description: values,
      }))
      debouncedHandleSearch(values, "description")
    },
    [debouncedHandleSearch],
  )
  const updateTaskTitle = useCallback(
    (values: string) => {
      setSingleRequestData((prevTasks) => ({
        ...prevTasks,
        title: values,
      }))
      debouncedHandleSearch(values, "title")
    },
    [debouncedHandleSearch],
  )

  return (
    <div>
      <Sheet
        modal={true}
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            setTaskId("")
          }
          handleOpenTask(null)
        }}
      >
        <SheetContent
          className="top-20 flex h-[calc(100svh-80px)] w-full min-w-[520px] max-w-[570px]  flex-col p-3"
          hideCloseButton={true}
        >
          {isLoading && (
            <div className="flex  h-[calc(100svh-80px)] min-h-1  flex-1  flex-col  justify-between ">
              <LoadingTaskUi />
            </div>
          )}
          {!isLoading && (
            <div className="flex  h-[calc(100svh-80px)] min-h-1  flex-1  flex-col  justify-between ">
              <div className="flex min-h-0 flex-col justify-between overflow-scroll px-3 ">
                <div className="relative mb-3">
                  <SheetHeader>
                    <SheetTitle className="-ml-3">
                      <Textarea
                        autosize={true}
                        maxRows={10}
                        className="w-full border-none"
                        value={singleRequestData?.title}
                        placeholder="Add Title"
                        styles={{
                          label: {
                            flexShrink: 0,
                            color: "#3E3E3E",
                            fontWeight: 700,
                            fontSize: "16px",
                          },
                          error: {
                            fontSize: "8px",
                            position: "absolute",
                            right: "6px",
                            bottom: "8px",
                            backgroundColor: "white",
                          },
                          input: {
                            border: "none",
                            fontSize: "16px",
                          },
                        }}
                        onChange={(e) => {
                          updateTaskTitle(e.target.value)
                        }}
                      />
                    </SheetTitle>
                  </SheetHeader>
                </div>
                <div className="mt-1 flex flex-col  ">
                  <div className="flex h-full flex-col gap-y-5">
                    <div className=" flex flex-col gap-y-2">
                      <div className=" grid w-full grid-cols-[1fr,2fr]  items-center   ">
                        <Label>Assignee</Label>
                        <div className="flex flex-1 items-center gap-x-2  overflow-x-scroll">
                          <div className="flex ">
                            <AssignToSelect
                              hoverCardMessage="Add or remove assignee"
                              data={userDetails.data}
                              onSelect={handleAssignTo}
                              value={singleRequestData.assignedTo}
                            />
                          </div>
                        </div>
                      </div>

                      <div className=" grid w-full grid-cols-[1fr,2fr]  items-center">
                        <Label>Priority</Label>
                        <ComboBoxResponsive
                          title="Select priority"
                          classNameButton="w-full"
                          data={prioritiesData}
                          onSelect={updateTaskPriority}
                          value={singleRequestData?.priority ?? ""}
                        />
                      </div>
                      <div className=" grid w-full grid-cols-[1fr,2fr]  items-center">
                        <Label> Due Date</Label>
                        <DatePickerWithPresets
                          handleDueDate={updateTaskDueDate}
                          value={singleRequestData?.dueDate}
                        />
                      </div>
                      <div className=" grid w-full grid-cols-[1fr,2fr]  items-center">
                        <Label> Status</Label>
                        {columns && (
                          <StatusSelect
                            allStatus={columns}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            updateFunction={updateTaskStatus}
                            refetch={refetchStatus}
                          />
                        )}
                      </div>

                      <div className=" grid w-full grid-cols-[1fr,2fr]  items-center   ">
                        <Label>Collaborators</Label>
                        <div className="flex flex-1 items-center gap-x-2  overflow-x-scroll">
                          <div className="flex ">
                            <CollaboratorMultiSelect
                              initialData={userDetails.data}
                              prevData={singleRequestData?.collaborators ?? []}
                              onSelect={handleCollaborators}
                              hoverCardMessage="Add or remove collaborator"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" grid w-full gap-y-2 ">
                      <div className=" grid w-full gap-y-2 py-2">
                        <Label>Task Description</Label>
                        <div className="relative flex flex-col gap-x-2 rounded-md border border-input">
                          <Textarea
                            autosize={true}
                            minRows={5}
                            maxRows={10}
                            styles={{
                              label: {
                                flexShrink: 0,
                                color: "#3E3E3E",
                                fontWeight: 700,
                              },
                              error: {
                                fontSize: "8px",
                                position: "absolute",
                                right: "6px",
                                bottom: "8px",
                                backgroundColor: "white",
                              },
                              input: {
                                border: "none",
                              },
                            }}
                            value={singleRequestData?.description ?? ""}
                            className="w-full"
                            onChange={(e) => {
                              updateTaskDescription(e.target.value)
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full py-2">
                        <SubTask
                          parentTaskId={taskId ?? ""}
                          prevData={singleRequestData?.subTasks ?? []}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col pb-5  ">
                      <Label>Comments</Label>
                      <div className="min-h-[300px] ">
                        <div className="flex flex-col gap-y-4">
                          {singleRequestData?.comments?.map((n) => {
                            return (
                              <div
                                key={n.id}
                                className=" flex w-full items-start justify-start gap-x-3"
                              >
                                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600  text-white">
                                  <Button>{n.userInitials?.charAt(0)}</Button>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-x-2">
                                    <p>{n.userInitials}</p>
                                    <span className="text-xs text-gray-1">
                                      {moment(n?.createdAt).format(
                                        "DD MMM, YYYY",
                                      )}
                                    </span>
                                  </div>
                                  <div className="  w-full">
                                    <div className=" w-full text-xs">
                                      <div className=" inline-block whitespace-pre-wrap  break-words">
                                        <div
                                          className="word-wrap"
                                          dangerouslySetInnerHTML={{
                                            __html: n.message ?? "",
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="absolute -left-0 h-full w-full border-t border-[#E3E3E3] bg-[#F4F4F4]"></div>
                <div className="  relative  flex  w-full  flex-col pt-4">
                  <div className="flex w-full  flex-col">
                    {userDetails && (
                      <AddCommentToTask
                        data={userDetails.data}
                        id={singleRequestData?.id}
                        setSingleRequestData={setSingleRequestData}
                        fetchSingleTask={refetchSingleTask}
                        refetchAllRequest={refetchAllTask}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <AlertDialog
        open={showDeleteModal}
        onOpenChange={(value) => {
          setShowDeleteModal(value)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function SubTask({
  parentTaskId,
  prevData,
}: {
  parentTaskId: string
  prevData: IPSingleTaskData["subTasks"]
}) {
  const { allUsers, allTask } = useTaskStore()

  const [subTaskData, setSubTaskData] = useState<IPSingleTaskData["subTasks"]>(
    [],
  )

  const { mutate: createSubTask } = api.task.createTask.useMutation({
    onSuccess: (data) => {
      setSubTaskData((prev) => {
        return prev.map((task) => {
          if (task.id === data.tempTaskId) {
            return {
              ...task,
              id: data.id,
            }
          }
          return task
        })
      })
    },
  })

  const { mutate: updateTaskMutation } = api.task.updateTask.useMutation()
  const { mutate: deleteTask } = api.task.deleteTask.useMutation({
    onSuccess: (data) => {
      toast.success("Task deleted successfully")
    },
    onMutate: (data) => {
      setSubTaskData((prev) => {
        return prev.filter((task) => task.id !== data.id)
      })
    },
  })

  useEffect(() => {
    if (prevData) {
      setSubTaskData(prevData)
    }
  }, [prevData])

  const addSubTask = useCallback(() => {
    const tempTaskId = nanoid()
    setSubTaskData((prev) => [
      ...prev,
      {
        assignedTo: null,
        status: "TO_DO",
        id: tempTaskId,
        title: "",
      },
    ])
    createSubTask({
      title: "",
      parentTaskId,
      tempTaskId: tempTaskId,
      status: "TO_DO",
    })
  }, [createSubTask, parentTaskId])

  const handleUpdate = useCallback(
    <T extends string | undefined | string[]>(
      query: T,
      key: IPUpdateFormValueKeys,
      taskId: string,
    ) => {
      updateTaskMutation({
        id: taskId,
        [key]: query,
      })
    },
    [updateTaskMutation],
  )

  const debouncedHandleSearch = useDebouncedCallbackWithGeneric(
    handleUpdate,
    500,
  )

  const handleAssignTo = useCallback(
    (values: string, taskId: string) => {
      setSubTaskData((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              assigned_to: values,
            }
          }
          return t
        }),
      )
      updateTaskMutation({
        id: taskId ?? "",
        assigned_to: values,
      })
    },
    [updateTaskMutation],
  )
  const updateTaskTitle = useCallback(
    (values: string, taskId: string) => {
      setSubTaskData((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              title: values,
            }
          }
          return t
        }),
      )

      debouncedHandleSearch(values, "title", taskId)
    },
    [debouncedHandleSearch],
  )
  const updateTaskStatus = useCallback(
    (values: string, taskId: string) => {
      setSubTaskData((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: values,
            }
          }
          return t
        }),
      )
      handleUpdate(values, "status", taskId)
    },
    [handleUpdate],
  )

  return (
    <div className="flex w-full flex-col items-start gap-y-3">
      {subTaskData.length === 0 && <Label>Subtasks</Label>}
      {subTaskData.length > 0 && (
        <>
          <div className="group relative grid w-full grid-cols-[5fr,1fr,.6fr] gap-x-1.5 text-sm font-semibold text-black-1">
            <p>Sub Tasks</p>
            <p>Assignee</p>
            <p>Delete</p>
          </div>
          <div className="flex w-full flex-col gap-y-1">
            {subTaskData.map((subTask) => {
              return (
                <div
                  key={subTask.id}
                  className="group relative grid grid-cols-[5fr,1fr,.6fr] items-center  gap-x-1 "
                >
                  <div className="flex  items-center gap-x-2">
                    <Checkbox
                      checked={subTask?.status === "COMPLETED"}
                      className="rounded-full border-black-1"
                      onCheckedChange={() => {
                        if (subTask?.status === "COMPLETED") {
                          updateTaskStatus("TO_DO", subTask.id)
                        } else {
                          updateTaskStatus("COMPLETED", subTask.id)
                        }
                      }}
                    />

                    <Input
                      className="w-full max-w-full border-none"
                      classNames={{
                        input: cn(
                          "border-none text-xs font-semibold text-black-1 p-0",
                          subTask?.status === "COMPLETED" && "line-through",
                        ),
                        wrapper: "p-0 m-0",
                      }}
                      value={subTask.title}
                      onChange={(e) => {
                        updateTaskTitle(e.target.value, subTask.id)
                      }}
                      placeholder="Add Subtask here"
                    />
                  </div>
                  {/* <div className="w-full">
                    <div className="">
                      <ComboBoxResponsive
                        title="Select dep"
                        classNameButton="w-full   truncate"
                        data={allTask.map((n) => {
                          return {
                            label: truncateText(n?.title ?? "", 20),
                            value: n.id,
                          };
                        })}
                        // {truncateText(selectedClientId?.name ?? "", 6)}
                        onSelect={(value) => {
                          addDependency({
                            dependentTaskId: subTask.id,
                            dependencyTaskId: value,
                          });
                          // handleUpdate(value, "parentTaskId", subTask.id);
                        }}
                        // value={singleRequestData?.priority ?? ""}
                      />
                    </div>
                  </div> */}
                  <div className="">
                    <div className="">
                      <AssignToSelect
                        hoverCardMessage="Add or remove assignee"
                        data={allUsers.data}
                        onSelect={(value) => handleAssignTo(value, subTask.id)}
                        value={subTask?.assignedTo ?? ""}
                      />
                    </div>
                  </div>
                  <div className="">
                    <button
                      onClick={() => {
                        deleteTask({ id: subTask.id })
                      }}
                    >
                      <MdDelete size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <Button variant="outline" className="text-sm" onClick={addSubTask}>
        <PiPlus /> Add subtask
      </Button>
    </div>
  )
}

export function useDebouncedCallbackWithGeneric<
  T extends (...args: any[]) => any,
>(callback: T, delay: number) {
  const debouncedCallback = useDebouncedCallback(
    useCallback(callback, [callback]),
    delay,
  )

  return debouncedCallback
}

const LoadingTaskUi = () => {
  return (
    <>
      <>
        <Skeleton className="h-8 w-3/4" />

        <div className="mt-6 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-1/3" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </>
    </>
  )
}
