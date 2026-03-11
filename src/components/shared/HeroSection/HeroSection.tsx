"use client";

import { siteConfig } from "@/src/config/siteConfig";
import { useGet } from "@/src/hooks/useGet";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import HeroSectionSkeleton from "./HeroSectionSkeleton";
import { IHeroItem } from "./types";

interface IHero {
  page?: string;
  type: string;
  // title?: string;
  // desc?: string;
  className?: string;
  classTitle?: string;
  classDesc?: string;
}

const HeroSection = ({
  type,
  // title,
  // desc,
  className,
  classTitle,
  classDesc,
}: IHero) => {
  const { data, isLoading } = useGet<IHeroItem[]>(`/hero?type=${type}`, [
    type,
    "hero-section",
    "about-hero",
    "OUR_MISSION",
  ]);
  const heroData = data?.data;

  return (
    <div>
      {isLoading ? (
        <HeroSectionSkeleton />
      ) : (
        <div
          className={cn("relative w-full min-h-[40vh] max-h-[40vh]", className)}
        >
          {heroData && (
            <Image
              src={heroData[0].images[0]}
              alt={heroData[0].title || siteConfig.name}
              fill
              priority
              className="object-cover object-center w-full h-full"
            />
          )}
          <div className=" absolute inset-0 bg-[linear-gradient(174deg,rgba(0,0,0,0)_25.63%,rgba(15,14,64,0.3)_44.73%)] blur-xs" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {heroData && (
              <h1
                className={cn(
                  "text-[4vh] lg:text-[5vh] text-white font-semibold font-inter drop-shadow-lg",
                  classTitle
                )}
              >
                {heroData[0].title}
              </h1>
            )}
            {heroData && (
              <p
                className={cn(
                  "mt-[2vh] text-[2vh] lg:text-[2.5vh] text-white/90 font-inter font-medium w-full lg:w-6/12 leading-snug",
                  classDesc
                )}
              >
                {heroData[0].description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
