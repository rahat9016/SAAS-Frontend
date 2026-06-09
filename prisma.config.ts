import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    // generate does not connect; placeholder keeps CI install working when DATABASE_URL is unset
    url: process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/placeholder",
  },
});

