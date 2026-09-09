import { test, expect } from "@playwright/test";

test.describe("Prompt 8: Admin / SME MCQ Review Panel (Human-in-the-Loop Workflow)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/admin/mcq-review");
    await expect(page.locator("h1")).toContainText("AI-Generated MCQ Subject Matter Expert", {
      timeout: 15000,
    });
    // Reset demo queue to ensure pristine initial state
    const resetBtn = page.getByRole("button", { name: "Reset Demo Queue" });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }
  });

  test("1. Page loads with Responsible AI HITL banner, queue stats, and SME credentials", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Dr. K. S. Murthy • Senior Statistical Advisor (SME)")).toBeVisible();
    await expect(page.getByText("MoSPI / NSSTA Question Review Board")).toBeVisible();

    // Responsible AI HITL Governance Banner
    const hitlBanner = page.getByRole("region", {
      name: "Responsible AI Human-in-the-Loop Governance",
    });
    await expect(hitlBanner).toBeVisible();
    await expect(
      hitlBanner.getByText("Human-in-the-Loop (HITL) Responsible AI Governance")
    ).toBeVisible();
    await expect(
      hitlBanner.getByText("Zero Ungoverned AI Deployment")
    ).toBeVisible();
    await expect(
      hitlBanner.getByText("100% SME Review Required")
    ).toBeVisible();

    // Stats Row
    await expect(page.getByText("Total in Queue")).toBeVisible();
    await expect(page.getByText("Pending Review").first()).toBeVisible();
    await expect(page.getByText("Approved").first()).toBeVisible();
    await expect(page.getByText("Rejected").first()).toBeVisible();
    await expect(page.getByText("HITL Rate")).toBeVisible();
  });

  test("2. MCQ card displays all 9 required items (Question, Options, AI Suggested Answer, Explanation, Source Doc, Source Page, Competency, Difficulty, Status)", async ({ page }) => {
    const card1 = page.getByTestId("mcq-review-card-mcq-rev-01");
    await expect(card1).toBeVisible();

    // 1. Question Text
    await expect(
      card1.getByText("Under the General Crop Estimation Survey (GCES) framework for agricultural yield estimation")
    ).toBeVisible();

    // 2. Options (A, B, C, D)
    await expect(card1.getByText("A", { exact: true })).toBeVisible();
    await expect(card1.getByText("B", { exact: true })).toBeVisible();
    await expect(card1.getByText("C", { exact: true })).toBeVisible();
    await expect(card1.getByText("D", { exact: true })).toBeVisible();
    await expect(card1.getByText("A circular or rectangular experimental crop-cutting plot")).toBeVisible();

    // 3. AI Suggested Answer
    await expect(card1.getByText("AI Suggested Answer (Option B)")).toBeVisible();

    // 4. Explanation
    await expect(card1.getByText("Official Methodology Explanation:")).toBeVisible();
    await expect(
      card1.getByText("In GCES, the primary sampling units are villages, the secondary sampling units are fields")
    ).toBeVisible();

    // 5. Source Document
    await expect(card1.getByText("MoSPI_GCES_Field_Manual_2025-26.pdf")).toBeVisible();

    // 6. Source Page
    await expect(card1.getByText("Page 14, Section 3.2 (Sampling Framework)")).toBeVisible();

    // 7. Competency
    await expect(card1.getByText("Survey Methodology & Sampling Design").first()).toBeVisible();

    // 8. Difficulty
    await expect(card1.getByText("Intermediate").first()).toBeVisible();

    // 9. Status (Initially Pending Review)
    await expect(card1.getByText("Pending Review", { exact: true })).toBeVisible();

    // Actions available
    await expect(card1.getByRole("button", { name: "Approve" })).toBeVisible();
    await expect(card1.getByRole("button", { name: "Edit" })).toBeVisible();
    await expect(card1.getByRole("button", { name: "Reject" })).toBeVisible();
  });

  test("3. Clicking Approve updates the item demo state to Approved with SME signoff", async ({ page }) => {
    const card1 = page.getByTestId("mcq-review-card-mcq-rev-01");
    await expect(card1).toBeVisible();

    // Verify initial pending state
    await expect(card1.getByText("Pending Review", { exact: true })).toBeVisible();

    // Click Approve
    const approveBtn = card1.getByRole("button", { name: "Approve" });
    await approveBtn.click();

    // Verify state transitioned to Approved
    await expect(card1.getByText("Approved", { exact: true })).toBeVisible();
    await expect(card1.getByText("Approved ✓")).toBeVisible();
    await expect(card1.getByText("Approved by: Dr. K. S. Murthy (MoSPI / NSSTA Lead SME)")).toBeVisible();
  });

  test("4. Clicking Reject updates the item demo state to Rejected with audit note", async ({ page }) => {
    const card2 = page.getByTestId("mcq-review-card-mcq-rev-02");
    await expect(card2).toBeVisible();

    // Verify initial pending state
    await expect(card2.getByText("Pending Review", { exact: true })).toBeVisible();

    // Click Reject
    const rejectBtn = card2.getByRole("button", { name: "Reject" });
    await rejectBtn.click();

    // Verify state transitioned to Rejected
    await expect(card2.getByText("Rejected", { exact: true }).first()).toBeVisible();
    await expect(card2.getByText("Rejected by SME: Dr. K. S. Murthy")).toBeVisible();
  });

  test("5. Clicking Edit opens the dialog, modifies fields, and saves updates to the card", async ({ page }) => {
    const card3 = page.getByTestId("mcq-review-card-mcq-rev-03");
    await expect(card3).toBeVisible();

    // Click Edit to open modal
    const editBtn = card3.getByRole("button", { name: "Edit" });
    await editBtn.click();

    // Verify Dialog is open
    const dialog = page.getByRole("dialog", { name: "Edit Assessment Question (SME Review)" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("SME Rubric & Content Grounding Editor")).toBeVisible();

    // Modify Question Text
    const questionInput = dialog.locator("textarea").first();
    await questionInput.fill(
      "In the Periodic Labour Force Survey (PLFS), how is the rotational panel scheme structured for urban First Stage Units (FSUs)? [Verified by NSO SME]"
    );

    // Save Changes
    const saveBtn = dialog.getByRole("button", { name: "Save Changes" });
    await saveBtn.click();

    // Modal closes
    await expect(dialog).not.toBeVisible();

    // Verify Card 3 now displays the modified text
    await expect(
      card3.getByText("[Verified by NSO SME]")
    ).toBeVisible();
  });

  test("6. Status filter tabs accurately filter cards by status", async ({ page }) => {
    // Approve card 1 and Reject card 2
    const card1 = page.getByTestId("mcq-review-card-mcq-rev-01");
    await card1.getByRole("button", { name: "Approve" }).click();
    await expect(card1.getByText("Approved", { exact: true })).toBeVisible();

    const card2 = page.getByTestId("mcq-review-card-mcq-rev-02");
    await card2.getByRole("button", { name: "Reject" }).click();
    await expect(card2.getByText("Rejected", { exact: true }).first()).toBeVisible();

    // Filter by Pending Review
    await page.getByRole("button", { name: /Pending Review/ }).first().click();
    await expect(card1).not.toBeVisible();
    await expect(card2).not.toBeVisible();
    await expect(page.getByTestId("mcq-review-card-mcq-rev-03")).toBeVisible();

    // Filter by Approved
    await page.getByRole("button", { name: /Approved/ }).first().click();
    await expect(card1).toBeVisible();
    await expect(card2).not.toBeVisible();

    // Filter by Rejected
    await page.getByRole("button", { name: /Rejected/ }).first().click();
    await expect(card1).not.toBeVisible();
    await expect(card2).toBeVisible();

    // Filter All
    await page.getByRole("button", { name: /All Items/ }).click();
    await expect(card1).toBeVisible();
    await expect(card2).toBeVisible();
    await expect(page.getByTestId("mcq-review-card-mcq-rev-03")).toBeVisible();
  });

  test("7. Bilingual Hindi version (/hi/admin/mcq-review) renders localized text", async ({ page }) => {
    await page.goto("/hi/admin/mcq-review");
    await expect(page.locator("h1")).toContainText("एआई-जनित बहुविकल्पीय प्रश्न विषय विशेषज्ञ", {
      timeout: 15000,
    });

    // Localized Responsible AI Banner
    await expect(
      page.getByText("मानव-नियंत्रित (Human-in-the-Loop) उत्तरदायी एआई शासन")
    ).toBeVisible();

    // Localized action buttons on Card 1
    const card1 = page.getByTestId("mcq-review-card-mcq-rev-01");
    await expect(card1).toBeVisible();
    await expect(card1.getByRole("button", { name: "अनुमोदन करें (Approve)" })).toBeVisible();
    await expect(card1.getByRole("button", { name: "संपादित करें (Edit)" })).toBeVisible();
    await expect(card1.getByRole("button", { name: "अस्वीकार करें (Reject)" })).toBeVisible();
  });
});
