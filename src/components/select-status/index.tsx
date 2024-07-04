/* eslint-disable react/no-unescaped-entities */
import { LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Dispatch, type SetStateAction, useState } from "react";

import { api, type RouterOutputs } from "@/utils/api";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type AllStatusProps =
  | RouterOutputs["status"]["getAllStatusForUser"]
  | undefined;

type Status = {
  value: string;
  label: string;
};

export function StatusSelect({
  allStatus,
  updateFunction,
  selectedStatus,
  setSelectedStatus,
  refetch,
}: {
  updateFunction: (data: string) => void | undefined;
  selectedStatus: Status | undefined;
  allStatus: AllStatusProps;
  setSelectedStatus: Dispatch<SetStateAction<Status | undefined>>;
  refetch?: any;
}) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [customStatus, setCustomStatus] = useState("");
  const { mutate: createCustomStatus } = api.status.createStatus.useMutation({
    onError(value) {
      toast.error("Something went wrong", {
        description: value.message,
      });
    },
    onSuccess() {
      refetch();
      toast.success("Status added successfully");
      setOpenDialog(false);
    },
  });
  const handleSubmitCustomStatus = () => {
    if (
      allStatus?.some(
        (e) => e.label.toLowerCase() === customStatus.toLowerCase(),
      )
    ) {
      toast.error("Status cannot have duplicate names");
    } else {
      createCustomStatus({
        status: customStatus,
      });
    }
  };

  return (
    <div className="flex w-full items-center space-x-4">
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
                      setSelectedStatus(
                        allStatus?.find(
                          (priority) => priority.value.toLowerCase() === value,
                        ) as Status,
                      );
                      if (value) {
                        updateFunction(
                          allStatus?.find(
                            (priority) =>
                              priority?.value.toLowerCase() === value,
                          )?.value as Status["value"],
                        );
                      }
                      setOpen(false);
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
                  {" "}
                  <LuPlus className="mr-2 h-4 w-4" />
                  Add Status
                </Button>
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog modal open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Status</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>
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
  );
}
