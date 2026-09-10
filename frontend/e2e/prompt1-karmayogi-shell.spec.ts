import { test, expect } from "@playwright/test";

test.describe("Prompt 1: Karmayogi-Integrated Application Shell & My Competency", () => {
  test("Home page displays 'Build Your Competency Profile' entry card and navigates to My Competency", async ({ page }) => {
    await page.goto("/en/home");

    // Check entry card
    await expect(page.locator("text=Build Your Competency Profile")).toBeVisible();
    await expect(page.locator("text=Take a short baseline assessment to understand your competency gaps")).toBeVisible();

    // Click 'Discover My Competency'
    const cta = page.getByRole("link", { name: /Discover My Competency/i }).first();
    await expect(cta).toBeVisible();
    await cta.click();

    // Verify arrival at /en/learner/competency
    await expect(page).toHaveURL(/.*\/en\/learner\/competency.*/);
  });

  test("My Competency page renders high-level preview, CTAs, and 9-stage Competency Journey", async ({ page }) => {
    await page.goto("/en/learner/competency");

    // Header checks
    await expect(page.locator("h1:has-text('My Competency')")).toBeVisible();
    await expect(page.locator("text=Understand your current capabilities, identify priority gaps")).toBeVisible();

    // Role & Competency checks
    await expect(page.locator("text=Statistical Officer").first()).toBeVisible();
    await expect(page.locator("text=Official Statistics Division").first()).toBeVisible();
    await expect(page.locator("text=Completed").first()).toBeVisible();

    // 9-stage Competency Journey checks
    await expect(page.locator("text=The Competency Intelligence Journey")).toBeVisible();
    await expect(page.locator("text=ROLE").first()).toBeVisible();
    await expect(page.locator("text=REQUIRED COMPETENCIES").first()).toBeVisible();
    await expect(page.locator("text=ASSESSMENT").first()).toBeVisible();
    await expect(page.locator("text=AI GAP ANALYSIS").first()).toBeVisible();
    await expect(page.locator("text=GAPRADAR").first()).toBeVisible();
    await expect(page.locator("text=RECOMMENDATIONS").first()).toBeVisible();
    await expect(page.locator("text=LEARNING").first()).toBeVisible();
    await expect(page.locator("text=REASSESSMENT").first()).toBeVisible();
    await expect(page.locator("text=IMPROVEMENT").first()).toBeVisible();

    // Test Primary CTA: Start Baseline Assessment
    const startCta = page.getByRole("link", { name: /Start Baseline Assessment/i });
    await expect(startCta).toBeVisible();
    await startCta.click();
    await expect(page).toHaveURL(/.*\/en\/learner\/assessment.*/);

    // Navigate back and test Secondary CTA: Explore Learning
    await page.goto("/en/learner/competency");
    const exploreCta = page.getByRole("link", { name: /Explore Learning/i });
    await expect(exploreCta).toBeVisible();
    await exploreCta.click();
    await expect(page).toHaveURL(/.*\/en\/explore.*/);
  });

  test("Karmayogi primary learner navigation items are functional", async ({ page }) => {
    await page.goto("/en/learner/competency");

    // Sidebar should contain Karmayogi ecosystem links
    const sidebar = page.locator("aside[aria-label='Official Learner Sidebar']");
    await expect(sidebar).toBeVisible();

    await expect(sidebar.locator("text=Home")).toBeVisible();
    await expect(sidebar.locator("text=Explore")).toBeVisible();
    await expect(sidebar.locator("text=My Learning")).toBeVisible();
    await expect(sidebar.locator("text=My Competency")).toBeVisible();
    await expect(sidebar.locator("text=Achievement")).toBeVisible();

    // Test navigation to My Learning
    await sidebar.locator("text=My Learning").click();
    await expect(page).toHaveURL(/.*\/en\/learning.*/);
    await expect(page.locator("text=Python for Official Statistics & Microdata")).toBeVisible();

    // Test navigation to Achievement
    await sidebar.locator("text=Achievement").click();
    await expect(page).toHaveURL(/.*\/en\/achievement.*/);
    await expect(page.locator("text=Survey Sampling Design & Estimation Standards")).toBeVisible();
  });

  test("Manager portal navigation and route aliases work", async ({ page }) => {
    await page.goto("/en/manager/dashboard");

    // Sidebar should be Admin/Manager Governance
    const sidebar = page.locator("aside[aria-label='Admin Governance Sidebar']");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.locator("text=Overview Dashboard")).toBeVisible();
    await expect(sidebar.locator("text=Team Heatmap")).toBeVisible();

    // Navigate to team
    await sidebar.locator("text=Team Heatmap").click();
    await expect(page).toHaveURL(/.*\/en\/(admin|manager)\/team.*/);
  });

  test("Hindi localization works seamlessly on My Competency page", async ({ page }) => {
    await page.goto("/hi/learner/competency");

    await expect(page.locator("h1:has-text('मेरी क्षमता')")).toBeVisible();
    await expect(page.locator("text=सांख्यिकी अधिकारी").first()).toBeVisible();
    await expect(page.locator("text=मूल्यांकन").first()).toBeVisible();
    await expect(page.locator("text=आधारभूत मूल्यांकन प्रारंभ करें")).toBeVisible();
    await expect(page.locator("text=अधिगम अन्वेषण करें")).toBeVisible();
    await expect(page.locator("text=क्षमता बुद्धिमत्ता यात्रा")).toBeVisible();
  });
});
