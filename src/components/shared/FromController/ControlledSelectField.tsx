import React from "react";

import { cn } from "@/src/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type Option = {
  label: string;
  value: string | boolean | number;
};

interface ControlledSelectFieldProps {
  name: string;
  options: Option[];
  placeholder?: string;
  description?: string;
  className?: string;
}
const ControlledSelectField: React.FC<ControlledSelectFieldProps> = ({
  name,
  options,
  placeholder,
  className,
}) => {
  const { control } = useFormContext();
  return (
    <div className="relative w-full">
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <>
              <Select
                onValueChange={(val) => {
                  if (val === "true") field.onChange(true);
                  else if (val === "false") field.onChange(false);
                  else if (!isNaN(Number(val))) field.onChange(Number(val));
                  else field.onChange(val);
                }}
                value={
                  field.value === true
                    ? "true"
                    : field.value === false
                      ? "false"
                      : field.value !== undefined
                        ? String(field.value)
                        : ""
                }
              >
                <SelectTrigger
                  className={cn(
                    `flex h-10.5 w-full rounded-md border border-input bg-white px-3 py-1 text-base shadow-none transition-colors file:border-0 focus:outline-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                      error
                        ? "border border-rose-500"
                        : "focus:ring-grayDark focus:border-[#D9E3E7]"
                    }`,
                    className
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem
                      key={String(opt.value)}
                      value={String(opt.value)}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && error && (
                <div className="text-rose-500 text-xs mt-1 pl-2">
                  {error.message}
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default ControlledSelectField;
