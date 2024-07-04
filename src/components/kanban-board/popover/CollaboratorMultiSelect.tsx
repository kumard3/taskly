/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import * as React from "react";

// import { cn } from "@/lib/utils"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HoverCard, MultiSelect } from "@mantine/core";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

type Status = {
  label: string;
  value: string;
  icon: string | null;
};
interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
  icon: string;
}



export function CollaboratorMultiSelect({
  collaboratorList,
  selectedCollaborators,
  handleAssignee,
}: {
  collaboratorList: Status[];
  selectedCollaborators: Status[] | undefined;
  handleAssignee: (value: string[], filteredArray1: Status[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  console.log(selectedCollaborators, "selectedCollaborators");
  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className=" flex justify-start gap-2 border-0 bg-transparent">
            {selectedCollaborators?.length !== 0 ? (
              <>
                {selectedCollaborators?.map((n) => {
                  return (
                    <div key={n.value} className="flex items-center">
                      <button type="button">
                        <Avatar>
                          <AvatarImage src={n?.icon as string} alt="@shadcn" />
                          <AvatarFallback>
                            {" "}
                            {n?.label?.charAt(0) ?? ""}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </div>
                  );
                })}
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <button type="button">
                      <Avatar className="border border-dotted ">
                        <AvatarFallback className="bg-transparent bg-none">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                            className="h-4  w-4"
                          >
                            <path
                              fill="#8B8B8B"
                              d="M12,14c-3.859,0-7-3.14-7-7S8.141,0,12,0s7,3.14,7,7-3.141,7-7,7Zm0-12c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm10,21v-2c0-2.757-2.243-5-5-5H7c-2.757,0-5,2.243-5,5v2c0,.552,.447,1,1,1s1-.448,1-1v-2c0-1.654,1.346-3,3-3h10c1.654,0,3,1.346,3,3v2c0,.552,.447,1,1,1s1-.448,1-1Z"
                            ></path>
                          </svg>
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">Add or remove collaborators</p>
                  </HoverCard.Dropdown>
                </HoverCard>{" "}
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <button type="button">
                      <Avatar className="border border-dotted ">
                        <AvatarFallback className="bg-transparent bg-none">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                            className="h-4  w-4"
                          >
                            <path
                              fill="#8B8B8B"
                              d="M12,14c-3.859,0-7-3.14-7-7S8.141,0,12,0s7,3.14,7,7-3.141,7-7,7Zm0-12c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm10,21v-2c0-2.757-2.243-5-5-5H7c-2.757,0-5,2.243-5,5v2c0,.552,.447,1,1,1s1-.448,1-1v-2c0-1.654,1.346-3,3-3h10c1.654,0,3,1.346,3,3v2c0,.552,.447,1,1,1s1-.448,1-1Z"
                            ></path>
                          </svg>
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">Add or remove collaborators</p>
                  </HoverCard.Dropdown>
                </HoverCard>{" "}
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <button type="button">
                      <Avatar className="border border-dotted ">
                        <AvatarFallback className="bg-transparent bg-none">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                            className="h-4  w-4"
                          >
                            <path
                              fill="#8B8B8B"
                              d="M12,14c-3.859,0-7-3.14-7-7S8.141,0,12,0s7,3.14,7,7-3.141,7-7,7Zm0-12c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm10,21v-2c0-2.757-2.243-5-5-5H7c-2.757,0-5,2.243-5,5v2c0,.552,.447,1,1,1s1-.448,1-1v-2c0-1.654,1.346-3,3-3h10c1.654,0,3,1.346,3,3v2c0,.552,.447,1,1,1s1-.448,1-1Z"
                            ></path>
                          </svg>
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">Add or remove collaborators</p>
                  </HoverCard.Dropdown>
                </HoverCard>
              </>
            ) : (
              <>
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-dotted border-[#8B8B8B]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                        className="h-4  w-4"
                      >
                        <path
                          fill="#8B8B8B"
                          d="M12,14c-3.859,0-7-3.14-7-7S8.141,0,12,0s7,3.14,7,7-3.141,7-7,7Zm0-12c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm10,21v-2c0-2.757-2.243-5-5-5H7c-2.757,0-5,2.243-5,5v2c0,.552,.447,1,1,1s1-.448,1-1v-2c0-1.654,1.346-3,3-3h10c1.654,0,3,1.346,3,3v2c0,.552,.447,1,1,1s1-.448,1-1Z"
                        ></path>
                      </svg>
                    </button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">Add or remove collaborators</p>
                  </HoverCard.Dropdown>
                </HoverCard>{" "}
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-dotted border-[#8B8B8B]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                        className="h-4  w-4"
                      >
                        <path
                          fill="#8B8B8B"
                          d="M12,14c-3.859,0-7-3.14-7-7S8.141,0,12,0s7,3.14,7,7-3.141,7-7,7Zm0-12c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm10,21v-2c0-2.757-2.243-5-5-5H7c-2.757,0-5,2.243-5,5v2c0,.552,.447,1,1,1s1-.448,1-1v-2c0-1.654,1.346-3,3-3h10c1.654,0,3,1.346,3,3v2c0,.552,.447,1,1,1s1-.448,1-1Z"
                        ></path>
                      </svg>
                    </button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">Add or remove collaborators</p>
                  </HoverCard.Dropdown>
                </HoverCard>{" "}
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <button type="button">
                      <svg
                        className="h-4  w-4"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          fill="#8B8B8B"
                          d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z"
                        ></path>
                      </svg>
                    </button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">Add or remove collaborators</p>
                  </HoverCard.Dropdown>
                </HoverCard>
              </>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className=" p-0">
          <Command className="bg-white">
            <MultiSelect
              placeholder="Select a collaborators"
              data={collaboratorList ?? []}
              searchable
              rightSection={<div></div>}
              defaultValue={selectedCollaborators?.map((n) => n?.value)}
              styles={{
                input: {
                  border: "1px black",
                  borderBottom: "1px",
                  borderColor: "black",
                },
                wrapper: {
                  backgroundColor: "white",
                },
              }}
              className="bg-white"
              // @kumard3 need to fix this
              // itemComponent={SelectItem}
              onChange={(value) => {
                const filteredArray1 = collaboratorList?.filter((item) =>
                  value.includes(String(item.value)),
                );
                handleAssignee(value, filteredArray1);
              }}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
