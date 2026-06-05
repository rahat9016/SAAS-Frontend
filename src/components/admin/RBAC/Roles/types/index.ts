export type { RbacRole, RbacRoleScope } from "@/src/types/rbac/rbac";

/** Strip the "<CODE> - " prefix the API adds to branch role names. */
export const stripRolePrefix = (name: string) => name.replace(/^[^-]+ - /, "");
