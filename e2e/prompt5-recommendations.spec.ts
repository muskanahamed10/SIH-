import { test, expect } from "@playwright/test";

test.describe("Prompt 5: Personalized Learning Recommendations Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/learner/recommendations");
    // Wait for client-side query to finish loading
    await expect(page.getByText("Analyzing competency gaps and matching")).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });

  test("1. Page loads successfully with official header and Cadre role details", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Recommended Learning");
    await expect(page.getByText("Statistical Officer").first()).toBeVisible();
    await expect(page.getByText("Subordinate Statistical Service (SSS)").first()).toBeVisible();
  });

  test("2. Displays prominent Python gap explanation matching requirements", async ({ page }) => {
    const pythonExplanation = page.getByText(
      "Recommended because your Python competency is below the required level for your role."
    );
    await expect(pythonExplanation.first()).toBeVisible();

    // Check gap stats in callout
    await expect(page.getByText("Statistical Computing (Python)").first()).toBeVisible();
    await expect(page.getByText("37%").first()).toBeVisible();
  });

  test("3. Verifies each recommendation card renders all 8 required items", async ({ page }) => {
    // Locate the course card by its unique h3 heading
    const pythonHeading = page.getByRole("heading", {
      name: "Python for Official Statistics & Microdata Processing",
      level: 3,
    });
    await expect(pythonHeading).toBeVisible();

    // Find card container containing this heading
    const pythonCard = page.locator(".rounded-2xl.border-slate-200", { has: pythonHeading });
    await expect(pythonCard).toBeVisible();

    // 1. Course title
    await expect(pythonCard.getByRole("heading", { level: 3 })).toHaveText(
      "Python for Official Statistics & Microdata Processing"
    );

    // 2. Competency addressed
    await expect(pythonCard.getByText("Statistical Computing (Python)")).toBeVisible();

    // 3. Difficulty
    await expect(pythonCard.getByText("Intermediate")).toBeVisible();

    // 4. Estimated duration
    await expect(pythonCard.getByText("50 mins")).toBeVisible();

    // 5. Reason for recommendation
    await expect(
      pythonCard.getByText("Recommended because your Python competency is below the required level for your role.")
    ).toBeVisible();

    // 6. Progress
    await expect(pythonCard.getByText("45% (In Progress)")).toBeVisible();
    await expect(pythonCard.getByRole("progressbar")).toBeVisible();

    // 7. Source / platform
    await expect(pythonCard.getByText("iGOT Karmayogi (Demo Catalog)")).toBeVisible();

    // 8. Start / View button
    const actionBtn = pythonCard.getByRole("button", { name: /Continue Learning|Start Learning/ });
    await expect(actionBtn).toBeVisible();
  });

  test("4. Clear demo catalog notice is displayed and does not claim live iGOT data", async ({ page }) => {
    const notice = page.getByRole("region", { name: "iGOT Catalog Information" });
    await expect(notice).toBeVisible();
    await expect(notice.getByText("Demo Catalog")).toBeVisible();
    await expect(notice.getByText("Simulated Environment")).toBeVisible();
    await expect(notice.getByText(/This is not live production iGOT data/)).toBeVisible();

    // Toggle architecture details
    const archToggle = notice.getByRole("button", { name: /View Adapter Architecture/ });
    await archToggle.click();
    await expect(notice.getByText("Mock Catalog Adapter")).toBeVisible();
    await expect(notice.getByText("Authorized iGOT API Adapter")).toBeVisible();
  });

  test("5. Filtering by Competency correctly filters the catalog", async ({ page }) => {
    const competencySelect = page.getByLabel("Filter by Competency");
    await competencySelect.selectOption("comp-stat-comp");

    // Should display Python course
    await expect(
      page.getByRole("heading", { name: "Python for Official Statistics & Microdata Processing", level: 3 })
    ).toBeVisible();

    // Should NOT display unrelated courses like Econometric Modeling
    await expect(
      page.getByRole("heading", { name: "Advanced Econometric Modeling & Time Series", level: 3 })
    ).not.toBeVisible();
  });

  test("6. Filtering by Difficulty correctly filters Beginner and Advanced courses", async ({ page }) => {
    const diffSelect = page.getByLabel("Filter by Difficulty");

    // Select Beginner
    await diffSelect.selectOption("Beginner");
    await expect(
      page.getByRole("heading", { name: "Fundamentals of National Statistical Data Quality", level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Python for Official Statistics & Microdata Processing", level: 3 })
    ).not.toBeVisible();

    // Select Advanced
    await diffSelect.selectOption("Advanced");
    await expect(
      page.getByRole("heading", { name: "Advanced Econometric Modeling & Time Series", level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Official Sample Survey Design & Stratification", level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Fundamentals of National Statistical Data Quality", level: 3 })
    ).not.toBeVisible();
  });

  test("7. Filtering by Duration correctly filters <30 mins, 30-60 mins, and >60 mins", async ({ page }) => {
    const durationSelect = page.getByLabel("Filter by Duration");

    // Select <30 mins
    await durationSelect.selectOption("<30");
    await expect(
      page.getByRole("heading", { name: "Fundamentals of National Statistical Data Quality", level: 3 })
    ).toBeVisible(); // 20 mins
    await expect(
      page.getByRole("heading", { name: "Hypothesis Testing & Statistical Inference Practice", level: 3 })
    ).toBeVisible(); // 25 mins
    await expect(
      page.getByRole("heading", { name: "Advanced Econometric Modeling & Time Series", level: 3 })
    ).not.toBeVisible(); // 75 mins

    // Select >60 mins
    await durationSelect.selectOption(">60");
    await expect(
      page.getByRole("heading", { name: "Advanced Econometric Modeling & Time Series", level: 3 })
    ).toBeVisible(); // 75 mins
    await expect(
      page.getByRole("heading", { name: "Python for Official Statistics & Microdata Processing", level: 3 })
    ).not.toBeVisible(); // 50 mins
  });

  test("8. Search input filters courses by keywords and supports clear/reset", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search courses, topics, competencies, or providers...");

    await searchInput.fill("Neyman");
    await expect(
      page.getByRole("heading", { name: "Official Sample Survey Design & Stratification", level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Python for Official Statistics & Microdata Processing", level: 3 })
    ).not.toBeVisible();

    // Clear search
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(searchInput).toHaveValue("");
    await expect(
      page.getByRole("heading", { name: "Python for Official Statistics & Microdata Processing", level: 3 })
    ).toBeVisible();
  });

  test("9. Bilingual Hindi version (/hi/learner/recommendations) renders localized text", async ({ page }) => {
    await page.goto("/hi/learner/recommendations");
    await expect(page.locator("h1")).toContainText("अनुशंसित अधिगम", { timeout: 15000 });

    // Check localized Python explanation
    await expect(
      page.getByText("अनुशंसित क्योंकि आपकी पायथन (Python) योग्यता आपके पद के लिए आवश्यक स्तर से कम है।").first()
    ).toBeVisible();

    // Check localized badges
    await expect(page.getByText("डेमो कैटलॉग").first()).toBeVisible();
  });
});
