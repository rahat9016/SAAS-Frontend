export default function ProfileDropdownSkeleton() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full">
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      <div className="hidden xl:flex flex-col gap-1">
        <div className="w-20 h-2.5 bg-gray-200 rounded animate-pulse" />
        <div className="w-14 h-2 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}
