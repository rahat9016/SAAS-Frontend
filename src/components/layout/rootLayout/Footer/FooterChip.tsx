/** Small bordered label pill (e.g. Hermes, SEPA, Invoice). */
export default function FooterChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white px-2.5 text-[11px] font-semibold text-gray-600">
      {children}
    </span>
  );
}
