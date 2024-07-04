/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { addDays, format } from "date-fns";
import { LuCalendar as LuCalendar } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import moment from "moment";
import { cn } from "@/lib/utils";

export function DatePickerWithPresets({
  handleDueDate,
  value,
}: {
  handleDueDate: (dueDate: any) => void;
  value: string;
}) {
  const [date, setDate] = useState<Date>(new Date(value));

  const dateMoment = moment(date).isBefore(new Date());

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
              handleDueDate(date?.toString());
              date && setDate(date);
            }}
            disabled={{ before: new Date() }} // Disable Sundays and Saturdays
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
export function DatePickerWithPresetsNull({
  handleDueDate,
}: {
  handleDueDate: (dueDate: any) => void;
}) {
  const [date, setDate] = useState<Date>();

  const dateMoment = moment(date).isBefore(new Date());

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
                handleDueDate(date?.toString());
                setDate(date);
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
  );
}
