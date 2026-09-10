import { test, expect } from "@playwright/test";

test.describe("Prompt 3: Baseline Competency Assessment", () => {
  test("My Competency navigates to assessment intro and starts assessment runner", async ({ page }) => {
    await page.goto("/en/learner/competency");

    // Click 'Start Baseline Assessment'
    const startCta = page.getByRole("link", { name: /Start Baseline Assessment/i }).first();
    await expect(startCta).toBeVisible();
    await startCta.click();

    // Verify arrival at assessment route
    await expect(page).toHaveURL(/.*\/en\/learner\/assessment.*/);

    // Verify Intro Screen content
    await expect(page.locator("h1:has-text('Baseline Competency Assessment')")).toBeVisible();
    await expect(
      page.locator("text=This assessment helps measure your demonstrated competencies against the requirements")
    ).toBeVisible();
    await expect(page.locator("text=Statistical Officer").first()).toBeVisible();
    await expect(page.locator("text=10 MCQs").first()).toBeVisible();
    await expect(page.locator("text=10 minutes").first()).toBeVisible();
    await expect(page.locator("text=Statistical Modeling").first()).toBeVisible();
    await expect(page.locator("text=Data Quality").first()).toBeVisible();

    // Click 'Start Assessment'
    const beginBtn = page.getByRole("button", { name: /Start Assessment/i });
    await expect(beginBtn).toBeVisible();
    await beginBtn.click();

    // Verify Runner Screen loaded
    await expect(page.locator("text=Question 1 of 10")).toBeVisible();
    await expect(page.locator("text=Competency: Statistical Modeling")).toBeVisible();
    await expect(page.locator("text=Question Navigator")).toBeVisible();
  });

  test("Question runner allows selecting answers, persists selection, and navigates Previous/Next", async ({ page }) => {
    await page.goto("/en/learner/assessment/baseline-cadre-2026");

    // Start assessment
    const beginBtn = page.getByRole("button", { name: /Start Assessment/i });
    await expect(beginBtn).toBeVisible();
    await beginBtn.click();

    await expect(page.locator("text=Question 1 of 10")).toBeVisible();

    // Select Option B for Question 1
    const optionB = page.locator("text=The OLS estimators remain unbiased, but standard errors are biased");
    await expect(optionB).toBeVisible();
    await optionB.click();

    // Check Question Navigator shows Question 1 as answered
    const q1Btn = page.locator("button[aria-label^='Question 1:']");
    await expect(q1Btn).toBeVisible();

    // Click Next to go to Question 2
    const nextBtn = page.getByRole("button", { name: /^Next$/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    await expect(page.locator("text=Question 2 of 10")).toBeVisible();
    await expect(page.locator("text=ARIMA(p, d, q)")).toBeVisible();

    // Click Previous to return to Question 1 and verify answer persists
    const prevBtn = page.getByRole("button", { name: /^Previous$/i });
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();

    await expect(page.locator("text=Question 1 of 10")).toBeVisible();
    // Verify Option B is still selected
    const selectedRadio = page.locator("label:has-text('The OLS estimators remain unbiased')");
    await expect(selectedRadio).toHaveClass(/ring-blue-800/);
  });

  test("Question navigator supports flagging for review and direct jumps", async ({ page }) => {
    await page.goto("/en/learner/assessment/baseline-cadre-2026");

    const beginBtn = page.getByRole("button", { name: /Start Assessment/i });
    await expect(beginBtn).toBeVisible();
    await beginBtn.click();

    // Flag Question 1
    const flagBtn = page.getByRole("button", { name: /Flag for Review/i });
    await expect(flagBtn).toBeVisible();
    await flagBtn.click();

    // Verify flag icon appears on Question 1 in Navigator
    await expect(page.getByRole("button", { name: "Flagged for Review", exact: true })).toBeVisible();

    // Directly jump to Question 8 using Question Navigator
    const q8Btn = page.locator("button[aria-label^='Question 8:']");
    await expect(q8Btn).toBeVisible();
    await q8Btn.click();

    // Verify arrived at Question 8
    await expect(page.locator("text=Question 8 of 10")).toBeVisible();
    await expect(page.locator("text=Survey Methodology").first()).toBeVisible();
    await expect(page.locator("text=Neyman Optimal Allocation")).toBeVisible();
  });

  test("Submit confirmation modal shows answered/unanswered counts and completes submission", async ({ page }) => {
    await page.goto("/en/learner/assessment/baseline-cadre-2026");

    const beginBtn = page.getByRole("button", { name: /Start Assessment/i });
    await expect(beginBtn).toBeVisible();
    await beginBtn.click();

    // Open Submit Modal
    const submitBtn = page.getByRole("button", { name: /Submit Assessment/i }).first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify Modal content
    await expect(page.locator("text=Are you sure you want to submit your assessment?")).toBeVisible();
    await expect(page.getByText("Answered:", { exact: true })).toBeVisible();
    await expect(page.getByText("Unanswered:", { exact: true })).toBeVisible();

    // Click Submit Assessment inside Modal
    const modalSubmitBtn = page.locator("div[role='dialog'] button:has-text('Submit Assessment')");
    await expect(modalSubmitBtn).toBeVisible();
    await modalSubmitBtn.click();

    // Verify redirect to results page
    await expect(page).toHaveURL(/.*\/en\/learner\/(assessment-)?results.*/);
    await expect(page.locator("h1:has-text('Assessment Results')")).toBeVisible();
    await expect(page.locator("span:has-text('Overall Competency Score')")).toBeVisible();

    // Verify 'Back to My Competency' navigates back to My Competency
    const backBtn = page.getByRole("link", { name: /Back to My Competency/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL(/.*\/en\/learner\/competency.*/);
  });

  test("Hindi localization renders assessment intro and runner", async ({ page }) => {
    await page.goto("/hi/learner/assessment/baseline-cadre-2026");

    await expect(page.locator("h1:has-text('आधारभूत क्षमता मूल्यांकन')")).toBeVisible();
    await expect(page.locator("text=१० बहुविकल्पीय प्रश्न")).toBeVisible();
    await expect(page.locator("text=१० मिनट")).toBeVisible();
    await expect(page.locator("text=मूल्यांकन प्रारंभ करें")).toBeVisible();
  });

  test("Keyboard shortcuts (1-4, A-D, Arrows) select answers and assessments route works", async ({ page }) => {
    // Test the explicit plural route: /en/learner/assessments/baseline-cadre-2026
    await page.goto("/en/learner/assessments/baseline-cadre-2026");

    const beginBtn = page.getByRole("button", { name: /Start Assessment/i });
    await expect(beginBtn).toBeVisible();
    await beginBtn.click();

    await expect(page.locator("text=Question 1 of 10")).toBeVisible();

    // Press key '2' to select Option B
    await page.keyboard.press("2");
    const optionB = page.locator("label:has-text('The OLS estimators remain unbiased')");
    await expect(optionB).toHaveClass(/ring-blue-800/);

    // Press key 'a' to switch to Option A
    await page.keyboard.press("a");
    const optionA = page.locator("label:has-text('The OLS regression parameter estimates become biased')");
    await expect(optionA).toHaveClass(/ring-blue-800/);

    // Press ArrowDown to move to Option B
    await page.keyboard.press("ArrowDown");
    await expect(optionB).toHaveClass(/ring-blue-800/);
  });
});
