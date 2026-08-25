import { Plus, Search } from "lucide-react";
import { ReactNode } from "react";

import { clearFilters } from "@/src/lib/redux/features/filter/filterSlice";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import Pagination from "../shared/Pagination";
import Paragraph from "../shared/Paragraph";
import StatusFilter from "../shared/StatusFilter/StatusFilter";
import TableTopBarHeader from "../shared/TableTopBarHeader";
import { Button } from "./button";
import { Input } from "./input";
import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// Types
export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  /** Allow this cell's content to wrap onto multiple lines instead of being truncated. */
  wrap?: boolean;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  tabs?: {
    name: string;
    route?: string;
  }[];
  /**
   * "default" — page level table: top bar, toolbar and pagination.
   * "plain"   — embedded table only, for dashboard boards / cards / modals.
   */
  variant?: "default" | "plain";
  isLoading?: boolean;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  setItemsPerPage?: ((page: string | number) => void) | undefined;
  createTitle?: string;
  title?: string;
  icon?: ReactNode;
  subtitle?: string;
  searchValue?: string;
  tableTitle?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showSearch?: boolean;
  isShowStatus?: boolean;
  searchPlaceholder?: string;
  setIsModalOpen?: (isOpen: boolean) => void;
  IsCreate?: boolean;
  routeURL?: string;
  setSelectedId?: (id: string) => void;
  options?: { value: string; label: string }[];
  rightComponents?: ReactNode;
  statusOptions?: { label: string; value: string }[];
}

