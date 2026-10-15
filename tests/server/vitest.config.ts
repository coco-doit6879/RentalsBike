import { defineConfig } from "vitest/config";
// Standalone config: the root setup assumes window, but these are real Node APIs.
export default defineConfig({ test: { environment: "node", include: ["tests/server/**/*.test.ts"] } });
