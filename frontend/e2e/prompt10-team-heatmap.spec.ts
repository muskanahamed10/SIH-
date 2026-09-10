import { test, expect } from "@playwright/test";

test.describe("Prompt 10: Team Competency Heatmap Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/admin/team");
    await expect(page.locator("h2, .font-extrabold").filter({ hasText: "Team Competency Heatmap" })).toBeVisible({
      timeout: 15000,
    });
  });

  test("1. Renders accessible table semantics underneath visual representation", async ({ page }) => {
    const table = page.getByRole("table", { name: "Team Competency Heatmap Matrix" });
    await expect(table).toBeVisible();

    // Verify accessible thead column headers
    await expect(table.locator("th[scope='col']").filter({ hasText: "Team / Official" })).toBeVisible();
    await expect(table.locator("th[scope='col']").filter({ hasText: "Python" })).toBeVisible();
    await expect(table.locator("th[scope='col']").filter({ hasText: "Statistics" })).toBeVisible();
    await expect(table.locator("th[scope='col']").filter({ hasText: "Survey" })).toBeVisible();
    await expect(table.locator("th[scope='col']").filter({ hasText: "Visualization" })).toBeVisible();
    await expect(table.locator("th[scope='col']").filter({ hasText: "Overall Avg" })).toBeVisible();

    // Verify row headers th[scope='row']
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team A" })).toBeVisible();
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team B" })).toBeVisible();
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team C" })).toBeVisible();

    // Verify summary row in tfoot
    await expect(table.locator("tfoot th[scope='row']").filter({ hasText: "Cadre Competency Average" })).toBeVisible();
  });

  test("2. Displays exact user example team scores (Team A, B, C across Python, Statistics, Survey, Visualization)", async ({ page }) => {
    const table = page.getByRole("table", { name: "Team Competency Heatmap Matrix" });

    // Team A: Python 38%, Statistics 82%, Survey 76%, Visualization 52%
    const teamARow = table.locator("tr").filter({ has: page.locator("th", { hasText: "Team A" }) });
    await expect(teamARow).toBeVisible();
    await expect(teamARow.getByRole("button", { name: /Score: 38%/ })).toBeVisible();
    await expect(teamARow.getByRole("button", { name: /Score: 82%/ })).toBeVisible();
    await expect(teamARow.getByRole("button", { name: /Score: 76%/ })).toBeVisible();
    await expect(teamARow.getByRole("button", { name: /Score: 52%/ })).toBeVisible();

    // Team B: Python 61%, Statistics 78%, Survey 65%, Visualization 71%
    const teamBRow = table.locator("tr").filter({ has: page.locator("th", { hasText: "Team B" }) });
    await expect(teamBRow).toBeVisible();
    await expect(teamBRow.getByRole("button", { name: /Score: 61%/ })).toBeVisible();
    await expect(teamBRow.getByRole("button", { name: /Score: 78%/ })).toBeVisible();
    await expect(teamBRow.getByRole("button", { name: /Score: 65%/ })).toBeVisible();
    await expect(teamBRow.getByRole("button", { name: /Score: 71%/ })).toBeVisible();

    // Team C: Python 42%, Statistics 91%, Survey 58%, Visualization 49%
    const teamCRow = table.locator("tr").filter({ has: page.locator("th", { hasText: "Team C" }) });
    await expect(teamCRow).toBeVisible();
    await expect(teamCRow.getByRole("button", { name: /Score: 42%/ })).toBeVisible();
    await expect(teamCRow.getByRole("button", { name: /Score: 91%/ })).toBeVisible();
    await expect(teamCRow.getByRole("button", { name: /Score: 58%/ })).toBeVisible();
    await expect(teamCRow.getByRole("button", { name: /Score: 49%/ })).toBeVisible();
  });

  test("3. Applies visual severity levels and renders severity legend", async ({ page }) => {
    // Verify Legend items
    await expect(page.getByText("Visual Severity Levels:")).toBeVisible();
    await expect(page.getByText("Critical Gap (<50%)", { exact: true })).toBeVisible();
    await expect(page.getByText("Moderate Gap (50–69%)", { exact: true })).toBeVisible();
    await expect(page.getByText("Meets Benchmark (70–84%)", { exact: true })).toBeVisible();
    await expect(page.getByText("Exceeds Benchmark (≥85%)", { exact: true })).toBeVisible();

    // Inspect Team A's 38% Python cell (has Critical severity badge)
    const teamACellBtn = page.getByRole("button", { name: /Team A, Python, Score: 38%/ });
    await expect(teamACellBtn).toBeVisible();
    await expect(teamACellBtn).toHaveClass(/bg-rose-100/);

    // Inspect Team C's 91% Statistics cell (has Exceeds severity badge)
    const teamCCellBtn = page.getByRole("button", { name: /Team C, Statistics, Score: 91%/ });
    await expect(teamCCellBtn).toBeVisible();
    await expect(teamCCellBtn).toHaveClass(/bg-blue-100/);
  });

  test("4. Department / Team dropdown filter filters rows accurately", async ({ page }) => {
    const table = page.getByRole("table", { name: "Team Competency Heatmap Matrix" });
    const deptSelect = page.locator("select").first();

    // Filter to Team A
    await deptSelect.selectOption("team-a");
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team A" })).toBeVisible();
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team B" })).not.toBeVisible();
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team C" })).not.toBeVisible();

    // Reset to All
    await deptSelect.selectOption("all");
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team A" })).toBeVisible();
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team B" })).toBeVisible();
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team C" })).toBeVisible();
  });

  test("5. View switcher toggles between Teams and Individual Employees", async ({ page }) => {
    const table = page.getByRole("table", { name: "Team Competency Heatmap Matrix" });

    // Initial Teams view
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team A" })).toBeVisible();

    // Switch to Individual Employees view
    const empViewBtn = page.getByRole("button", { name: "Individual Officers" });
    await expect(empViewBtn).toBeVisible();
    await empViewBtn.click();

    // Verify Officers are visible
    await expect(table.locator("th[scope='row']").filter({ hasText: "Amitabh Banerjee" })).toBeVisible();
    await expect(table.locator("th[scope='row']").filter({ hasText: "Priya Sundaram" })).toBeVisible();

    // Switch back to Teams view
    await page.getByRole("button", { name: "Teams & Divisions" }).click();
    await expect(table.locator("th[scope='row']").filter({ hasText: "Team A" })).toBeVisible();
  });

  test("6. Clicking a competency cell opens drilldown modal with recommended iGOT course", async ({ page }) => {
    // Click Team A's 38% Python cell
    const cellBtn = page.getByRole("button", { name: /Team A, Python, Score: 38%/ });
    await cellBtn.click();

    // Verify Modal
    const modal = page.getByRole("dialog", { name: "Competency Drilldown & Remediation" });
    await expect(modal).toBeVisible();
    await expect(modal.getByText("Team A", { exact: true })).toBeVisible();
    await expect(modal.getByText("Python", { exact: true })).toBeVisible();
    await expect(modal.getByText("38%", { exact: true })).toBeVisible();
    await expect(modal.getByText("Target Benchmark:", { exact: true })).toBeVisible();
    await expect(modal.getByText("80%", { exact: true })).toBeVisible();
    await expect(modal.getByText("-42% Gap")).toBeVisible();
    await expect(modal.getByText("Python for Official Statistics: Survey Data Cleaning & Tabulation")).toBeVisible();

    // Close Modal
    await modal.getByRole("button", { name: "Close Drilldown" }).click();
    await expect(modal).not.toBeVisible();
  });

  test("7. Bilingual Hindi version (/hi/admin/team) renders localized heatmap", async ({ page }) => {
    await page.goto("/hi/admin/team");
    await expect(page.locator("h2, .font-extrabold").filter({ hasText: "टीम योग्यता हीटमैप" })).toBeVisible({
      timeout: 15000,
    });

    const table = page.getByRole("table", { name: "Team Competency Heatmap Matrix" });
    await expect(table).toBeVisible();

    // Localized Column Headers
    await expect(table.getByText("पायथन (Python)")).toBeVisible();
    await expect(table.getByText("सांख्यिकी (Statistics)")).toBeVisible();
    await expect(table.getByText("सर्वेक्षण (Survey)")).toBeVisible();
    await expect(table.getByText("विज़ुअलाइज़ेशन (Visualization)")).toBeVisible();

    // Localized Legend
    await expect(page.getByText("दृश्य गंभीरता स्तर:")).toBeVisible();
    await expect(page.getByText("गंभीर कमी (<50%)", { exact: true })).toBeVisible();
  });
});
