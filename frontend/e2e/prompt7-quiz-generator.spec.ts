import { test, expect } from "@playwright/test";

test.describe("Prompt 7: AI Quiz Generator (Upload-to-Quiz RAG Workflow)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/learner/quiz-generator");
    await expect(page.locator("h1")).toContainText("AI Quiz Generator", { timeout: 15000 });
  });

  test("1. Page loads successfully with official header, SSS Cadre info, and RAG disclaimer", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Priya Sharma • Statistical Officer").first()).toBeVisible();
    await expect(page.getByText("Subordinate Statistical Service (SSS)").first()).toBeVisible();

    // Stepper navigation bar
    const stepNav = page.getByRole("navigation", { name: "Quiz Generation Workflow" });
    await expect(stepNav).toBeVisible();
    await expect(stepNav.getByText("Upload Material")).toBeVisible();
    await expect(stepNav.getByText("File Information")).toBeVisible();
    await expect(stepNav.getByText("RAG Processing")).toBeVisible();
    await expect(stepNav.getByText("Generated MCQs")).toBeVisible();

    // RAG Architecture Disclaimer Banner
    const disclaimer = page.getByRole("region", { name: "AI and RAG Architecture Information" });
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer.getByText("Decoupled Backend AI / RAG Pipeline Architecture")).toBeVisible();
    await expect(
      disclaimer.getByText("The web browser client does not execute local LLM inference")
    ).toBeVisible();
  });

  test("2. Step 1: Upload Learning Material displays PDF primary dropzone and MoSPI sample manuals", async ({ page }) => {
    // Dropzone
    await expect(page.getByText("Upload Learning Material").first()).toBeVisible();
    await expect(page.getByText("PDF Primary Format")).toBeVisible();
    await expect(page.getByText("Drag and drop your PDF manual here")).toBeVisible();
    await expect(page.getByText("Supports PDF documents up to 50 MB")).toBeVisible();

    // Official MoSPI Sample Materials
    await expect(page.getByText("MoSPI General Crop Estimation Survey (GCES) Field Manual 2025-26")).toBeVisible();
    await expect(page.getByText("Periodic Labour Force Survey (PLFS) Sampling Design & Field Guidelines")).toBeVisible();
    await expect(page.getByText("National Accounts Statistics (NAS) Methodology & Base Revision Primer")).toBeVisible();

    // Generation configuration controls
    await expect(page.getByText("Number of MCQs to Generate")).toBeVisible();
    await expect(page.getByRole("button", { name: "5 MCQs" })).toBeVisible();
    await expect(page.getByText("Primary Competency Focus")).toBeVisible();
  });

  test("3. Step 2: Selecting a sample manual shows complete uploaded file information", async ({ page }) => {
    // Select the GCES Field Manual sample
    const sampleBtn = page.getByRole("button", { name: /MoSPI General Crop Estimation Survey/i });
    await sampleBtn.click();

    // Verify transition to Step 2
    await expect(page.getByText("Step 2: Uploaded File Information")).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("heading", { name: "MoSPI_GCES_Field_Manual_2025-26.pdf" })).toBeVisible();

    // Verify all required file info fields
    await expect(page.getByText("4.2 MB")).toBeVisible();
    await expect(page.getByText("PDF Document")).toBeVisible();
    await expect(page.getByText("48 Pages")).toBeVisible();
    await expect(page.getByText("Valid SHA-256")).toBeVisible();

    // Verify Action buttons
    await expect(page.getByRole("button", { name: "Choose Different File" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Proceed to AI Question Generation" })).toBeVisible();
  });

  test("4. Step 3: Displays all 5 sequential processing states (Uploading -> Extracting -> Retrieving -> Generating -> Ready)", async ({ page }) => {
    // Select sample file and advance to Step 2
    await page.getByRole("button", { name: /MoSPI General Crop Estimation Survey/i }).click();
    await expect(page.getByText("Step 2: Uploaded File Information")).toBeVisible();

    // Trigger AI Generation Pipeline
    await page.getByRole("button", { name: "Proceed to AI Question Generation" }).click();

    // Verify Stepper Region
    const pipeline = page.getByRole("region", { name: "AI Quiz Generation Processing States" });
    await expect(pipeline).toBeVisible();
    await expect(pipeline.getByText("AI / RAG Content Extraction Pipeline")).toBeVisible();

    // Verify all 5 mandated processing states exist in sequence:
    // 1. Uploading
    await expect(pipeline.getByTestId("processing-state-uploading")).toBeVisible();
    await expect(pipeline.getByText("Uploading", { exact: true })).toBeVisible();

    // 2. Extracting content
    await expect(pipeline.getByTestId("processing-state-extracting")).toBeVisible();
    await expect(pipeline.getByText("Extracting content", { exact: true })).toBeVisible();

    // 3. Retrieving relevant content
    await expect(pipeline.getByTestId("processing-state-retrieving")).toBeVisible();
    await expect(pipeline.getByText("Retrieving relevant content", { exact: true })).toBeVisible();

    // 4. Generating questions
    await expect(pipeline.getByTestId("processing-state-generating")).toBeVisible();
    await expect(pipeline.getByText("Generating questions", { exact: true })).toBeVisible();

    // 5. Ready for review
    await expect(pipeline.getByTestId("processing-state-ready")).toBeVisible();
    await expect(pipeline.getByText("Ready for review", { exact: true })).toBeVisible();

    // Wait for pipeline completion (ready state)
    await expect(pipeline.getByText("100% Complete")).toBeVisible({ timeout: 15000 });
    await expect(pipeline.getByText("All 5 stages completed")).toBeVisible();
  });

  test("5. Step 4: Show generated MCQs containing all 8 required items", async ({ page }) => {
    // Select sample and trigger generation
    await page.getByRole("button", { name: /MoSPI General Crop Estimation Survey/i }).click();
    await page.getByRole("button", { name: "Proceed to AI Question Generation" }).click();

    // Wait for generation to finish and transition to Step 4
    const viewMcqBtn = page.getByRole("button", { name: "View Generated MCQs" });
    await viewMcqBtn.waitFor({ state: "visible", timeout: 15000 });
    await viewMcqBtn.click();

    // Step 4 heading
    await expect(page.getByRole("heading", { name: "Generated Diagnostic MCQs" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Questions Ready for Review")).toBeVisible();

    // Inspect Question 1 card
    const q1Card = page.getByTestId("generated-mcq-card-1");
    await expect(q1Card).toBeVisible();

    // 1. Question
    await expect(
      q1Card.getByText("Under the standard Multi-Stage Stratified Sampling design prescribed in the MoSPI GCES Manual")
    ).toBeVisible();

    // 2. Four Options (A, B, C, D)
    await expect(q1Card.getByText("A", { exact: true })).toBeVisible();
    await expect(q1Card.getByText("B", { exact: true })).toBeVisible();
    await expect(q1Card.getByText("C", { exact: true })).toBeVisible();
    await expect(q1Card.getByText("D", { exact: true })).toBeVisible();
    await expect(q1Card.getByText("Revenue village (or sub-divided village unit)")).toBeVisible();

    // 3. Correct Answer
    await expect(q1Card.getByText("Correct Answer")).toBeVisible();

    // 4. Explanation
    await expect(q1Card.getByText("Statistical Explanation & Domain Grounding:")).toBeVisible();
    await expect(q1Card.getByText("In the GCES methodology, the revenue village serves as the Primary Sampling Unit")).toBeVisible();

    // 5. Difficulty
    await expect(q1Card.getByText("Intermediate", { exact: true })).toBeVisible();

    // 6. Competency
    await expect(q1Card.getByText("Survey Methodology", { exact: true })).toBeVisible();

    // 7. Source Document
    await expect(q1Card.getByText("MoSPI_GCES_Field_Manual_2025-26.pdf").first()).toBeVisible();

    // 8. Source Page
    await expect(q1Card.getByText("Page 14, Section 3.2 (Sampling Framework)").first()).toBeVisible();

    // Expandable Cited Passage
    const viewPassageBtn = q1Card.getByRole("button", { name: "View Source Passage" });
    await expect(viewPassageBtn).toBeVisible();
    await viewPassageBtn.click();
    await expect(q1Card.getByText("Cited Official Manual Excerpt:")).toBeVisible();
    await expect(q1Card.getByText("The first-stage unit (PSU) shall invariably be the cadastral revenue village")).toBeVisible();
  });

  test("6. Interactive filtering and practice quiz CTA are functional", async ({ page }) => {
    // Select sample and trigger generation
    await page.getByRole("button", { name: /MoSPI General Crop Estimation Survey/i }).click();
    await page.getByRole("button", { name: "Proceed to AI Question Generation" }).click();

    const viewMcqBtn = page.getByRole("button", { name: "View Generated MCQs" });
    await viewMcqBtn.waitFor({ state: "visible", timeout: 15000 });
    await viewMcqBtn.click();

    await expect(page.getByRole("heading", { name: "Generated Diagnostic MCQs" })).toBeVisible({ timeout: 10000 });

    // Filter by Beginner
    await page.getByRole("button", { name: "Beginner" }).click();
    await expect(page.getByText("Showing 1 of 5 MCQs")).toBeVisible();
    await expect(page.getByTestId("generated-mcq-card-2")).toBeVisible();

    // Reset filter
    await page.getByRole("button", { name: "All Levels" }).click();
    await expect(page.getByText("Showing 5 of 5 MCQs")).toBeVisible();

    // Practice Quiz CTA
    const practiceBtn = page.getByRole("button", { name: "Start Practice Quiz" });
    await expect(practiceBtn).toBeVisible();
  });

  test("7. Bilingual Hindi version (/hi/learner/quiz-generator) renders localized text", async ({ page }) => {
    await page.goto("/hi/learner/quiz-generator");
    await expect(page.locator("h1")).toContainText("एआई प्रश्नोत्तरी जनरेटर", { timeout: 15000 });

    // Localized steps
    await expect(page.getByText("सामग्री अपलोड करें", { exact: true })).toBeVisible();
    await expect(page.getByText("फ़ाइल विवरण")).toBeVisible();
    await expect(page.getByText("आरएजी प्रसंस्करण")).toBeVisible();
    await expect(page.getByText("जनित प्रश्न (MCQs)")).toBeVisible();

    // Localized disclaimer
    await expect(page.getByText("पृथक्कृत बैकएंड एआई / आरएजी पाइपलाइन संरचना")).toBeVisible();
    await expect(page.getByText("वेब ब्राउज़र क्लाइंट स्थानीय रूप से एलएलएम निष्पादित नहीं करता है")).toBeVisible();
  });
});