export function DataTable<T>({
  columns,
  data,
  tabs = [],
  variant = "default",
  isLoading = false,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  setItemsPerPage,
  title,
  icon,
  setIsModalOpen,
  IsCreate = false,
  createTitle = "Create",
  routeURL,
  showSearch = true,
  searchValue,
  tableTitle,
  onSearchChange,
  searchPlaceholder = "Searching...",
  rightComponents,
  statusOptions,
  isShowStatus = true,
}: DataTableProps<T>) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pathname = usePathname();
  const isPlain = variant === "plain";
  const skeletonRows = isPlain ? 4 : itemsPerPage;

  return (
    <>
      {!isPlain && (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3 bg-white border border-light-dark rounded-lg px-5 py-4">
          <TableTopBarHeader title={title} icon={icon} />

          {IsCreate && (
            <Button
              className="text-white font-inter text-sm font-medium bg-primary hover:bg-primary/90 h-11 gap-1.5 px-6! rounded-lg shadow-sm transition-colors lg:ml-auto"
              onClick={() => {
                if (routeURL) {
                  router.push(routeURL);
                } else if (setIsModalOpen) {
                  setIsModalOpen(true);
                }
              }}
            >
              <Plus className="size-4 text-white" /> {createTitle}
            </Button>
          )}
        </div>
      )}

      <div>
        <div className="w-full overflow-x-auto scrollbar-hide">
          {!isPlain &&
            (tableTitle ||
              tabs.length > 0 ||
              showSearch ||
              rightComponents ||
              isShowStatus) && (
            <div
              id="table-tab"
              className="bg-white p-5 rounded-t-lg border border-light-dark"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {tableTitle && (
                  <Paragraph className="text-sm xl:text-xl  text-secondary-dark font-semibold">
                    {tableTitle}
                  </Paragraph>
                )}
                <div className="flex  items-center gap-3">
                  {tabs.length > 0 ? (
                    <div className="overflow-hidden rounded-sm border border-light-dark h-11">
                      {tabs.map((tab) => (
                        <Button
                          key={tab.name}
                          className={`h-full text-secondary-dark rounded-none cursor-pointer text-sm font-medium  ${
                            pathname === tab.route
                              ? "bg-primary text-white"
                              : "bg-transparent hover:bg-transparent"
                          }`}
                          onClick={() => {
                            router.push(tab.route as string);
                            dispatch(clearFilters());
                          }}
                        >
                          {tab.name}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    showSearch && (
                      <div className="flex items-center border border-light-dark px-3 rounded-[6px] h-11 w-full max-w-60">
                        <Search className="text-[#BDBDBD]" />
                        <Input
                          placeholder={searchPlaceholder}
                          value={searchValue}
                          onChange={onSearchChange}
                          className="border-none shadow-none focus-visible:ring-0 placeholder:text-[#BDBDBD] bg-transparent"
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {tabs.length > 0 && showSearch && (
                    <div className="flex items-center border border-light-dark px-3 rounded-[6px] h-11 w-full max-w-60">
                      <Search className="text-[#BDBDBD]" />
                      <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={onSearchChange}
                        className="border-none shadow-none focus-visible:ring-0 placeholder:text-[#BDBDBD] bg-transparent"
                      />
                    </div>
                  )}
                  {rightComponents}
                  {isShowStatus && (
                    <StatusFilter statusOptions={statusOptions} />
                  )}
                </div>
              </div>
            </div>
          )}

          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow
                className={
                  isPlain
                    ? "bg-light/70 h-11 hover:bg-light/70 border-b border-light-dark"
                    : "bg-[#5098D5] h-15 border border-light-dark border-b-[3px] border-b-[#5098D5]"
                }
              >
                {columns.map((column, index) => {
                  return (
                    <TableHead
                      key={index}
                      className={`${
                        isPlain
                          ? "font-semibold text-[11px] uppercase tracking-wide text-secondary-gary px-4 whitespace-nowrap"
                          : `font-medium text-sm text-white px-5 ${
                              index < columns.length - 1
                                ? "border-r border-white/30"
                                : ""
                            }`
                      } ${alignClass(column)}`}
                    >
                      {column.header}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody
              className={
                isPlain ? "bg-white" : "border border-light-dark bg-white"
              }
            >
              {isLoading ? (
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <TableRow
                    className={isPlain ? "h-12" : "h-18"}
                    key={`skeleton-${rowIndex}`}
                  >
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex} className="max-w-50">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className={`w-full text-center ${
                      isPlain
                        ? "h-32 text-sm text-secondary-gary"
                        : "h-[50vh]"
                    }`}
                  >
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow
                    className={
                      isPlain
                        ? "h-12 even:bg-light/40 hover:bg-primary/5 transition-colors"
                        : "h-18"
                    }
                    key={rowIndex}
                  >
                    {columns.map((column, idx) => {
                      const value = row[column.accessorKey];
                      const borderR =
                        !isPlain && idx < columns.length - 1
                          ? "border-r border-light-dark"
                          : "";
                      return (
                        <TableCell
                          key={`${rowIndex}-${idx}-${String(
                            column.accessorKey
                          )}`}
                          className={`${
                            isPlain
                              ? "whitespace-nowrap px-4 py-2.5 text-sm text-secondary-gary border-b border-light-dark/60"
                              : column.wrap
                              ? `whitespace-normal align-top py-3 px-5 text-sm text-secondary-gary border-b border-light-dark ${borderR}`
                              : `max-w-50 truncate whitespace-nowrap px-5 text-sm text-secondary-gary border-b border-light-dark ${borderR}`
                          } ${alignClass(column)}`}
                        >
                          {column?.cell
                            ? column.cell(value, row)
                            : (value as React.ReactNode)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!isPlain && (
          <div className="bg-white border border-t-0 border-light-dark  rounded-b-lg">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange ?? (() => {})}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
      </div>
    </>
  );
}

/** Column alignment — "actions" keeps its right alignment on page level tables */
function alignClass<T>(column: ColumnDef<T>) {
  if (column.align === "right") return "text-end";
  if (column.align === "center") return "text-center";
  if (column.align === "left") return "text-start";
  return column.accessorKey === "actions" ? "text-end" : "text-start";
}
