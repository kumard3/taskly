/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import * as React from "react";

import {
  Command,
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
import { cn } from "@/lib/utils";

type Status = {
  value: string;
  label: string;
  icon: string;
};

export function ComboboxPopover({
  statuses,
  selectedAssignee,
  setSelectedAssignee,
  handleAssignee,
}: {
  statuses: Status[];
  setSelectedAssignee: React.Dispatch<React.SetStateAction<Status | undefined>>;
  selectedAssignee: Status | undefined;
  handleAssignee: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex justify-start gap-2">
            {selectedAssignee ? (
              <>
                <div className="flex items-center">
                  <button type="button">
                    <img
                      src={selectedAssignee?.icon}
                      alt=""
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                    />
                  </button>
                </div>

                <button className="flex items-center truncate text-sm  ">
                  <p>{selectedAssignee?.label}</p>
                </button>
              </>
            ) : (
              <>+ Set status</>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change assignee" />
            <CommandList>
              <CommandGroup>
                {statuses?.map((status) => (
                  <CommandItem
                    key={status.label}
                    value={status.value}
                    onSelect={(label) => {
                      
                      setSelectedAssignee(
                        statuses?.find((priority) => priority?.value === label),
                      );
                      handleAssignee(label);
                      setOpen(false);
                    }}
                    className="cursor-pointer gap-x-2"
                  >
                    <img
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full",
                      )}
                      src={status.icon}
                    />
                    <span>{status.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
