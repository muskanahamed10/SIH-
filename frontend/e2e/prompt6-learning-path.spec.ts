import { test, expect } from "@playwright/test";

test.describe("Prompt 6: Personalized Learning Path (NOW -> NEXT -> LATER)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/learner/learning-path");
    // Wait for client-side queries to finish loading
    await expect(page.getByText("Loading your personalized AI learning path")).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });

  test("1. Page loads successfully with official header and Cadre role details", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("My Learning Path");
    await expect(page.getByText("Priya Sharma").first()).toBeVisible();
    await expect(page.getByText("Statistical Officer").first()).toBeVisible();
    await expect(page.getByText("Subordinate Statistical Service (SSS)").first()).toBeVisible();
  });

  test("2. Displays overall learning progress bar and curriculum statistics", async ({ page }) => {
    // Overall progress metric
    await expect(page.getByText("Learning Path Progress").first()).toBeVisible();
    await expect(page.getByText("35%").first()).toBeVisible();

    // Summary statistics cards
    await expect(page.getByText("Priority Competencies").first()).toBeVisible();
    await expect(page.getByText("Recommended Resources").first()).toBeVisible();
    await expect(page.getByText("Currently Learning").first()).toBeVisible();
    await expect(page.getByText("3h 15m").first()).toBeVisible();
  });

  test("3. Visual NOW -> NEXT -> LATER Stepper Journey Roadmap renders all 3 stages", async ({ page }) => {
    const roadmap = page.getByRole("region", { name: "Visual Learning Journey Roadmap" });
    await expect(roadmap).toBeVisible();

    // 1. NOW: Python Fundamentals
    await expect(roadmap.getByText("NOW", { exact: true })).toBeVisible();
    await expect(roadmap.getByRole("heading", { name: "Python Fundamentals" })).toBeVisible();
    await expect(roadmap.getByText("Statistical Computing (Python)")).toBeVisible();
    await expect(roadmap.getByText("45 mins")).toBeVisible();

    // 2. NEXT: Data Analysis with Python
    await expect(roadmap.getByText("NEXT", { exact: true })).toBeVisible();
    await expect(roadmap.getByRole("heading", { name: "Data Analysis with Python" })).toBeVisible();
    await expect(roadmap.getByText("Data Analysis & Statistics")).toBeVisible();
    await expect(roadmap.getByText("60 mins")).toBeVisible();

    // 3. LATER: Advanced Statistical Computing
    await expect(roadmap.getByText("LATER", { exact: true })).toBeVisible();
    await expect(roadmap.getByRole("heading", { name: "Advanced Statistical Computing" })).toBeVisible();
    await expect(roadmap.getByText("Statistical Modeling & Computing")).toBeVisible();
    await expect(roadmap.getByText("90 mins")).toBeVisible();
  });

  test("4. Timeline Card 1 (NOW: Python Fundamentals) renders all required items", async ({ page }) => {
    const pythonCard = page.getByTestId("timeline-card-now");
    await expect(pythonCard).toBeVisible();

    // Course Heading
    await expect(pythonCard.getByRole("heading", { name: "Python Fundamentals", level: 3 })).toBeVisible();

    // Stage & Step
    await expect(pythonCard.getByText("NOW", { exact: true })).toBeVisible();
    await expect(pythonCard.getByText("Step 1 of 3")).toBeVisible();

    // Competency
    await expect(pythonCard.getByText("Statistical Computing (Python)", { exact: true })).toBeVisible();

    // Duration
    await expect(pythonCard.getByText("45 mins")).toBeVisible();

    // Priority
    await expect(pythonCard.getByText("Critical Priority")).toBeVisible();

    // Progress & Completion Status
    await expect(pythonCard.getByText("45% (In Progress)")).toBeVisible();
    await expect(pythonCard.getByRole("progressbar")).toBeVisible();

    // Action button
    await expect(pythonCard.getByRole("button", { name: "Continue Learning" })).toBeVisible();

    // Milestones
    await expect(pythonCard.getByText("Python Syntax & Vectorized Operations")).toBeVisible();
  });

  test("5. Timeline Card 2 (NEXT: Data Analysis with Python) renders all required items", async ({ page }) => {
    const nextCard = page.getByTestId("timeline-card-next");
    await expect(nextCard).toBeVisible();

    // Course Heading
    await expect(nextCard.getByRole("heading", { name: "Data Analysis with Python", level: 3 })).toBeVisible();

    // Stage & Step
    await expect(nextCard.getByText("NEXT", { exact: true })).toBeVisible();
    await expect(nextCard.getByText("Step 2 of 3")).toBeVisible();

    // Competency
    await expect(nextCard.getByText("Data Analysis & Statistics", { exact: true })).toBeVisible();

    // Duration
    await expect(nextCard.getByText("60 mins")).toBeVisible();

    // Priority
    await expect(nextCard.getByText("High Priority")).toBeVisible();

    // Completion Status
    await expect(nextCard.getByText("Up Next").first()).toBeVisible();

    // Action button
    await expect(nextCard.getByRole("button", { name: "View Resource" })).toBeVisible();
  });

  test("6. Timeline Card 3 (LATER: Advanced Statistical Computing) renders all required items", async ({ page }) => {
    const laterCard = page.getByTestId("timeline-card-later");
    await expect(laterCard).toBeVisible();

    // Course Heading
    await expect(laterCard.getByRole("heading", { name: "Advanced Statistical Computing", level: 3 })).toBeVisible();

    // Stage & Step
    await expect(laterCard.getByText("LATER", { exact: true })).toBeVisible();
    await expect(laterCard.getByText("Step 3 of 3")).toBeVisible();

    // Competency
    await expect(laterCard.getByText("Statistical Modeling & Computing", { exact: true })).toBeVisible();

    // Duration
    await expect(laterCard.getByText("90 mins")).toBeVisible();

    // Priority
    await expect(laterCard.getByText("Medium Priority")).toBeVisible();

    // Completion Status
    await expect(laterCard.getByText("Locked").first()).toBeVisible();

    // Action button
    await expect(laterCard.getByRole("button", { name: "View Resource" })).toBeVisible();
  });

  test("7. Bilingual Hindi version (/hi/learner/learning-path) renders localized text", async ({ page }) => {
    await page.goto("/hi/learner/learning-path");
    await expect(page.locator("h1")).toContainText("मेरा अधिगम पथ", { timeout: 15000 });

    // Check localized stage badges
    await expect(page.getByText("अभी (NOW)").first()).toBeVisible();
    await expect(page.getByText("अगला (NEXT)").first()).toBeVisible();
    await expect(page.getByText("बाद में (LATER)").first()).toBeVisible();

    // Check localized action
    await expect(page.getByRole("button", { name: "अधिगम जारी रखें" }).first()).toBeVisible();
  });
});
