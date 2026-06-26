import { promises } from "../footerData";

/** Plain list of brand promises. */
export default function PromiseList() {
  return (
    <ul className="space-y-2">
      {promises.map((p) => (
        <li key={p} className="text-sm text-gray-600">
          {p}
        </li>
      ))}
    </ul>
  );
}
