import { ReactNode } from "react";
import DynamicBreadcrumb from "./DynamicBreadcrumb";

interface TableHeaderProps {
  title?: string;
  icon?: ReactNode;
}

export default function TableTopBarHeader({ title, icon }: TableHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row w-full lg:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center size-11 rounded-lg bg-primary/10 text-primary shrink-0 [&>svg]:size-5">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl text-secondary-dark font-bold tracking-tight">
            {title}
          </h1>
          <DynamicBreadcrumb />
        </div>
      </div>
    </div>
  );
}
