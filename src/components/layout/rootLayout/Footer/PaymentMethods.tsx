import {
  FaCcAmex,
  FaCcApplePay,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
} from "react-icons/fa6";
import { SiKlarna } from "react-icons/si";
import FooterChip from "./FooterChip";

const PAYMENTS = [
  { Icon: FaCcVisa, color: "#1A1F71", label: "Visa" },
  { Icon: FaCcMastercard, color: "#EB001B", label: "Mastercard" },
  { Icon: FaCcPaypal, color: "#003087", label: "PayPal" },
  { Icon: FaCcAmex, color: "#2E77BC", label: "American Express" },
  { Icon: FaCcDiscover, color: "#FF6000", label: "Discover" },
  { Icon: FaCcDinersClub, color: "#0079BE", label: "Diners Club" },
  { Icon: FaCcApplePay, color: "#000000", label: "Apple Pay" },
  { Icon: SiKlarna, color: "#FFB3C7", label: "Klarna" },
];

/** Accepted payment method badges. */
export default function PaymentMethods() {
  return (
    <div className="grid grid-cols-[repeat(4,max-content)] lg:grid-cols-[repeat(5,max-content)] gap-2">
      {PAYMENTS.map(({ Icon, color, label }) => (
        <span
          key={label}
          title={label}
          className="grid h-9 w-12 place-items-center rounded-md border border-gray-200 bg-white"
        >
          <Icon size={26} color={color} />
        </span>
      ))}
      <FooterChip>SEPA</FooterChip>
      <FooterChip>Invoice</FooterChip>
    </div>
  );
}
