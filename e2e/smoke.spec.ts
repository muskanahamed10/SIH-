import { test, expect } from "@playwright/test";

test.describe("Portal Foundation Smoke Tests", () => {
  test("Landing page loads with Government of India header and portal links", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Official Statistical System/i);
    await expect(page.locator("text=Government of India")).toBeVisible();
    await expect(page.locator("text=Learner Competency Workspace")).toBeVisible();
    await expect(page.locator("text=Competency Admin & Governance")).toBeVisible();
  });

  test("Language toggle redirects between English and Hindi", async ({ page }) => {
    await page.goto("/en");
    const langBtn = page.locator("button[aria-label='Toggle language']");
    await expect(langBtn).toBeVisible();
    await langBtn.click();
    await expect(page).toHaveURL(/.*\/hi.*/);
    await expect(page.locator("text=भारत सरकार")).toBeVisible();
  });

  test("Learner Dashboard loads with officer profile and KPIs", async ({ page }) => {
    await page.goto("/en/learner/dashboard");
    await expect(page.locator("text=Rajesh Kumar Verma")).toBeVisible();
    await expect(page.locator("text=Subordinate Statistical Service (SSS)")).toBeVisible();
    await expect(page.locator("text=GapRadar: Role Competency Benchmark")).toBeVisible();
  });

  test("Admin Dashboard loads with national analytics and MCQ queue", async ({ page }) => {
    await page.goto("/en/admin/dashboard");
    await expect(page.locator("text=MoSPI Competency Administration")).toBeVisible();
    await expect(page.locator("text=National Cadre Competency Deficits")).toBeVisible();
  });

  test("Team Heatmap displays officers and competency ratings", async ({ page }) => {
    await page.goto("/en/admin/team-gaps");
    await expect(page.locator("text=Departmental Competency Heatmap")).toBeVisible();
    await expect(page.locator("text=Rajesh Kumar Verma")).toBeVisible();
    await expect(page.locator("text=Statistical Methods")).toBeVisible();
  });
});
