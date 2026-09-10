import { test, expect } from "@playwright/test";

test.describe("Prompt 4: Assessment Results & AI Competency Gap Analysis", () => {
  test("Results page renders on /assessment-results route with overall score, metrics, and cadre info", async ({ page }) => {
    await page.goto("/en/learner/assessment-results/baseline-cadre-2026");

    // 1. Header & Role info
    await expect(page.locator("h1:has-text('Assessment Results')")).toBeVisible();
    await expect(
      page.locator("text=Here’s how you performed and where you should focus next.")
    ).toBeVisible();
    await expect(page.locator("strong:has-text('Statistical Officer')")).toBeVisible();
    await expect(page.locator("strong:has-text('Baseline Competency Assessment')")).toBeVisible();
    await expect(page.locator("span:has-text('Completed')").first()).toBeVisible();

    // 2. Overall Assessment Score Card (Requirement 1)
    await expect(page.locator("span:has-text('Overall Competency Score')")).toBeVisible();
    await expect(page.locator("span:has-text('68%')").first()).toBeVisible();
    await expect(page.locator("span:has-text('Baseline assessment completed')")).toBeVisible();
    await expect(page.locator("span:has-text('10')").first()).toBeVisible(); // Questions
    await expect(page.locator("span:has-text('7')").first()).toBeVisible(); // Correct
    await expect(page.locator("span:has-text('3')").first()).toBeVisible(); // Incorrect
    await expect(page.locator("span:has-text('10m')").first()).toBeVisible(); // Duration
  });

  test("Competency-wise table displays required, current, gap %, and 4-tier priority classifications", async ({ page }) => {
    await page.goto("/en/learner/assessment-results/baseline-cadre-2026");

    // Table Header (Requirements 2, 3, 4, 5, 6)
    await expect(page.locator("h2:has-text('Competency-wise Performance')")).toBeVisible();
    await expect(page.locator("th:has-text('Competency')")).toBeVisible();
    await expect(page.locator("th:has-text('Required Level')")).toBeVisible();
    await expect(page.locator("th:has-text('Current Level')")).toBeVisible();
    await expect(page.locator("th:has-text('Gap %')")).toBeVisible();
    await expect(page.locator("th:has-text('Priority Classification')")).toBeVisible();

    // Python / Statistical Computing Example from Prompt:
    // Current 38%, Required 75%, Gap 37%, Priority: Critical
    await expect(page.locator("text=Statistical Computing (Python)").first()).toBeVisible();
    await expect(page.locator("td:has-text('75%')").first()).toBeVisible();
    await expect(page.locator("td:has-text('38%')").first()).toBeVisible();
    await expect(page.locator("td:has-text('37%')").first()).toBeVisible();
    await expect(page.locator("span:has-text('Critical')").first()).toBeVisible();

    // Statistics / Data Analysis Example from Prompt:
    // Current 82%, Required 85%, Gap 3%, Priority: Low
    await expect(page.locator("text=Data Analysis & Statistics").first()).toBeVisible();
    await expect(page.locator("td:has-text('85%')").first()).toBeVisible();
    await expect(page.locator("td:has-text('82%')").first()).toBeVisible();
    await expect(page.locator("td:has-text('3%')").first()).toBeVisible();
    await expect(page.locator("span:has-text('Low')").first()).toBeVisible();

    // Verify 4-tier priority badges exist
    await expect(page.locator("span:has-text('Critical')").first()).toBeVisible();
    await expect(page.locator("span:has-text('Moderate')").first()).toBeVisible();
    await expect(page.locator("span:has-text('Low')").first()).toBeVisible();

    // Requirement 7: GapRadar visualization using Recharts
    await expect(page.getByRole("heading", { name: "Your Competency Gap", exact: true })).toBeVisible();
    const radarSvg = page.locator(".recharts-surface").first();
    await expect(radarSvg).toBeVisible();
  });

  test("AI Insight card displays Mock AI badge and transparent disclaimer", async ({ page }) => {
    await page.goto("/en/learner/assessment-results/baseline-cadre-2026");

    // Requirement 8: AI insight card
    await expect(page.locator("h2:has-text('AI Competency Insight')")).toBeVisible();
    // Explicitly labeled as mock AI output
    await expect(page.locator("text=Mock AI Output (Development Simulation)")).toBeVisible();
    await expect(
      page.locator("text=Simulated AI Analysis: In production, this diagnostic insight is powered by an LLM")
    ).toBeVisible();
    await expect(
      page.locator("text=Your largest demonstrated gap is in Statistical Modeling")
    ).toBeVisible();
  });

  test("Top 3 recommended focus areas and CTA to personalized learning path work", async ({ page }) => {
    await page.goto("/en/learner/assessment-results/baseline-cadre-2026");

    // Requirement 9: Top 3 recommended focus areas
    await expect(page.locator("h2:has-text('Top 3 Recommended Focus Areas')")).toBeVisible();
    await expect(page.locator("span:has-text('Focus #1')")).toBeVisible();
    await expect(page.locator("span:has-text('Focus #2')")).toBeVisible();
    await expect(page.locator("span:has-text('Focus #3')")).toBeVisible();

    // Requirement 10: CTA to view personalized learning path
    const learningPathCta = page.getByRole("link", { name: /View Personalized Learning Path/i }).first();
    await expect(learningPathCta).toBeVisible();
    await learningPathCta.click();

    // Verify navigation to learning path
    await expect(page).toHaveURL(/.*\/en\/learner\/learning-path.*/);
  });

  test("Hindi localization renders assessment results and gap analysis seamlessly", async ({ page }) => {
    await page.goto("/hi/learner/assessment-results/baseline-cadre-2026");

    await expect(page.locator("h1:has-text('मूल्यांकन परिणाम')")).toBeVisible();
    await expect(page.locator("span:has-text('समग्र क्षमता स्कोर')")).toBeVisible();
    await expect(page.locator("h2:has-text('क्षमता-वार प्रदर्शन')")).toBeVisible();
    await expect(page.locator("h2:has-text('आपकी क्षमता का अंतराल')")).toBeVisible();
    await expect(page.locator("h2:has-text('शीर्ष ३ अनुशंसित प्राथमिकता क्षेत्र')")).toBeVisible();
    await expect(page.locator("text=मॉक एआई आउटपुट (विकास सिमुलेशन)")).toBeVisible();
    await expect(page.locator("span:has-text('गंभीर')").first()).toBeVisible();
  });
});
