import { useEffect, useState } from "react"
import { addDays, format } from "date-fns"
import { LuCalendar as LuCalendar } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import moment from "moment"

export function DatePickerWithPresets({
  handleDueDate,
  value,
}: {
  handleDueDate: (dueDate: any) => void
  value: string | null
}) {
  const [date, setDate] = useState<Date | null>()
  useEffect(() => {
    if (value) {
      setDate(new Date(value))
    } else {
      setDate(new Date())
    }
  }, [value])

  if (date) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              moment(date).isBefore(new Date()) &&
                "border-red-600 text-red-600 ",
            )}
          >
            <LuCalendar className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
          <Select
            onValueChange={(value) =>
              handleDueDate(addDays(new Date(), parseInt(value)).toString())
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="z-[1000]" position="popper">
              <SelectItem value="0">Today</SelectItem>
              <SelectItem value="1">Tomorrow</SelectItem>
              <SelectItem value="3">In 3 days</SelectItem>
              <SelectItem value="7">In a week</SelectItem>
            </SelectContent>
          </Select>
          <div className={cn("rounded-lg border")}>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                handleDueDate(date?.toString())
                date && setDate(date)
              }}
              disabled={{ before: new Date() }} // Disable Sundays and Saturdays
            />
          </div>
        </PopoverContent>
      </Popover>
    )
  }
}

export function DatePickerWithPresetsNull({
  handleDueDate,
}: {
  handleDueDate: (dueDate: any) => void
}) {
  const [date, setDate] = useState<Date>()

  const dateMoment = moment(date).isBefore(new Date())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            dateMoment && "border-red-600 text-red-600 ",
          )}
        >
          <LuCalendar className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            handleDueDate(addDays(new Date(), parseInt(value)).toString())
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="z-[1000]" position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className={cn("rounded-lg border")}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              if (date) {
                handleDueDate(date?.toString())
                setDate(date)
              }
            }}
            // disabled={(date) =>
            //   date < new Date() || date < new Date("1900-01-01")
            // }

            disabled={{ before: new Date() }} // Disable Sundays and Saturdays
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * DatePickerWithIcon component renders a date picker with an icon and a select dropdown
 * to choose a due date. It allows the user to select a date from a calendar or choose
 * predefined options like "Today", "Tomorrow", "In 3 days", and "In a week".
 *
 * @param {Object} props - The properties object.
 * @param {(dueDate: any) => void} props.handleDueDate - Callback function to handle the selected due date.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @param {string | null} props.value - The current selected date value.
 * @param {boolean} [props.open] - Optional flag to control the open state of the date picker.
 * @param {(open: boolean) => void} [props.onOpenChange] - Optional callback function to handle the open state change.
 *
 * @returns {JSX.Element} The rendered DatePickerWithIcon component.
 */
export function DatePickerWithIcon({
  handleDueDate,
  className,
  value,
  open,
  onOpenChange,
}: {
  handleDueDate: (dueDate: any) => void
  className?: string
  value: string | null
  open?: boolean | undefined
  onOpenChange?: ((open: boolean) => void) | undefined
}): JSX.Element {
  const [date, setDate] = useState<Date>()
  useEffect(() => {
    if (value) {
      setDate(new Date(value))
    } else {
      setDate(new Date())
    }
  }, [value])
  return (
    <div className="flex w-auto flex-col space-y-2 p-2">
      <Select
        onValueChange={(value) =>
          handleDueDate(addDays(new Date(), parseInt(value)).toString())
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="z-[1000]" position="popper">
          {" "}
          <SelectItem value="0">Today</SelectItem>
          <SelectItem value="1">Tomorrow</SelectItem>
          <SelectItem value="3">In 3 days</SelectItem>
          <SelectItem value="7">In a week</SelectItem>
        </SelectContent>
      </Select>
      <div className={cn("w-full rounded-lg  border")}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            if (date) {
              handleDueDate(date?.toString())
              setDate(date)
            }
          }}
          disabled={{ before: new Date() }} // Disable Sundays and Saturdays
          classNames={{
            root: " w-full",
          }}
        />
      </div>
    </div>
  )
}
