import { test, expect } from "@playwright/test";
const routes = [
  "/",
  "/models",
  "/models/evo-lite",
  "/test-drive",
  "/inventory",
  "/service",
  "/dealers",
  "/news",
  "/about",
  "/careers",
  "/privacy",
  "/terms",
  "/news/mot-nhip-di-chuyen-moi",
  "/news/ngon-ngu-cua-nhung-chi-tiet",
  "/news/khong-gian-cho-mot-cuoc-tro-chuyen",
];
for (const route of routes)
  test(`${route} renders with metadata, no overflow and valid images`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/Evo Lite/);
    expect(
      await page.locator('meta[name="description"]').getAttribute("content"),
    ).toBeTruthy();
    await page.waitForLoadState("networkidle");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const image of await page.locator("img").all()) {
      if (await image.isVisible()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (i) =>
                (i as HTMLImageElement).complete &&
                (i as HTMLImageElement).naturalWidth > 0,
            ),
          )
          .toBe(true);
      } else {
        const src = await image.getAttribute("src");
        expect((await page.request.get(src!)).status()).toBe(200);
      }
    }
    expect(errors).toEqual([]);
  });
test("unknown page is a genuine 404", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Lạc");
});
