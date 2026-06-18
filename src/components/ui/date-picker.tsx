"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string; // ISO string format YYYY-MM-DD or standard date format
  onChange?: (dateString: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
}: DatePickerProps) {
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && onChange) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 h-10 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-xs",
            !value && "text-slate-400 dark:text-slate-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
          {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
export default DatePicker;
