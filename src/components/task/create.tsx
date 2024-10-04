import { useCallback, useEffect, useState } from "react"

import { Label } from "@/components/ui/label"

import {
  AssignToSelect,
  CollaboratorMultiSelect,
} from "@/components/ui/CollaboratorMultiSelect"
import { Button } from "@/components/ui/button"
import {
  DatePickerWithPresets,
  DatePickerWithPresetsNull,
} from "@/components/ui/date-picker"
import { ComboBoxResponsive } from "@/components/ui/responsive-select"
import { StatusSelect } from "@/components/ui/select-status"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { prioritiesData } from "@/data"
import { useTaskStore } from "@/store/project"
import type { StatusSelectType } from "@/types"
import type { IPAllUserData, IPCreateProjectFromValue } from "@/types/projects"
import { api } from "@/utils/api"
import { Textarea } from "@mantine/core"
import { BsThreeDots } from "react-icons/bs"

const initialTaskData = {
  title: "",
  description: "",
  priority: "",
  dueDate: undefined,
  workSpaceId: undefined,
  collaborators: [],
  assigned_to: undefined,
  status: "TO_DO",
  customLabel: [],
  parentTaskId: undefined,
}

export default function CreateCustomTask() {
  const {
    setToggleSidebar: setOpen,
    toggleSidebar: open,
    taskId,
    setTaskId,
    refetchAllTask,
    allUsers,
    status,
    refetchStatus,
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

  const [singleRequestData, setSingleRequestData] =
    useState<IPCreateProjectFromValue>(initialTaskData)

  const createProject = api.task.createTask.useMutation({
    onSuccess() {
      void refetchAllTask?.()
      setOpen()
      setSingleRequestData(initialTaskData)
      setTaskId("")
    },
  })

  useEffect(() => {
    if (status) {
      setColumns(status)
    }
  }, [status])

  useEffect(() => {
    if (allUsers) {
      setUserDetails(allUsers)
    }
  }, [allUsers])

  const handleCollaborators = useCallback((values: string[]) => {
    setSingleRequestData((prevTasks) => ({
      ...prevTasks,
      collaborators: values,
    }))
  }, [])
  const handleAssignTo = useCallback((values: string) => {
    setSingleRequestData((prevTasks) => ({
      ...prevTasks,
      assigned_to: values,
    }))
  }, [])

  const updateTaskStatus = (newStatus: string) => {
    setSingleRequestData((prevTasks) => ({
      ...prevTasks,
      status: newStatus,
    }))
  }

  return (
    <div>
      <Sheet
        modal={true}
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            setSingleRequestData(initialTaskData)
            setTaskId("")
          }
          console.log(value, "value")
          setOpen()
        }}
      >
        <SheetContent
          className="top-20 flex h-[calc(100svh-80px)] max-w-[521px] flex-col  md:min-w-[521px]"
          CustomComponent={() => {
            return (
              <button>
                <BsThreeDots width={10} height={10} />
              </button>
            )
          }}
          hideCloseButton={true}
        >
          <div className="flex  h-[calc(100svh-80px)] min-h-1  flex-1  flex-col  justify-between ">
            <div className="flex min-h-0 flex-col justify-between overflow-scroll px-3 ">
              <div className="relative mb-3">
                <SheetHeader>
                  <SheetTitle>
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
                        setSingleRequestData((prevTasks) => ({
                          ...prevTasks,
                          title: e.target.value,
                        }))
                        // setEdit({
                        //   ...edit,
                        //   editTitle: true,
                        // });
                      }}
                    />
                  </SheetTitle>
                </SheetHeader>
              </div>
              <div className="mt-1 flex flex-col  ">
                <div className="flex h-full flex-col gap-y-5">
                  <div className=" flex flex-col gap-y-5">
                    <div className=" grid w-full grid-cols-[1fr,2fr]  items-center   ">
                      <Label>Assignee</Label>
                      <div className="flex flex-1 items-center gap-x-2  overflow-x-scroll">
                        <div className="flex ">
                          <AssignToSelect
                            hoverCardMessage="Add or remove assignee"
                            data={userDetails.data}
                            onSelect={handleAssignTo}
                            value={singleRequestData?.assigned_to ?? ""}
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
                        onSelect={(value) => {
                          setSingleRequestData((prevTasks) => ({
                            ...prevTasks,
                            priority: value,
                          }))
                        }}
                        value={singleRequestData?.priority}
                      />
                    </div>
                    <div className=" grid w-full grid-cols-[1fr,2fr]  items-center">
                      <Label> Due Date</Label>
                      {singleRequestData?.dueDate && (
                        <DatePickerWithPresets
                          handleDueDate={(date) => {
                            setSingleRequestData((prevTasks) => ({
                              ...prevTasks,
                              dueDate: date,
                            }))
                          }}
                          value={singleRequestData?.dueDate}
                        />
                      )}
                      {!singleRequestData?.dueDate && (
                        <DatePickerWithPresetsNull
                          handleDueDate={(date) => {
                            setSingleRequestData((prevTasks) => ({
                              ...prevTasks,
                              dueDate: date,
                            }))
                          }}
                        />
                      )}
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
                    <div className=" grid w-full gap-y-2 py-4 ">
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
                          value={singleRequestData?.description}
                          className="w-full"
                          onChange={(e) => {
                            setSingleRequestData((prevTasks) => ({
                              ...prevTasks,

                              description: e.target.value,
                            }))
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="  relative  flex max-w-full  flex-col border-t ">
              <div className="flex w-full flex-col">
                <SheetFooter>
                  <Button
                    className="my-2"
                    variant={"outline"}
                    onClick={() => {
                      createProject.mutate(singleRequestData)
                    }}
                  >
                    Create
                  </Button>
                </SheetFooter>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
