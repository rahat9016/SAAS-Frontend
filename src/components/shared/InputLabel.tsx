import { cn } from "@/src/lib/utils";

export default function InputLabel({
  label,
  required,
  className,
}: {
  label: string | undefined;
  required?: boolean;
  className?: string;
}) {
  return (
    <div>
      {label && (
        <p
          className={cn(
            `text-secondary-dark text-base mb-1 font-normal`,
            className
          )}
        >
          {label}
          {required && <span className="text-rose-600">*</span>}
        </p>
      )}
    </div>
  );
}
