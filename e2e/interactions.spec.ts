import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("evo-cookie-choice", "essential"),
  );
});
test("carousel, search dialog and keyboard focus", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Banner 2: Phiên bản và màu sắc" })
    .click();
  await expect(page.locator("h1")).toContainText("Cá tính của bạn");
  await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Bạn đang tìm kiếm điều gì?").fill("dịch vụ");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "DỊCH VỤ & CHĂM SÓC" })
    .click();
  await expect(page).toHaveURL(/service/);
});
test("mobile drawer is modal and escape restores focus", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Mở menu" });
  await opener.click();
  await expect(
    page.getByRole("dialog", { name: "Menu điều hướng" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(opener).toBeFocused();
});
test("color query preselects registration and demo submits without network", async ({
  page,
}) => {
  await page.goto("/test-drive?color=blue");
  await expect(page.getByLabel("Màu quan tâm")).toHaveValue("blue");
  await page.getByLabel("Họ và tên", { exact: true }).fill("Khách Demo");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0901234567");
  await page.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await page
    .getByLabel("Tỉnh / thành phố", { exact: true })
    .selectOption({ label: "TP. Hồ Chí Minh" });
  await page.getByLabel("Phiên bản", { exact: true }).selectOption("evo-lite");
  const dealer = page.getByLabel("Showroom", { exact: true });
  await dealer.selectOption({ label: "Showroom TP. Hồ Chí Minh — Demo" });
  await page.getByRole("checkbox", { name: /Tôi đồng ý/ }).check();
  const requests: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") requests.push(r.url());
  });
  await page.getByRole("button", { name: "Gửi đăng ký demo" }).click();
  await expect(page.getByRole("status")).toContainText("Mô phỏng thành công");
  expect(requests).toEqual([]);
});
for (const route of [
  "/",
  "/test-drive",
  "/dealers",
  "/models/evo-lite",
  "/models",
  "/inventory",
  "/service",
  "/news",
  "/about",
  "/careers",
  "/privacy",
  "/terms",
])
  test(`basic accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  });
