/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { useState, type Dispatch, type SetStateAction } from "react"

import {
  Command,
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
import type { Status } from "@/types"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AssigneeSelect({
  assigneeList,
  selectedAssignee,
  setSelectedAssignee,
  handleAssignee,
}: {
  assigneeList: Status[]
  setSelectedAssignee?: Dispatch<SetStateAction<Status | undefined>>
  selectedAssignee: Status | undefined
  handleAssignee: (assignee: Status | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const [popover, setPopover] = useState(false)
  const [localStatus, setLocalStatus] = useState({} as Status)
  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex justify-start gap-2">
            {selectedAssignee ? (
              <>
                <div className="flex items-center">
                  <button type="button">
                    <Avatar className="flex h-7 w-7 items-center justify-center rounded-full">
                      <AvatarImage
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        src={selectedAssignee?.icon as string}
                        alt={selectedAssignee?.label}
                      />
                      <AvatarFallback className=" flex h-7 w-7 items-center justify-center rounded-full text-sm">
                        {selectedAssignee?.label?.charAt(0) ?? ""}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </div>

                <button className="flex items-center truncate text-sm  ">
                  <p>{selectedAssignee?.label}</p>
                </button>
              </>
            ) : (
              <>+ Select assignee</>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Change assignee" />
            <CommandList>
              <CommandGroup>
                {assigneeList?.map((status) => (
                  <CommandItem
                    key={status?.label}
                    value={status?.value}
                    onSelect={(label) => {
                      const assignee = assigneeList?.find(
                        (priority) => priority?.value === label,
                      )
                      if (assignee?.value !== "xamtac") {
                        setSelectedAssignee && setSelectedAssignee(assignee)
                        handleAssignee(assignee)
                        setOpen(false)
                      }
                      if (assignee?.value === "xamtac") {
                        setLocalStatus(assignee)
                        setPopover(open)
                        // handleAssignee(assignee);
                        // setOpen(false);
                      }
                    }}
                    className="cursor-pointer gap-x-2"
                  >
                    <Avatar className="flex h-7 w-7 items-center justify-center rounded-full">
                      <AvatarImage
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        src={status?.icon as string}
                        alt={status?.label}
                      />
                      <AvatarFallback className=" flex h-7 w-7 items-center justify-center rounded-full">
                        {status?.label?.charAt(0) ?? ""}
                      </AvatarFallback>
                    </Avatar>

                    <span>{status?.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <AlertDialog open={popover} onOpenChange={(e) => setPopover(e)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Need Help?</AlertDialogTitle>
            <AlertDialogDescription>
              If your team doesn't have the bandwidth, we can help you out. By
              selecting this option someone from Xamtac Consulting will review
              the request and reach out about working together. Are you sure you
              want to assign this to “Xamtac
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (localStatus) {
                  setSelectedAssignee && setSelectedAssignee(localStatus)
                  handleAssignee(localStatus)
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
