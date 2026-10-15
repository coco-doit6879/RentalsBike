import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await page.goto((process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3003"));
await page.waitForLoadState("networkidle");
await page.locator("h1").waitFor({ state: "visible" });
console.log(
  "images",
  await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs.map((i) => ({
        src: i.src,
        loaded: i.complete && i.naturalWidth > 0,
        loading: i.loading,
        display: getComputedStyle(i).display,
        rect: i.getBoundingClientRect().toJSON(),
      })),
    ),
);
await page.getByRole("button", { name: "Chỉ thiết yếu" }).click();
fs.mkdirSync("docs/screenshots", { recursive: true });
await page.screenshot({
  path: "docs/screenshots/home-desktop.png",
  fullPage: true,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.goto((process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3003"));
await page.waitForLoadState("networkidle");
await page.screenshot({
  path: "docs/screenshots/home-mobile.png",
  fullPage: true,
});
await browser.close();
