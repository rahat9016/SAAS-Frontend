import { cn } from "@/src/lib/utils";
import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../../ui/input";

function formatTime(dateTime: string | Date) {
  const date = new Date(dateTime);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Combine selected time with today’s date
function combineWithToday(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now.toISOString(); // you can also return `now` directly if you want a Date object
}
export function ControlledTimeField({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn("flex items-center gap-2", className)}>
          <Input
            ref={inputRef}
            type="time"
            value={field.value ? formatTime(field.value) : ""}
            onChange={(e) => {
              const time = e.target.value;
              const fullDateTime = combineWithToday(time);
              field.onChange(fullDateTime);
            }}
            className="bg-transparent h-full w-full text-secondary text-sm flex items-center"
            onClick={() => inputRef.current?.showPicker?.()}
          />
        </div>
      )}
    />
  );
}
