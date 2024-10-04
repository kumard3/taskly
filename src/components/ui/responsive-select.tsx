import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@mantine/hooks"
import { type IconType } from "react-icons/lib"
import { cn } from "@/lib/utils"

import { RxCheck } from "react-icons/rx"
import { Separator } from "./separator"
import { LuPlus } from "react-icons/lu"

type IPData = {
  value: string
  label: string
  icon?: IconType
}

export function ComboBoxResponsive({
  data,
  title,
  classNameButton,
  onSelect,
  value,
  creatable,
}: {
  data?: IPData[]
  title: string
  classNameButton?: string
  value?: string
  onSelect: (value: string) => void
  creatable?: {
    title: string
    isCreateAble: boolean
    onSelect: () => void
  }
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedValues, setSelectedValues] = React.useState<IPData | null>(
    null,
  )

  React.useEffect(() => {
    if (value) {
      setSelectedValues(
        data?.find((priority) => priority.value === value) || null,
      )
    }
  }, [data, value])

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("group w-[150px] justify-start", classNameButton)}
          >
            {selectedValues ? (
              <>
                {selectedValues?.icon && (
                  <selectedValues.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                {selectedValues.label}
              </>
            ) : (
              <span className="text-gray-400 group-hover:text-gray-600">
                {title}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <SelectList
            data={data}
            setOpen={setOpen}
            setSelectedValues={setSelectedValues}
            selectedValues={selectedValues}
            onSelect={onSelect}
            creatable={creatable}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[150px] justify-start", classNameButton)}
        >
          {selectedValues ? (
            <>
              {selectedValues?.icon && (
                <selectedValues.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              {selectedValues.label}
            </>
          ) : (
            <span className="text-gray-400">{title}</span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <SelectList
            data={data}
            setOpen={setOpen}
            setSelectedValues={setSelectedValues}
            selectedValues={selectedValues}
            onSelect={onSelect}
            creatable={creatable}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function SelectList({
  setOpen,
  setSelectedValues,
  data,
  selectedValues,
  onSelect,
  creatable,
}: {
  setOpen: (open: boolean) => void
  setSelectedValues: (status: IPData | null) => void
  data?: IPData[]
  selectedValues: IPData | null
  onSelect: (value: string) => void
  creatable?: {
    title: string
    isCreateAble: boolean
    onSelect: () => void
  }
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {data?.map((option) => {
            const isSelected = selectedValues?.value === option.value
            return (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(value) => {
                  if (!isSelected) {
                    setSelectedValues(
                      data.find((priority) => priority.value === value) || null,
                    )
                    onSelect(value)
                    setOpen(false)
                  } else {
                    setSelectedValues(null)
                    onSelect("")
                    setOpen(false)
                  }
                }}
              >
                {option?.icon && (
                  <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                {option?.label}
                <RxCheck
                  className={cn(
                    "ml-auto h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
      {creatable?.isCreateAble && (
        <CommandGroup>
          <Separator />
          <CommandItem onSelect={() => creatable.onSelect()}>
            <Button className="m-0 h-auto p-0">
              <LuPlus className="mr-2 h-4 w-4" />
              {creatable.title}
            </Button>
          </CommandItem>
        </CommandGroup>
      )}
    </Command>
  )
}
