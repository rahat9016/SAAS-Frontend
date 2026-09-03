import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import { DataTable } from "@/src/components/ui/data-table";
import {
  ColorwayFlag,
  ColorwayTextField,
  mapColorwayToArticle,
  setColorwayField,
  setColorwayFlag,
  unmapColorwayFromArticle,
} from "@/src/lib/redux/features/colorway/colorwaySlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import {
  ArticleColorwayFilterableField,
  GetArticleColorwayColumns,
} from "../TableColumns/ArticleColorwayColumns";
import MapColorwayModal from "../Form/MapColorwayModal";

const textFilterFields = ["name", "colorway", "spec", "standard", "pantone"] as const;
const flagFilterFields = [
  "active",
  "inTheme",
  "sustLabelOff",
  "planSms",
  "plan3dSms",
  "actualSms",
] as const;

const colorwayStatusFilterOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

interface ColorwaysTabProps {
  articleId: string;
}

export default function ColorwaysTab({ articleId }: ColorwaysTabProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.colorway.items);
  const { sortBy } = useAppSelector((state) => state.filter);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<
    Partial<Record<ArticleColorwayFilterableField, string>>
  >({});

  const handleColumnFilterChange = (
    field: ArticleColorwayFilterableField,
    value: string
  ) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
  };

  const allItems = useMemo(() => Object.values(items), [items]);
  const articleItems = useMemo(
    () => allItems.filter((item) => item.articleIds.includes(articleId)),
    [allItems, articleId]
  );

  const filterOptions = useMemo(() => {
    const map: Partial<Record<ArticleColorwayFilterableField, string[]>> = {};
    textFilterFields.forEach((field) => {
      map[field] = Array.from(
        new Set(articleItems.map((item) => item[field]).filter(Boolean))
      ).sort();
    });
    flagFilterFields.forEach((field) => {
      map[field] = ["true", "false"];
    });
    return map;
  }, [articleItems]);

  const data = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articleItems.filter((item) => {
      const matchesStatus =
        !sortBy ||
        (sortBy === "active" && item.active) ||
        (sortBy === "inactive" && !item.active);
      const matchesSearch =
        !query ||
        [item.name, item.colorway, item.spec, item.description, item.standard, item.pantone]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesColumns = (
        Object.keys(columnFilters) as ArticleColorwayFilterableField[]
      ).every((field) => {
        const filterValue = columnFilters[field];
        if (!filterValue || filterValue === "all") return true;
        if ((flagFilterFields as readonly string[]).includes(field)) {
          return String(item[field]) === filterValue;
        }
        return String(item[field] ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
      return matchesStatus && matchesSearch && matchesColumns;
    });
  }, [articleItems, search, sortBy, columnFilters]);
  const unmappedOptions = useMemo(
    () => allItems.filter((item) => !item.articleIds.includes(articleId)),
    [allItems, articleId]
  );
  const handleMapColorway = (code: string) => {
    dispatch(mapColorwayToArticle({ code, articleId }));
    setIsMapModalOpen(false);
  };
  const handleRemoveColorway = (code: string) => {
    dispatch(unmapColorwayFromArticle({ code, articleId }));
  };
  const handleFieldChange = (code: string, field: ColorwayTextField, value: string) => {
    dispatch(setColorwayField({ code, field, value }));
  };
  const handleToggleFlag = (code: string, field: ColorwayFlag, value: boolean) => {
    dispatch(setColorwayFlag({ code, field, value }));
  };
  const columns = useMemo(
    () =>
      GetArticleColorwayColumns(
        handleRemoveColorway,
        handleFieldChange,
        handleToggleFlag,
        filterOptions,
        columnFilters,
        handleColumnFilterChange
      ),
    [filterOptions, columnFilters]
  );

  return (
    <div className="w-full mt-4">
      <DataTable
        columns={columns}
        data={data}
        title="Colorways"
        icon={<Palette />}
        IsCreate
        createTitle="New color way"
        setIsModalOpen={setIsMapModalOpen}
        showSearch
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search colorway..."
        isShowStatus
        statusOptions={colorwayStatusFilterOptions}
        showColumnFilters
        totalItems={data.length}
        itemsPerPage={data.length || 10}
        currentPage={1}
      />

      <MapColorwayModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        options={unmappedOptions}
        onSubmit={handleMapColorway}
      />
    </div>
  );
}
