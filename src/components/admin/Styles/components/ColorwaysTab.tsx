import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DataTable } from "@/src/components/ui/data-table";
import {
  mapColorwayToArticle,
  unmapColorwayFromArticle,
} from "@/src/lib/redux/features/colorway/colorwaySlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { GetArticleColorwayColumns } from "../TableColumns/ArticleColorwayColumns";
import MapColorwayModal from "../Form/MapColorwayModal";

interface ColorwaysTabProps {
  articleId: string;
}

export default function ColorwaysTab({ articleId }: ColorwaysTabProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.colorway.items);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const allItems = useMemo(() => Object.values(items), [items]);
  const data = useMemo(
    () => allItems.filter((item) => item.articleIds.includes(articleId)),
    [allItems, articleId]
  );
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
  const columns = useMemo(
    () => GetArticleColorwayColumns(handleRemoveColorway),
    []
  );

  return (
    <div className="w-full bg-white border border-light-dark rounded-lg overflow-hidden flex flex-col shadow-sm mt-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-light-dark bg-white">
        <button
          type="button"
          onClick={() => setIsMapModalOpen(true)}
          className="h-9 px-4 inline-flex items-center text-sm text-primary font-semibold bg-primary/5 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
        >
          New color way
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 px-4 text-sm text-secondary-dark font-medium bg-white border border-light-dark rounded-lg hover:bg-light-dark/40 transition-colors cursor-pointer"
          >
            Mass Create SKUs
          </button>
          <button
            type="button"
            className="flex items-center gap-1 h-9 px-4 text-sm text-secondary-dark font-medium bg-white border border-light-dark rounded-lg hover:bg-light-dark/40 transition-colors cursor-pointer"
          >
            Actions <ChevronDown className="size-3.5" />
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        showSearch={false}
        isShowStatus={false}
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
