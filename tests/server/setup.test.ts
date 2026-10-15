// @vitest-environment node
import { expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { savePassword } from "../../scripts/admin-setup.mjs";
import { verifyPassword } from "../../src/server/auth";
const require = createRequire(import.meta.url);
const { processEnv } = require("@next/env") as { processEnv: (files: { path: string; contents: string; env: Record<string, string> }[], dir: string, log: { error: () => void }, force: boolean) => [Record<string, string>, unknown] };
it("preserves unrelated .env entries, replaces every old hash, and escapes dotenv expansion", async () => {
  const directory = mkdtempSync(join(process.env.TMPDIR!, "rentals-setup-"));
  const path = join(directory, ".env.local");
  try {
    writeFileSync(path, "# keep this\nSITE_NAME=demo\nADMIN_PASSWORD_HASH=old\nexport ADMIN_PASSWORD_HASH=duplicate\nRENTAL_DB_PATH=private-data/rentals.sqlite\n");
    savePassword("fixture-only-test-password", path);
    const contents = readFileSync(path, "utf8");
    expect(contents).toContain("SITE_NAME=demo");
    expect(contents).toContain("# keep this");
    expect(contents).toContain("RENTAL_DB_PATH=private-data/rentals.sqlite");
    expect(contents.match(/ADMIN_PASSWORD_HASH=/g)).toHaveLength(1);
    expect(contents).not.toContain("fixture-only-test-password");
    const [parsed] = processEnv([{ path: ".env.local", contents, env: {} }], directory, { error: () => {} }, true);
    expect(await verifyPassword("fixture-only-test-password", parsed.ADMIN_PASSWORD_HASH)).toBe(true);
    expect(() => savePassword("short", path)).toThrow();
    expect(readFileSync(path, "utf8")).toBe(contents);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
it("refuses noninteractive stdin without accepting credentials through arguments or pipes", () => {
  const result = spawnSync(process.execPath, ["scripts/admin-setup.mjs"], { input: "not-a-real-secret\n", encoding: "utf8", cwd: process.cwd() });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain("interactive terminal");
  expect(result.stdout + result.stderr).not.toContain("not-a-real-secret");
});
