import { readdirSync, renameSync, statSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

function findRouteFiles(dir, list = []) {
  if (!existsSync(dir)) return list;
  for (const item of readdirSync(dir)) {
    const full = join(dir, item);
    if (statSync(full).isDirectory()) {
      findRouteFiles(full, list);
    } else if (item === "route.ts") {
      list.push(full);
    }
  }
  return list;
}

const apiRoot = join("src", "app", "api");
const routeFiles = findRouteFiles(apiRoot);
const renamed = [];

try {
  for (const file of routeFiles) {
    const bak = file + ".bak";
    renameSync(file, bak);
    renamed.push({ file, bak });
  }
  console.log(`Temporarily stashed ${renamed.length} route files for static export.`);

  console.log("Running next build with OUTPUT_EXPORT=true...");
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, OUTPUT_EXPORT: "true" },
  });
  console.log("Static export build completed successfully into out/ directory!");
} finally {
  for (const { file, bak } of renamed) {
    if (existsSync(bak)) {
      renameSync(bak, file);
    }
  }
  console.log("Restored all route files.");
}
