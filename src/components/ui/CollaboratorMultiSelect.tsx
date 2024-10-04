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
import useSearch from "@/hooks/useSearch"
import { cn } from "@/lib/utils"
import { Avatar, HoverCard, MultiSelect } from "@mantine/core"
import React from "react"
import { useEffect, useState } from "react"
import { LuCheck } from "react-icons/lu"

type Status = {
  label: string
  value: string
  image: string | null
  type?: "AGENCY_MEMBER" | "CLIENT_MEMBER"
}
type StatusOld = {
  label: string
  value: string
  icon: string | null
}

export function CollaboratorSelect({
  collaboratorList,
  selectedCollaborators,
  handleAssignee,
}: {
  collaboratorList: StatusOld[]
  selectedCollaborators: StatusOld[] | undefined
  handleAssignee: (value: string[], filteredArray1: StatusOld[]) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild={true}>
          <div className=" flex justify-start gap-2 border-0 bg-transparent">
            {selectedCollaborators?.length !== 0 ? (
              <>
                {selectedCollaborators?.map((n) => {
                  return (
                    <div key={n.value} className="flex items-center">
                      <button type="button">
                        <Avatar src={n?.icon as string}>
                          {n?.label?.charAt(0) ?? ""}
                        </Avatar>
                      </button>
                    </div>
                  )
                })}
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <button type="button">
                      <Avatar className="border border-dotted ">
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
              searchable={true}
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
                )
                handleAssignee(value, filteredArray1)
              }}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
export const CollaboratorMultiSelect = ({
  prevData,
  onSelect,
  initialData,
  hoverCardMessage,
}: {
  prevData: string[]
  initialData:
    | {
        groupName: string
        data: Status[]
      }[]
    | undefined
  onSelect: (value: string[]) => void
  hoverCardMessage?: string
}) => {
  const [data, setData] = useState<
    | {
        groupName: string
        data: Status[]
      }[]
    | undefined
  >([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Status[]>([])
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])

  useEffect(() => {
    if (prevData.length !== 0) {
      const selectedValues = data?.flatMap((n) => {
        return n.data.filter((d) => prevData?.includes(d.value))
      }) as Status[]

      setSelected(selectedValues)
    }
  }, [prevData, data])

  const search = useSearch<{
    groupName: string
    data: Status[]
  }>({
    data: data ?? [],
    keys: ["data.label", "data.value"],
    searchQuery: inputValue,
  })

  const handleSelect = (value: string) => {
    const selectedValues = selected?.map((s) => s.value)
    onSelect([...selectedValues, value])
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild={true}>
        <div className=" flex justify-start gap-2 border-0 bg-transparent">
          {selected?.length !== 0 ? (
            <>
              <Avatar.Group>
                {selected.slice(0, 9).map((n) => {
                  return (
                    <Avatar key={n.value} src={n?.image as string}>
                      {n?.image}
                    </Avatar>
                  )
                })}
                {selected.length > 9 && <Avatar>+{selected.length - 9}</Avatar>}
                {selected.length < 3 && (
                  <>
                    <HoverCard width={130}>
                      <HoverCard.Target>
                        <Avatar></Avatar>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <p className="text-xs">{hoverCardMessage}</p>
                      </HoverCard.Dropdown>
                    </HoverCard>{" "}
                    <HoverCard width={130}>
                      <HoverCard.Target>
                        <Avatar></Avatar>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <p className="text-xs">{hoverCardMessage}</p>
                      </HoverCard.Dropdown>
                    </HoverCard>{" "}
                  </>
                )}
                {selected.length < 1 && (
                  <HoverCard width={130}>
                    <HoverCard.Target>
                      <Avatar></Avatar>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <p className="text-xs">{hoverCardMessage}</p>
                    </HoverCard.Dropdown>
                  </HoverCard>
                )}
              </Avatar.Group>
            </>
          ) : (
            <>
              <Avatar.Group>
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <Avatar></Avatar>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">{hoverCardMessage}</p>
                  </HoverCard.Dropdown>
                </HoverCard>
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <Avatar></Avatar>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">{hoverCardMessage}</p>
                  </HoverCard.Dropdown>
                </HoverCard>{" "}
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <Avatar></Avatar>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">{hoverCardMessage}</p>
                  </HoverCard.Dropdown>
                </HoverCard>{" "}
                <HoverCard width={130}>
                  <HoverCard.Target>
                    <Avatar></Avatar>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-xs">{hoverCardMessage}</p>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Avatar.Group>
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="mr-3 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Search collaborators..."
          />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {search?.map((group) => {
              if (group.data.length !== 0) {
                return (
                  <CommandGroup key={group.groupName} heading={group.groupName}>
                    {group.data?.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        defaultValue={item.value}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onSelect={(value) => {
                          console.log(value, "value")
                          if (selected?.find((s) => s?.value === value)) {
                            const selectedValues = selected
                              ?.filter((s) => s?.value !== value)
                              .map((s) => s?.value)
                            setSelected((prev) =>
                              prev.filter((s) => s?.value !== value),
                            )
                            console.log(selectedValues, "selectedValues")
                            onSelect(selectedValues)
                          } else {
                            setInputValue("")
                            setSelected((prev) => [...prev, item])
                            handleSelect(value)
                          }
                        }}
                        className={"cursor-pointer"}
                      >
                        <LuCheck
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected?.find((s) => s?.value === item?.value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <span>{item.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              }
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
export const AssignToSelect = ({
  value,
  onSelect,
  data,
  hoverCardMessage,
}: {
  value: string
  data:
    | {
        groupName: string
        data: Status[]
      }[]
    | undefined
  onSelect: (values: string, type?: "AGENCY_MEMBER" | "CLIENT_MEMBER") => void
  hoverCardMessage?: string
}) => {
  const [allData, setAllData] = useState<
    | {
        groupName: string
        data: Status[]
      }[]
    | undefined
  >([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Status | null>(null)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (data) {
      setAllData(data)
    }
  }, [data])

  useEffect(() => {
    if (value) {
      const selectedValues = allData
        ?.flatMap((n) => n.data)
        .find((d) => d.value === value)

      selectedValues && setSelected(selectedValues)
    }
  }, [allData, value])

  const search = useSearch<{
    groupName: string
    data: Status[]
  }>({
    data: allData ?? [],
    keys: ["data.label", "data.value"],
    searchQuery: inputValue,
  })

  const handleSelect = (
    value: string,
    type?: "AGENCY_MEMBER" | "CLIENT_MEMBER",
  ) => {
    setInputValue("")

    setOpen(false)
    onSelect(value, type)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild={true}>
        <div className=" flex justify-start gap-2 border-0 bg-transparent">
          {selected ? (
            <Avatar.Group>
              <Avatar key={selected?.value}>{selected?.image}</Avatar>
              {/* <HoverCard width={130}>
                <HoverCard.Target>
                  <Avatar>
                    
                  </Avatar>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <p className="text-xs">{hoverCardMessage}</p>
                </HoverCard.Dropdown>
              </HoverCard> */}
            </Avatar.Group>
          ) : (
            <Avatar.Group>
              <HoverCard width={130}>
                <HoverCard.Target>
                  <Avatar></Avatar>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <p className="text-xs">{hoverCardMessage}</p>
                </HoverCard.Dropdown>
              </HoverCard>
            </Avatar.Group>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="mr-3 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Search..."
          />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {search?.map((group) => {
              if (group.data.length !== 0) {
                return (
                  <CommandGroup key={group.groupName} heading={group.groupName}>
                    {group.data?.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        defaultValue={item.value}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onSelect={(value) => {
                          if (selected?.value !== item.value) {
                            setInputValue("")
                            setSelected(item)

                            handleSelect(value, item.type)
                          } else {
                            setInputValue("")
                            setSelected(null)
                            handleSelect("")
                          }
                        }}
                        className={"cursor-pointer"}
                      >
                        <LuCheck
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected?.value === item.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <span>{item.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              }
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
