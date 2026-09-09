import { test, expect } from "@playwright/test";

test.describe("Prompt 11: English and Hindi Internationalization (next-intl)", () => {

  test("1. Language Switcher toggles seamlessly between /en and /hi", async ({ page }) => {
    // Start on English learner dashboard
    await page.goto("/en/learner/dashboard");
    await expect(page).toHaveURL(/.*\/en\/learner\/dashboard/);
    const langBtn = page.locator("button[aria-label='Toggle language']");
    await expect(langBtn).toBeVisible({ timeout: 15000 });

    // Click Language Switcher to switch to Hindi
    await langBtn.click();

    // Verify URL changed to /hi
    await expect(page).toHaveURL(/.*\/hi\/learner\/dashboard/, { timeout: 15000 });

    // Verify key Devanagari text is rendered
    await expect(page.locator("text=भारत सरकार").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=राजेश कुमार वर्मा").first()).toBeVisible();

    // Click again to switch back to English
    await langBtn.click();
    await expect(page).toHaveURL(/.*\/en\/learner\/dashboard/, { timeout: 15000 });
    await expect(page.locator("text=Rajesh Kumar Verma").first()).toBeVisible({ timeout: 10000 });
  });

  test("2. Preserves URL query parameters when switching languages", async ({ page }) => {
    // Navigate with query params
    await page.goto("/en/learner/recommendations?competencyId=comp-stat-comp");
    await expect(page).toHaveURL(/competencyId=comp-stat-comp/);

    // Toggle to Hindi
    const langBtn = page.locator("button[aria-label='Toggle language']");
    await expect(langBtn).toBeVisible({ timeout: 15000 });
    await langBtn.click();

    // Verify query param is preserved in Hindi URL
    await expect(page).toHaveURL(/.*\/hi\/learner\/recommendations\?competencyId=comp-stat-comp/, { timeout: 15000 });

    // Toggle back to English
    await langBtn.click();
    await expect(page).toHaveURL(/.*\/en\/learner\/recommendations\?competencyId=comp-stat-comp/, { timeout: 15000 });
  });

  test("3. Configures Noto Sans Devanagari font and html attributes for Hindi", async ({ page }) => {
    await page.goto("/hi/learner/dashboard");

    // Verify html lang attribute is "hi"
    const htmlLang = await page.locator("html").getAttribute("lang");
    expect(htmlLang).toBe("hi");

    // Verify html dir attribute is "ltr"
    const htmlDir = await page.locator("html").getAttribute("dir");
    expect(htmlDir).toBe("ltr");

    // Verify font-devanagari class is on body
    const bodyClass = await page.locator("body").getAttribute("class");
    expect(bodyClass).toContain("font-devanagari");

    // Verify font family includes Noto Sans Devanagari or devanagari variable
    const computedFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    expect(computedFont.toLowerCase()).toMatch(/noto sans devanagari|devanagari|var\(--font-devanagari\)/);
  });

  test("4. Navigation and Breadcrumbs render authentic Hindi translations", async ({ page }) => {
    await page.goto("/hi/learner/competency");

    // Micro-bar government text
    await expect(page.locator("text=भारत सरकार").first()).toBeVisible({ timeout: 15000 });

    // Sidebar navigation in Hindi
    const sidebar = page.locator("aside").first();
    await expect(sidebar.locator("text=मेरी क्षमता").first()).toBeVisible();

    // Breadcrumbs in Hindi
    const breadcrumb = page.locator("nav[aria-label='Breadcrumb']");
    if (await breadcrumb.isVisible()) {
      await expect(breadcrumb.locator("text=शिक्षार्थी").first()).toBeVisible();
    }
  });

  test("5. Assessment Results page renders Hindi without hardcoded text", async ({ page }) => {
    await page.goto("/hi/learner/assessment-results/baseline-cadre-2026");

    // Wait for content
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });

    // Header & Score Card in Hindi
    await expect(page.locator("text=मूल्यांकन परिणाम").first()).toBeVisible();
    await expect(page.locator("text=समग्र क्षमता स्कोर")).toBeVisible();

    // Status / badges in Hindi
    await expect(page.locator("text=पूर्ण").first()).toBeVisible();

    // Recommendations section in Hindi
    await expect(page.locator("text=अनुशंसित").first()).toBeVisible();
  });

  test("6. Learning Path page renders NOW -> NEXT -> LATER in Hindi", async ({ page }) => {
    await page.goto("/hi/learner/learning-path");

    // Verify learning path header
    await expect(page.locator("text=मेरी शिक्षण यात्रा").or(page.locator("text=शिक्षण पथ")).first()).toBeVisible({
      timeout: 15000,
    });

    // Verify timeline stages with Hindi labels
    await expect(page.locator("text=अभी (NOW)").first()).toBeVisible();
    await expect(page.locator("text=अगला (NEXT)").first()).toBeVisible();
    await expect(page.locator("text=बाद में (LATER)").first()).toBeVisible();

    // Verify Hindi action buttons/labels
    await expect(page.locator("text=प्रगति").first()).toBeVisible();
  });

  test("7. Quiz Generator workflow renders in Hindi", async ({ page }) => {
    await page.goto("/hi/learner/quiz-generator");

    // Header in Hindi
    await expect(page.locator("text=एआई प्रश्नोत्तरी जनरेटर").or(page.locator("text=प्रश्नोत्तरी जनरेटर")).first()).toBeVisible({
      timeout: 15000,
    });

    // Step 1 title in Hindi
    await expect(page.locator("text=सामग्री अपलोड करें").first()).toBeVisible();

    // RAG explanation banner in Hindi
    await expect(page.locator("text=जिम्मेदार एआई").or(page.locator("text=RAG")).first()).toBeVisible();
  });

  test("8. Admin Dashboard and Team Heatmap render in Hindi", async ({ page }) => {
    // Admin Dashboard
    await page.goto("/hi/admin/dashboard");
    await expect(page.locator("h1").filter({ hasText: /प्रशासक|डैशबोर्ड/ })).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=कुल पंजीकृत अधिकारी").or(page.locator("text=कुल अधिकारी")).first()).toBeVisible();

    // Team Competency Heatmap
    await page.goto("/hi/admin/team");
    await expect(page.locator("text=टीम योग्यता हीटमैप").or(page.locator("text=हीटमैप")).first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator("th", { hasText: "Team A" })).toBeVisible();
    await expect(page.locator("text=पायथन").first()).toBeVisible();
    await expect(page.locator("text=सांख्यिकी").first()).toBeVisible();
  });

  test("9. Responsive Mobile Layout: Long Hindi text wraps properly without horizontal document overflow", async ({ page }) => {
    // Mobile Viewport (iPhone SE / 375px)
    await page.setViewportSize({ width: 375, height: 667 });

    // Test Learner Dashboard on mobile
    await page.goto("/hi/learner/dashboard");
    await page.waitForLoadState("networkidle");

    // Check that document does not have horizontal scrollbar overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Test Admin Dashboard on mobile
    await page.goto("/hi/admin/dashboard");
    await page.waitForLoadState("networkidle");

    const hasAdminHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasAdminHorizontalOverflow).toBe(false);
  });

});
