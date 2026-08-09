import { GENDERS_FALLBACK } from "@/src/components/layout/rootLayout/Header/navLinks";

export interface IGroup {
  id: string;
  name: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt: string;
  actions?: string;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Sourced from the storefront header's own gender groups (navLinks.ts)
// so admin stays in sync with what's actually shown to shoppers.
export const mockGroupsList: IGroup[] = GENDERS_FALLBACK.map((gender) => ({
  id: slug(gender),
  name: gender,
  description: `${gender}'s category group`,
  status: "ACTIVE",
  createdAt: "2026-01-05",
}));
