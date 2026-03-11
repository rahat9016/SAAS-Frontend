"use client";
import { useGet } from "@/src/hooks/useGet";
import CreateUpdateHeroManagement from "./Form/CreateUpdateHeroManagement";
import HeroManagementFormSkeleton from "./Skeleton/HeroManagementFormSkeleton";
import { IHeroManagement } from "./types";

export default function HeroManagement() {
  const { data, isLoading } = useGet<IHeroManagement>(`/hero-management`, [
    "hero-management",
  ]);
  const heroData = data?.data;
  return (
    <div>
      {isLoading ? (
        <HeroManagementFormSkeleton />
      ) : (
        <CreateUpdateHeroManagement initialValues={heroData} />
      )}
    </div>
  );
}
