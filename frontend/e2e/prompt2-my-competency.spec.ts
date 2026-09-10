import { test, expect } from "@playwright/test";

test.describe("Prompt 2: My Competency + AI GapRadar Dashboard", () => {
  test("My Competency page renders role header, 4 summary cards, and GapRadar", async ({ page }) => {
    await page.goto("/en/learner/competency");

    // 1. Page Header & Profile info
    await expect(page.locator("h1:has-text('My Competency')")).toBeVisible();
    await expect(page.locator("text=Understand your current capabilities, identify priority gaps")).toBeVisible();
    await expect(page.locator("text=Priya Sharma")).toBeVisible();
    await expect(page.locator("text=Statistical Officer").first()).toBeVisible();
    await expect(page.locator("text=Official Statistics Division")).toBeVisible();
    await expect(page.locator("text=Subordinate Statistical Service (SSS)")).toBeVisible();

    // 2. Four Summary Cards
    await expect(page.locator("text=Overall Competency")).toBeVisible();
    await expect(page.locator("text=68%").first()).toBeVisible();
    await expect(page.locator("text=Required Competencies").first()).toBeVisible();
    await expect(page.locator("text=6").first()).toBeVisible();
    await expect(page.locator("text=Priority Gaps").first()).toBeVisible();
    await expect(page.locator("text=3").first()).toBeVisible();
    await expect(page.locator("text=Assessment Status").first()).toBeVisible();
    await expect(page.locator("text=Completed").first()).toBeVisible();

    // 3. GapRadar Chart (Recharts SVG)
    await expect(page.locator("text=My Competency GapRadar")).toBeVisible();
    const radarChartSvg = page.locator(".recharts-responsive-container svg.recharts-surface").first();
    await expect(radarChartSvg).toBeVisible();
    await expect(page.locator("text=Statistical Modeling").first()).toBeVisible();
    await expect(page.locator("text=Statistical Computing").first()).toBeVisible();
    await expect(page.locator("text=Survey Methodology").first()).toBeVisible();
  });

  test("Priority Competency Gaps section renders ranked deficits with AI insights", async ({ page }) => {
    await page.goto("/en/learner/competency");

    await expect(page.locator("text=Priority Competency Gaps")).toBeVisible();
    await expect(page.locator("text=1. Statistical Modeling")).toBeVisible();
    await expect(page.locator("text=Gap: 38 points")).toBeVisible();
    await expect(page.locator("text=High Priority").first()).toBeVisible();
    await expect(
      page.locator("text=Your demonstrated competency is significantly below the required level for your current role.")
    ).toBeVisible();

    // Test View Recommended Learning button
    const recButton = page.locator("text=View Recommended Learning").first();
    await expect(recButton).toBeVisible();
    await recButton.click();
    await expect(page).toHaveURL(/.*(\/en\/explore|\/en\/learner\/recommendations).*/);
  });

  test("AI Insight Panel displays decision support and actionable next step", async ({ page }) => {
    await page.goto("/en/learner/competency");

    await expect(page.locator("text=AI Competency Insight")).toBeVisible();
    await expect(
      page.locator("text=Your largest competency gap is Statistical Modeling. Strengthening this area could have the highest impact")
    ).toBeVisible();
    await expect(page.locator("text=Take Statistical Modeling Fundamentals")).toBeVisible();

    const viewRecBtn = page.getByRole("link", { name: /View Recommendation/i }).first();
    await expect(viewRecBtn).toBeVisible();
  });

  test("Detailed Competency Gap Matrix table handles values and Above Requirement status", async ({ page }) => {
    await page.goto("/en/learner/competency");

    await expect(page.locator("text=Detailed Competency Gap Matrix")).toBeVisible();

    // Table rows
    await expect(page.locator("text=Statistical Modeling").first()).toBeVisible();
    await expect(page.locator("text=38 points").first()).toBeVisible();
    await expect(page.locator("text=Priority Deficit").first()).toBeVisible();

    // Survey Methodology is above requirement (Required 70, Demonstrated 72)
    await expect(page.locator("text=Survey Methodology").first()).toBeVisible();
    await expect(page.locator("text=Above Requirement").first()).toBeVisible();
    await expect(page.locator("text=Benchmark Achieved").first()).toBeVisible();
  });

  test("Learning Connection, Learning Path, and Assessment Status are functional", async ({ page }) => {
    await page.goto("/en/learner/competency");

    // Recommendations
    await expect(page.locator("text=Recommended for Your Gaps")).toBeVisible();
    await expect(page.locator("text=Statistical Modeling Fundamentals").first()).toBeVisible();
    await expect(page.locator("text=Python for Official Statistics & Microdata")).toBeVisible();

    // Learning Path: NOW, NEXT, LATER
    await expect(page.locator("text=Your Learning Path")).toBeVisible();
    await expect(page.getByText("NOW", { exact: true })).toBeVisible();
    await expect(page.getByText("NEXT", { exact: true })).toBeVisible();
    await expect(page.getByText("LATER", { exact: true })).toBeVisible();

    const pathLink = page.getByRole("link", { name: /View Full Learning Path/i });
    await expect(pathLink).toBeVisible();
    await pathLink.click();
    await expect(page).toHaveURL(/.*\/en\/learner\/learning-path.*/);

    // Navigate back & verify Assessment Status
    await page.goto("/en/learner/competency");
    await expect(page.locator("text=Competency Assessment")).toBeVisible();
    await expect(page.locator("text=Baseline Assessment Completed")).toBeVisible();

    const resultsBtn = page.getByRole("link", { name: /View Assessment Results/i });
    await expect(resultsBtn).toBeVisible();
    await resultsBtn.click();
    await expect(page).toHaveURL(/.*\/en\/learner\/results.*/);
  });

  test("Competency Progress chart renders line progression over time", async ({ page }) => {
    await page.goto("/en/learner/competency");

    await expect(page.locator("text=Competency Progress")).toBeVisible();
    await expect(page.locator("text=+26% Net Improvement")).toBeVisible();
    await expect(page.locator("text=Continuous competency improvement across diagnostic milestones")).toBeVisible();
  });

  test("Hindi localization renders all Prompt 2 components seamlessly", async ({ page }) => {
    await page.goto("/hi/learner/competency");

    await expect(page.locator("h1:has-text('मेरी क्षमता')")).toBeVisible();
    await expect(page.locator("text=समग्र क्षमता स्तर")).toBeVisible();
    await expect(page.locator("text=मेरी क्षमता गैप-रडार")).toBeVisible();
    await expect(page.locator("text=प्राथमिकता क्षमता अंतराल")).toBeVisible();
    await expect(page.locator("text=एआई क्षमता अंतर्दृष्टि")).toBeVisible();
    await expect(page.locator("text=विस्तृत क्षमता अंतर मैट्रिक्स")).toBeVisible();
    await expect(page.locator("text=आपके अंतरालों के लिए अनुशंसित")).toBeVisible();
    await expect(page.locator("text=आपका अधिगम पथ")).toBeVisible();
    await expect(page.locator("text=क्षमता प्रगति")).toBeVisible();
  });
});
