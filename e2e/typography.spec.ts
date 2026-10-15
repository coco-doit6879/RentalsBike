import { test, expect } from "@playwright/test";
test("uses a modern readable type scale on both viewports", async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("evo-cookie-choice", "essential"),
  );
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const type = await page
    .locator("h1")
    .evaluate((el) => ({
      size: parseFloat(getComputedStyle(el).fontSize),
      weight: parseInt(getComputedStyle(el).fontWeight),
      font: getComputedStyle(el).fontFamily,
    }));
  expect(type.font).toContain("Inter");
  expect(type.weight).toBeGreaterThanOrEqual(600);
  expect(type.size).toBeGreaterThanOrEqual(isMobile ? 40 : 64);
  expect(
    await page
      .locator(".hero-description")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(16);
  expect(
    await page
      .locator(".hero-ctas .btn")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(14);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
