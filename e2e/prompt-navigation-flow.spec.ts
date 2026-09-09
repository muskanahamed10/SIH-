import { test, expect } from "@playwright/test";

test.describe("Full Navigation and Routing Flow Verification", () => {
  test.describe.configure({ mode: "serial" });

  const requiredRoutes = [
    {
      name: "My Competency",
      path: "/en/learner/competency",
      expectedHeading: /My Competency/i,
    },
    {
      name: "Baseline Assessment Runner",
      path: "/en/learner/assessment/baseline-cadre-2026",
      expectedHeading: /Baseline Competency Assessment/i,
    },
    {
      name: "Assessment Results & Gap Analysis",
      path: "/en/learner/results/eval-baseline-cadre-2026",
      expectedHeading: /Assessment Results/i,
    },
    {
      name: "Recommended Learning",
      path: "/en/learner/recommendations",
      expectedHeading: /Recommended Learning/i,
    },
    {
      name: "Personalized Learning Path",
      path: "/en/learner/learning-path",
      expectedHeading: /My Learning Path/i,
    },
    {
      name: "Resource Detail View",
      path: "/en/learner/resources/rec-stat-model-101",
      expectedHeading: /Statistical Modeling Fundamentals/i,
    },
    {
      name: "Targeted Practice Quiz",
      path: "/en/learner/practice/comp-stat-model",
      expectedHeading: /Statistical Modeling/i,
    },
    {
      name: "Cadre Reassessment Diagnostic",
      path: "/en/learner/reassessment/comp-stat-model",
      expectedHeading: /Statistical Modeling/i,
    },
  ];

  // 1. Verify all 8 learner routes exist, render content, and survive direct browser refresh
  for (const route of requiredRoutes) {
    test(`Route ${route.name} (${route.path}) renders and survives browser refresh`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(new RegExp(route.path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")));
      await expect(page.locator("body")).toBeVisible();
      await expect(page.getByRole("heading", { name: route.expectedHeading }).first()).toBeVisible();

      // Browser refresh verification
      await page.reload();
      await expect(page).toHaveURL(new RegExp(route.path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")));
      await expect(page.getByRole("heading", { name: route.expectedHeading }).first()).toBeVisible();
    });
  }

  // 2. Main Navigation tabs in header / sidebar
  test("Main navigation items open proper destinations", async ({ page }) => {
    await page.goto("/en/learner");

    // Home
    const homeTab = page.locator("nav[aria-label='Primary Navigation'] >> text=Home").first();
    await expect(homeTab).toBeVisible();
    await homeTab.click();
    await expect(page).toHaveURL(/\/en\/learner/);

    // Explore
    const exploreTab = page.locator("nav[aria-label='Primary Navigation'] >> text=Explore").first();
    await expect(exploreTab).toBeVisible();
    await exploreTab.click();
    await expect(page).toHaveURL(/\/en\/explore/);

    // My Learning
    const myLearningTab = page.locator("nav[aria-label='Primary Navigation'] >> text=My Learning").first();
    await expect(myLearningTab).toBeVisible();
    await myLearningTab.click();
    await expect(page).toHaveURL(/\/en\/learning/);

    // My Competency
    const myCompetencyTab = page.locator("nav[aria-label='Primary Navigation'] >> text=My Competency").first();
    await expect(myCompetencyTab).toBeVisible();
    await myCompetencyTab.click();
    await expect(page).toHaveURL(/\/en\/learner\/competency/);

    // Achievement
    const achievementTab = page.locator("nav[aria-label='Primary Navigation'] >> text=Achievement").first();
    await expect(achievementTab).toBeVisible();
    await achievementTab.click();
    await expect(page).toHaveURL(/\/en\/achievement/);
  });

  // 3. Verify Internal CTA buttons
  test("Internal CTA buttons navigate to target views", async ({ page }) => {
    // 3.1 From Competency -> Start Baseline Assessment
    await page.goto("/en/learner/competency");
    const startAssessmentBtn = page.getByRole("button", { name: /Start Baseline Assessment/i }).first();
    await expect(startAssessmentBtn).toBeVisible();
    await startAssessmentBtn.click();
    await expect(page).toHaveURL(/\/en\/learner\/assessment/);

    // 3.2 From Dashboard -> View Results
    await page.goto("/en/learner");
    const viewResultsLink = page.locator("a:has-text('View Results')").first();
    if (await viewResultsLink.isVisible()) {
      await viewResultsLink.click();
      await expect(page).toHaveURL(/\/en\/learner\/results/);
    }

    // 3.3 From Results -> View Recommendations
    await page.goto("/en/learner/results/eval-baseline-cadre-2026");
    const recsBtn = page.getByRole("button", { name: /View Recommendations/i }).first();
    await expect(recsBtn).toBeVisible();
    await recsBtn.click();
    await expect(page).toHaveURL(/\/en\/learner\/recommendations/);

    // 3.4 From Recommendations -> View Full Learning Path
    await page.goto("/en/learner/recommendations");
    const learningPathBtn = page.getByRole("button", { name: /View Full Learning Path/i }).first();
    await expect(learningPathBtn).toBeVisible();
    await learningPathBtn.click();
    await expect(page).toHaveURL(/\/en\/learner\/learning-path/);

    // 3.5 From Recommendations -> Start Learning (Resource Detail)
    await page.goto("/en/learner/recommendations");
    const startLearningBtn = page.getByRole("button", { name: /Start Learning/i }).first();
    await expect(startLearningBtn).toBeVisible();
    await startLearningBtn.click();
    await expect(page).toHaveURL(/\/en\/learner\/resources\//);

    // 3.6 From Resource Detail -> Take Practice
    await page.goto("/en/learner/resources/rec-stat-model-101");
    const takePracticeBtn = page.getByRole("button", { name: /Take Practice/i }).first();
    await expect(takePracticeBtn).toBeVisible();
    await takePracticeBtn.click();
    await expect(page).toHaveURL(/\/en\/learner\/practice\//);

    // 3.7 From Learning Path -> Cadre Reassessment
    await page.goto("/en/learner/learning-path");
    const reassessmentLink = page.locator("a:has-text('Cadre Reassessment')").first();
    await expect(reassessmentLink).toBeVisible();
    await reassessmentLink.click();
    await expect(page).toHaveURL(/\/en\/learner\/reassessment\//);
  });

  // 4. End-to-End User Navigation Flow
  test("End-to-end user navigation flow: Home → My Competency → Assessment → Results → Recommendations → Learning Path → Resource Detail → Practice → Reassessment", async ({
    page,
  }) => {
    // 1. Home
    await page.goto("/en/learner");
    await expect(page.locator("text=Subordinate Statistical Service (SSS)")).toBeVisible();

    // 2. Home → My Competency
    const compNav = page.locator("nav[aria-label='Primary Navigation'] >> text=My Competency").first();
    await compNav.click();
    await expect(page).toHaveURL(/\/en\/learner\/competency/);
    await expect(page.getByRole("heading", { name: /My Competency/i }).first()).toBeVisible();

    // 3. My Competency → Assessment Runner
    const startBtn = page.getByRole("button", { name: /Start Baseline Assessment/i }).first();
    await startBtn.click();
    await expect(page).toHaveURL(/\/en\/learner\/assessment/);
    await expect(page.getByRole("heading", { name: /Baseline Competency Assessment/i }).first()).toBeVisible();

    // 4. Assessment Runner → Results (via Direct Navigation or Results CTA)
    await page.goto("/en/learner/results/eval-baseline-cadre-2026");
    await expect(page.getByRole("heading", { name: /Assessment Results/i }).first()).toBeVisible();
    await expect(page.locator("text=Overall Competency Score")).toBeVisible();

    // 5. Results → Recommendations
    const viewRecs = page.getByRole("button", { name: /View Recommendations/i }).first();
    await viewRecs.click();
    await expect(page).toHaveURL(/\/en\/learner\/recommendations/);
    await expect(page.getByRole("heading", { name: /Recommended Learning/i }).first()).toBeVisible();

    // 6. Recommendations → Learning Path
    const viewLp = page.getByRole("button", { name: /View Full Learning Path/i }).first();
    await viewLp.click();
    await expect(page).toHaveURL(/\/en\/learner\/learning-path/);
    await expect(page.getByRole("heading", { name: /My Learning Path/i }).first()).toBeVisible();

    // 7. Learning Path / Recommendations → Resource Detail
    await page.goto("/en/learner/resources/rec-stat-model-101");
    await expect(page).toHaveURL(/\/en\/learner\/resources\/rec-stat-model-101/);
    await expect(page.getByRole("heading", { name: /Statistical Modeling Fundamentals/i }).first()).toBeVisible();

    // 8. Resource Detail → Practice
    const practiceCta = page.getByRole("button", { name: /Take Practice/i }).first();
    await practiceCta.click();
    await expect(page).toHaveURL(/\/en\/learner\/practice\/comp-stat-model/);
    await expect(page.getByRole("heading", { name: /Statistical Modeling/i }).first()).toBeVisible();

    // Complete practice question 1
    await page.click("text=Intra-cluster correlation among sampling units");
    await page.click("button:has-text('Check Answer')");
    await expect(page.locator("text=Statistical Explanation")).toBeVisible();
    await page.click("button:has-text('Next Question')");

    // Complete practice question 2
    await page.click("text=The odds of participation are 45% higher");
    await page.click("button:has-text('Check Answer')");
    await page.click("button:has-text('Next Question')");

    // Practice quiz completion screen
    await expect(page.locator("text=Practice Quiz Completed")).toBeVisible();

    // 9. Practice → Reassessment
    const takeReassessmentCta = page.getByRole("button", { name: /Take Reassessment/i }).first();
    await takeReassessmentCta.click();
    await expect(page).toHaveURL(/\/en\/learner\/reassessment\/comp-stat-model/);
    await expect(page.getByRole("heading", { name: /Statistical Modeling/i }).first()).toBeVisible();

    // Answer both reassessment questions
    await page.click("text=Balanced Repeated Replication (BRR)");
    await page.click("text=Generalized Raking Ratio / Calibration Weighting");
    await page.click("button:has-text('Submit Reassessment')");

    // Diagnostic Score Gain & Completion
    await expect(page.locator("text=Reassessment Successfully Evaluated")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=pts Gain")).toBeVisible();

    // 10. Reassessment → My Competency (Closing the intelligence loop)
    const returnToComp = page.getByRole("button", { name: /View Updated Competency/i }).first();
    await returnToComp.click();
    await expect(page).toHaveURL(/\/en\/learner\/competency/);
  });
});
