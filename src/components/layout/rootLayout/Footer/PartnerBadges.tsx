import { SiDhl } from "react-icons/si";
import FooterChip from "./FooterChip";

/** Delivery partner badges. */
export default function PartnerBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        title="DHL"
        className="grid h-9 w-14 place-items-center rounded-md border border-gray-200 bg-[#FFCC00]"
      >
        <SiDhl size={34} color="#D40511" />
      </span>
      <FooterChip>Hermes</FooterChip>
    </div>
  );
}
