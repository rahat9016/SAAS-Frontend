"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const SEARCH_TYPES = ["Style", "Material", "Supplier", "Document"];
const SEARCH_SCOPES = ["All", "This Season", "This Department"];

export default function HeaderSearchBar() {
  const [type, setType] = useState(SEARCH_TYPES[0]);
  const [scope, setScope] = useState(SEARCH_SCOPES[0]);
  const [query, setQuery] = useState("");

  return (
    <div className="hidden md:flex items-center flex-1 max-w-2xl h-10 rounded-md border border-skeleton bg-white overflow-hidden">
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="h-full rounded-none border-0 border-r border-skeleton bg-transparent px-3 text-sm text-secondary-dark shadow-none focus-visible:ring-0 w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SEARCH_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="flex-1 h-full px-3 text-sm text-secondary-dark placeholder:text-[#8C8C8C] outline-none min-w-0"
      />

      <span className="hidden lg:inline text-xs text-[#8C8C8C] px-1 shrink-0">
        in
      </span>

      <Select value={scope} onValueChange={setScope}>
        <SelectTrigger className="hidden lg:flex h-full rounded-none border-0 border-l border-skeleton bg-transparent px-3 text-sm text-secondary-dark shadow-none focus-visible:ring-0 w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SEARCH_SCOPES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="button"
        aria-label="Search"
        className="h-full px-3 border-l border-skeleton text-secondary-dark hover:bg-gray-50 shrink-0"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
}
