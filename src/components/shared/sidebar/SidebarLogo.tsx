import { siteConfig } from "@/src/config/siteConfig";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SidebarLogo() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="flex flex-row items-center cursor-pointer gap-1 h-18"
    >
      <Image
        width={216}
        height={216}
        src="/logo.png"
        alt="logo"
        className="w-13"
      />
      <div>
        <h3 className="text-base text-secondary-dark font-semibold">
          {siteConfig.name}
        </h3>
      </div>
    </div>
  );
}
