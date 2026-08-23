import { siteConfig } from "@/src/config/siteConfig";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SidebarLogoProps {
  isCollapsed?: boolean;
}

export default function SidebarLogo({ isCollapsed = false }: SidebarLogoProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      title={siteConfig.name}
      className={cn(
        "flex flex-row items-center cursor-pointer gap-1 h-18",
        isCollapsed && "justify-center gap-0"
      )}
    >
      <Image
        width={216}
        height={216}
        src="/logo.png"
        alt="logo"
        className={cn("w-13", isCollapsed && "w-9")}
      />
      {!isCollapsed && (
        <div>
          <h3 className="text-base text-secondary-dark font-semibold">
            {siteConfig.name}
          </h3>
        </div>
      )}
    </div>
  );
}
