import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // `prisma generate` (postinstall) doesn't connect, so don't fail when unset (e.g. CI install step).
    url:
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
