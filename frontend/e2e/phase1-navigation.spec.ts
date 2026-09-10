import { test, expect } from "@playwright/test";

test.describe("Phase 1: Shell, Navigation & Mobile Responsiveness", () => {
  test("Mobile responsive drawer opens, navigates, and closes via keyboard Escape", async ({ page }) => {
    // Set mobile viewport (iPhone SE size)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/en/learner");

    // Hamburger button should be visible on mobile
    const hamburger = page.locator("header button[aria-label='Toggle navigation sidebar']");
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    // Mobile drawer should be visible with role title
    const drawer = page.locator("div[role='dialog']");
    await expect(drawer).toBeVisible();
    await expect(drawer.locator("text=Learner")).toBeVisible();
    await expect(drawer.locator("text=Dashboard")).toBeVisible();
    await expect(drawer.locator("text=Assessments")).toBeVisible();

    // Press Escape to dismiss drawer
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
  });

  test("Breadcrumbs render properly and localize between English and Hindi", async ({ page }) => {
    await page.goto("/en/learner/assessment");

    // Breadcrumb nav should be present
    const breadcrumbNav = page.locator("nav[aria-label='Breadcrumb']");
    await expect(breadcrumbNav).toBeVisible();
    await expect(breadcrumbNav.locator("text=Learner")).toBeVisible();
    await expect(breadcrumbNav.locator("text=Assessments")).toBeVisible();

    // Switch to Hindi
    const langBtn = page.locator("button[aria-label='Toggle language']");
    await langBtn.click();
    await expect(page).toHaveURL(/.*\/hi\/learner\/assessment.*/);

    // Hindi breadcrumb check
    await expect(page.locator("nav[aria-label='Breadcrumb']").locator("text=शिक्षार्थी")).toBeVisible();
    await expect(page.locator("nav[aria-label='Breadcrumb']").locator("text=क्षमता मूल्यांकन")).toBeVisible();
  });

  test("Reusable sidebar displays Admin navigation on admin routes", async ({ page }) => {
    await page.goto("/en/admin");
    
    // Check admin sidebar elements
    const adminSidebar = page.locator("aside[aria-label='Admin Governance Sidebar']");
    await expect(adminSidebar).toBeVisible();
    await expect(adminSidebar.locator("text=Overview Dashboard")).toBeVisible();
    await expect(adminSidebar.locator("text=Team Heatmap")).toBeVisible();
    await expect(adminSidebar.locator("text=MCQ Review")).toBeVisible();
    await expect(adminSidebar.locator("text=NSSTA Competency Governance").first()).toBeVisible();
  });

  test("User Profile dropdown menu opens and displays officer details", async ({ page }) => {
    await page.goto("/en/learner");
    const userBtn = page.getByRole("button", { name: "Rajesh Kumar Verma" });
    await expect(userBtn).toBeVisible();
    await userBtn.click();

    // Popover menu assertions
    await expect(page.locator("text=Senior Statistical Officer (SSO)").first()).toBeVisible();
    await expect(page.locator("text=Subordinate Statistical Service (SSS)").first()).toBeVisible();
    await expect(page.locator("text=My Profile")).toBeVisible();
    await expect(page.locator("text=Sign Out")).toBeVisible();
  });

  test("Skip to content link is keyboard focusable", async ({ page }) => {
    await page.goto("/en/learner");
    await page.keyboard.press("Tab");
    const skipLink = page.locator("a[href='#main-content']");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveText(/Skip to main content/i);
  });
});
