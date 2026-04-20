import StatusBadge from "@/src/components/shared/Status/Status";
import { ColumnDef } from "@/src/components/ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { StatusType } from "@/src/types/common/common";
import { EllipsisVertical, Eye, Pencil } from "lucide-react";
import Image from "next/image";
import { IUser } from "../types";

export const GetUserColumns = (
  onView?: (item: IUser) => void,
  onEdit?: (item: IUser) => void,
  onActivate?: (item: IUser) => void,
  onDeactivate?: (item: IUser) => void
): ColumnDef<IUser>[] => {
  return [
    {
      header: "Profile Picture",
      accessorKey: "profilePicture",
      cell: (value, row) => {
        const profilePicture = value as string | null;
        const user = row as IUser;
        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

        return profilePicture ? (
          <div className="w-10 h-10 border border-[#E6E6E6] flex items-center justify-center rounded-full bg-light overflow-hidden">
            <Image
              src={profilePicture}
              alt={name || "User"}
              width={40}
              height={40}
              className="w-10 h-10 object-cover bg-center"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
            {(user.firstName?.[0] || "U").toUpperCase()}
          </div>
        );
      },
    },
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "First Name",
      accessorKey: "firstName",
    },
    {
      header: "Last Name",
      accessorKey: "lastName",
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (value) => {
        const phone = value as string | null;
        return (
          <span className="text-sm text-secondary-gary">{phone || "-"}</span>
        );
      },
    },
    {
      header: "Verified",
      accessorKey: "isVerified",
      cell: (value) => {
        const isVerified = Boolean(value);
        return (
          <StatusBadge
            status={isVerified ? StatusType.VERIFIED : StatusType.UNVERIFIED}
            className="px-2.5 py-0.5 text-xs font-medium"
          />
        );
      },
    },
    {
      header: "Role",
      accessorKey: "role",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => {
        return (
          <StatusBadge
            status={value as StatusType}
            className="px-2.5 py-0.5 text-xs font-medium"
          />
        );
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as IUser;
        const isActive = String(item.status || "").toUpperCase() === "ACTIVE";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-9 h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light cursor-pointer"
                aria-label="User actions"
              >
                <EllipsisVertical className="h-4 w-4 text-secondary-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                onClick={() => onView?.(item)}
              >
                <Eye className="h-4 w-4" />
                View User
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                onClick={() => onEdit?.(item)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                disabled={isActive}
                onClick={() => onActivate?.(item)}
              >
                Activate
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                disabled={!isActive}
                onClick={() => onDeactivate?.(item)}
              >
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
