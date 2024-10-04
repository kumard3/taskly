/* eslint-disable react/no-unescaped-entities */
import { LuPlus } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type Dispatch, type SetStateAction, useEffect, useState } from "react"

import { api, type RouterOutputs } from "@/utils/api"
import { Separator } from "../../ui/separator"
import { toast } from "sonner"
import { useMediaQuery } from "@mantine/hooks"
import { ComboBoxResponsive } from "@/components/ui/responsive-select"
import { cn } from "@/lib"

type AllStatusProps =
  | RouterOutputs["projectForAgency"]["getAllStatus"]
  | undefined

type Status = {
  value: string
  label: string
}

export function StatusSelect({
  allStatus,
  updateFunction,
  selectedStatus,
  setSelectedStatus,
  refetch,
}: {
  updateFunction: (data: string) => void | undefined
  selectedStatus: Status | undefined
  allStatus: AllStatusProps
  setSelectedStatus: Dispatch<SetStateAction<Status | undefined>>
  refetch?: any
}) {
  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [customStatus, setCustomStatus] = useState("")
  const { mutate: createCustomStatus } =
    api.projectForAgency.createCustomStatus.useMutation({
      onError(value) {
        toast.error("Something went wrong", {
          description: value.message,
        })
      },
      onSuccess() {
        refetch()
        toast.success("Status added successfully")
        setOpenDialog(false)
      },
    })
  const handleSubmitCustomStatus = () => {
    if (
      allStatus?.some(
        (e) => e.label.toLowerCase() === customStatus.toLowerCase(),
      )
    ) {
      toast.error("Status cannot have duplicate names")
    } else {
      createCustomStatus({
        status: customStatus,
      })
    }
  }
  const isDesktop = useMediaQuery("(min-width: 768px)")
  useEffect(() => {
    if (!selectedStatus?.value) {
      allStatus && setSelectedStatus(allStatus[0])
    }
  }, [allStatus, selectedStatus, setSelectedStatus])
  return (
    <div className="flex w-full items-center space-x-4">
      {/* <ComboBoxResponsive
        title="Status"
        data={allStatus}
        value={selectedStatus?.value}
        onSelect={(value) => {
          const selectedStatus = allStatus?.find(
            (priority) => priority.value.toLowerCase() === value.toLowerCase(),
          ) as Status;
          setSelectedStatus(selectedStatus);
          if (value) {
            updateFunction(selectedStatus?.value);
          }
        }}
        classNameButton="w-full"
        creatable={{
          title: "Add Status",
          isCreateAble: true,
          onSelect: () => setOpenDialog(true),
        }}
      /> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {allStatus?.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    defaultValue={status.value}
                    onSelect={(value) => {
                      const selectedStatus = allStatus?.find(
                        (priority) =>
                          priority.value.toLowerCase() === value.toLowerCase(),
                      ) as Status

                      setSelectedStatus(selectedStatus)
                      if (value) {
                        updateFunction(selectedStatus?.value)
                      }
                      setOpen(false)
                    }}
                  >
                    <span>{status.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>

            <CommandGroup>
              <Separator />
              <CommandItem>
                <Button
                  onClick={(e) => setOpenDialog(true)}
                  className="m-0 h-auto p-0"
                >
                  <LuPlus className="mr-2 h-4 w-4" />
                  Add Status
                </Button>
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog modal={true} open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          // overlayClassName={cn(!isDesktop && "bg-transparent")}
          className="sm:max-w-[425px]  "
        >
          <DialogTitle>Add New Status</DialogTitle>
          <DialogDescription>Click save when you're done.</DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChange={(e) => setCustomStatus(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitCustomStatus} type="button">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
