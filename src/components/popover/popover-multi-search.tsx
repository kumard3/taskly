/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import * as React from "react";

// import { cn } from "@/lib/utils"
import { Command } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { cn } from "@/ui/lib/utils";
import { HoverCard, MultiSelect } from "@mantine/core";
import { nanoid } from "nanoid";

type Status = {
  value: string;
  label: string;
  icon: string;
};

export function PopoverMultiSearch({
  statuses,
  selectedCollaborators,
  handleAssignee,
}: {
  statuses: Status[];
  selectedCollaborators: Status[] | undefined;
  handleAssignee: (value: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  // console.log(selectedCollaborators?.length);
  return (
    <div className="flex items-center space-x-4 pl-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className=" flex justify-start gap-2 border-0 bg-transparent">
            {selectedCollaborators?.length !== 0 ? (
              <>
                {selectedCollaborators?.map((n) => (
                  <div key={nanoid()} className="flex items-center">
                    <button type="button">
                      <img
                        src={n?.icon}
                        alt=""
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                      />
                    </button>
                  </div>
                ))}
                {(selectedCollaborators?.length as number) === 2 && (
                  <>
                    {" "}
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
                  </>
                )}{" "}
                {(selectedCollaborators?.length as number) === 1 && (
                  <>
                    {" "}
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
                  </>
                )}{" "}
                {(selectedCollaborators?.length as number) <= 1 && (
                  <>
                    {" "}
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
                  </>
                )}
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
        <PopoverContent className=" p-0" side="right" align="start">
          <Command>
            <MultiSelect
              placeholder="Select a collaborators"
              data={statuses}
              searchable
              defaultValue={selectedCollaborators?.map((n) => n.value)}
              styles={{
                input: {
                  border: "1px black",
                  borderBottom: "1px",
                  borderColor: "black",
                },
              }}
              onChange={(value) => {
                handleAssignee(value);
              }}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
