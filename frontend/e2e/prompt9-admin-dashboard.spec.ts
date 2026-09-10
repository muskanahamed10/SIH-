import { test, expect } from "@playwright/test";

test.describe("Prompt 9: Admin / Manager Dashboard (Department Head Overview)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/admin/dashboard");
    await expect(page.locator("h1")).toContainText("Department Head Competency & Capacity Dashboard", {
      timeout: 15000,
    });
  });

  test("1. Header renders Department Head credentials, cadre oversight, and demo data notice", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Dr. Arvinda Sharma • Additional Director General")).toBeVisible();
    await expect(page.getByText("National Accounts & Economic Statistics Oversight")).toBeVisible();
    await expect(page.getByText("ISS & SSS Statistical Cadre")).toBeVisible();

    // Demo Data Notice
    await expect(
      page.getByText("Simulated Demonstration Data • MoSPI Cadre Capacity Building")
    ).toBeVisible();

    // Export Action
    const exportBtn = page.getByRole("button", { name: "Export Cadre Briefing" });
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();
    await expect(page.getByText("Cadre Executive Briefing generated successfully")).toBeVisible();
  });

  test("2. All 5 Core KPIs display accurate values (Total officials, Active learners, Assessments, Avg competency, Course completion)", async ({ page }) => {
    const kpiSection = page.getByRole("region", { name: "Administrative Core KPIs" });
    await expect(kpiSection).toBeVisible();

    // 1. Total Officials: 2,840
    await expect(kpiSection.getByText("Total Registered Officials")).toBeVisible();
    await expect(kpiSection.getByText("2,840")).toBeVisible();

    // 2. Active Learners: 1,965
    await expect(kpiSection.getByText("Active Monthly Learners")).toBeVisible();
    await expect(kpiSection.getByText("1,965")).toBeVisible();
    await expect(kpiSection.getByText("69.2% active engagement")).toBeVisible();

    // 3. Assessments Completed: 4,120
    await expect(kpiSection.getByText("Assessments Completed")).toBeVisible();
    await expect(kpiSection.getByText("4,120")).toBeVisible();

    // 4. Average Competency Score: 74.2%
    await expect(kpiSection.getByText("Average Competency Score")).toBeVisible();
    await expect(kpiSection.getByText("74.2%")).toBeVisible();
    await expect(kpiSection.getByText("Target: 80%")).toBeVisible();

    // 5. Course Completion Rate: 68.5%
    await expect(kpiSection.getByText("Course Completion Rate")).toBeVisible();
    await expect(kpiSection.getByText("68.5%")).toBeVisible();
    await expect(kpiSection.getByText("+8.2% YoY growth")).toBeVisible();
  });

  test("3. Competency distribution chart renders Recharts visualizer and supports tab toggle", async ({ page }) => {
    const distCard = page.getByRole("region", { name: "Cadre Competency Distribution" });
    await expect(distCard).toBeVisible();
    await expect(distCard.getByText("Demonstrated proficiency vs target benchmarks")).toBeVisible();

    // Verify Tab Switcher
    const domainTab = distCard.getByRole("button", { name: "By Competency Domain" });
    const levelTab = distCard.getByRole("button", { name: "By Proficiency Level" });
    await expect(domainTab).toBeVisible();
    await expect(levelTab).toBeVisible();

    // Click Level tab
    await levelTab.click();
    await expect(distCard.locator("text=/Level 1/").first()).toBeVisible();
    await expect(distCard.locator("text=/Level 3/").first()).toBeVisible();

    // Click back to Domain tab
    await domainTab.click();
    await expect(distCard.getByText("Critical Shortfall: Statistical Computing")).toBeVisible();
  });

  test("4. Directorate competency heatmap matrix displays 5 directorates and supports division filtering", async ({ page }) => {
    const heatmapCard = page.getByRole("region", { name: "Directorate Competency Heatmap Matrix" });
    await expect(heatmapCard).toBeVisible();

    // 5 Directorates visible in table
    await expect(heatmapCard.getByText("National Accounts Division")).toBeVisible();
    await expect(heatmapCard.getByText("Field Operations Division")).toBeVisible();
    await expect(heatmapCard.getByText("Survey Design & Research Division")).toBeVisible();
    await expect(heatmapCard.getByText("Data Quality Assurance Division")).toBeVisible();
    await expect(heatmapCard.getByText("Economic Statistics Division")).toBeVisible();

    // Division averages
    await expect(heatmapCard.getByText("82.4%")).toBeVisible();
    await expect(heatmapCard.getByText("71.8%")).toBeVisible();
    await expect(heatmapCard.getByText("86.1%")).toBeVisible();
    await expect(heatmapCard.getByText("79.5%")).toBeVisible();
    await expect(heatmapCard.getByText("76.9%")).toBeVisible();

    // Test Division filter chip
    await heatmapCard.getByRole("button", { name: "NAD" }).click();
    await expect(heatmapCard.getByText("National Accounts Division")).toBeVisible();
    await expect(heatmapCard.getByText("Field Operations Division")).not.toBeVisible();

    // Filter back to All
    await heatmapCard.getByRole("button", { name: "All Directorates" }).click();
    await expect(heatmapCard.getByText("Field Operations Division")).toBeVisible();
  });

  test("5. Assessment performance chart displays trends, pass rate, and score tier distribution", async ({ page }) => {
    const perfCard = page.getByRole("region", { name: "Assessment Performance & Diagnostic Trends" });
    await expect(perfCard).toBeVisible();
    await expect(perfCard.getByText("88.4% Pass Rate")).toBeVisible();

    // Score tier cards
    await expect(perfCard.getByText("Distinction")).toBeVisible();
    await expect(perfCard.getByText("32%")).toBeVisible();
    await expect(perfCard.getByText("Proficient")).toBeVisible();
    await expect(perfCard.getByText("44%")).toBeVisible();
    await expect(perfCard.getByText("Developing")).toBeVisible();
    await expect(perfCard.getByText("18%")).toBeVisible();
    await expect(perfCard.getByText("Critical Remediation")).toBeVisible();
    await expect(perfCard.getByText("6%")).toBeVisible();
  });

  test("6. Course completion trends chart renders iGOT Karmayogi metrics and learning hours", async ({ page }) => {
    const trendsCard = page.getByRole("region", { name: "iGOT Karmayogi Learning & Course Completion Trends" });
    await expect(trendsCard).toBeVisible();
    await expect(trendsCard.getByText("iGOT Karmayogi Integration: Connected")).toBeVisible();
    await expect(trendsCard.getByText("42,180 Total Learning Hours")).toBeVisible();
    await expect(trendsCard.getByText("14.8 hrs / officer / month")).toBeVisible();
  });

  test("7. Top organizational competency gaps displays 5 deficits and dispatches training directives", async ({ page }) => {
    const gapsCard = page.getByRole("region", { name: "Top Organizational Competency Gaps" });
    await expect(gapsCard).toBeVisible();

    // 1. Statistical Computing & Programming (Python / R)
    await expect(
      gapsCard.getByText("Statistical Computing & Programming (Python / R)")
    ).toBeVisible();
    await expect(gapsCard.getByText("1,420 Affected Officials (50%)")).toBeVisible();
    await expect(gapsCard.getByText("-1.8 Levels Deficit")).toBeVisible();
    await expect(gapsCard.getByText("Python for Official Statistics: Survey Data Cleaning & Tabulation")).toBeVisible();

    // 2. Data Management & Microdata Curation
    await expect(
      gapsCard.getByText("Data Management & Microdata Curation")
    ).toBeVisible();
    await expect(gapsCard.getByText("980 Affected Officials (34.5%)")).toBeVisible();

    // 3. Data Visualization & Thematic Mapping (GIS)
    await expect(
      gapsCard.getByText("Data Visualization & Thematic Mapping (GIS)")
    ).toBeVisible();
    await expect(gapsCard.getByText("840 Affected Officials (29.6%)")).toBeVisible();

    // Test Dispatch Training Directive button on gap 1
    const dispatchBtn = gapsCard.getByRole("button", { name: "Dispatch Training Directive" }).first();
    await expect(dispatchBtn).toBeVisible();
    await dispatchBtn.click();
    await expect(
      gapsCard.getByText("Directive Dispatched to Division Supervisors")
    ).toBeVisible();
  });

  test("8. Department Head Operations shortcuts link to official administration panels", async ({ page }) => {
    const opsCard = page.getByRole("region", { name: "Department Head Operations" });
    await expect(opsCard).toBeVisible();
    await expect(opsCard.getByText("AI MCQ SME Review Panel")).toBeVisible();
    await expect(opsCard.getByText("Competency Dictionary")).toBeVisible();
    await expect(opsCard.getByText("Cadre Role Mappings")).toBeVisible();
    await expect(opsCard.getByText("Full Team Heatmap & Roster")).toBeVisible();
  });

  test("9. Bilingual Hindi version (/hi/admin/dashboard) renders localized department head dashboard", async ({ page }) => {
    await page.goto("/hi/admin/dashboard");
    await expect(page.locator("h1")).toContainText("विभागाध्यक्ष योग्यता एवं क्षमता निर्माण डैशबोर्ड", {
      timeout: 15000,
    });
    await expect(page.getByText("डॉ. अरविंदा शर्मा • अपर महानिदेशक")).toBeVisible();
    await expect(page.getByText("प्रदर्शनात्मक नमूना डेटा • सांख्यिकी संवर्ग क्षमता निर्माण")).toBeVisible();
    await expect(page.getByText("कुल पंजीकृत अधिकारी")).toBeVisible();
    await expect(page.getByText("2,840")).toBeVisible();
  });
});
