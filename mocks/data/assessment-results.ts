import { AssessmentDetailedResult } from "@/types";

export const mockAssessmentResult: AssessmentDetailedResult = {
  id: "eval-baseline-cadre-2026",
  assessmentId: "baseline-cadre-2026",
  title: "Baseline Competency Assessment",
  role: "Statistical Officer",
  cadre: "Subordinate Statistical Service (SSS)",
  department: "Official Statistics Division",
  status: "Completed",
  completedDate: "March 2026 (Demo Diagnostic)",
  overallScore: 68,
  totalQuestions: 10,
  correctAnswers: 7,
  incorrectAnswers: 3,
  durationMinutes: 10,
  competencyPerformance: [
    {
      competencyId: "comp-stat-model",
      competencyName: "Statistical Modeling",
      requiredScore: 80,
      demonstratedScore: 42,
      gap: 38,
      status: "Critical Gap",
      priority: "Critical",
    },
    {
      competencyId: "comp-stat-comp",
      competencyName: "Statistical Computing (Python)",
      requiredScore: 75,
      demonstratedScore: 38,
      gap: 37,
      status: "Critical Gap",
      priority: "Critical",
    },
    {
      competencyId: "comp-data-vis",
      competencyName: "Data Visualization",
      requiredScore: 70,
      demonstratedScore: 55,
      gap: 15,
      status: "Priority Gap",
      priority: "Moderate",
    },
    {
      competencyId: "comp-data-quality",
      competencyName: "Data Quality & Validation",
      requiredScore: 80,
      demonstratedScore: 68,
      gap: 12,
      status: "Developing",
      priority: "Moderate",
    },
    {
      competencyId: "comp-data-analysis",
      competencyName: "Data Analysis & Statistics",
      requiredScore: 85,
      demonstratedScore: 82,
      gap: 3,
      status: "Meets Benchmark",
      priority: "Low",
    },
    {
      competencyId: "comp-survey-method",
      competencyName: "Survey Methodology",
      requiredScore: 70,
      demonstratedScore: 72,
      gap: 0,
      status: "Achieved",
      priority: "Low",
    },
  ],
  radarData: [
    {
      competency: "Statistical Modeling",
      required: 80,
      demonstrated: 42,
      gap: 38,
      fullMark: 100,
    },
    {
      competency: "Statistical Computing (Python)",
      required: 75,
      demonstrated: 38,
      gap: 37,
      fullMark: 100,
    },
    {
      competency: "Data Visualization",
      required: 70,
      demonstrated: 55,
      gap: 15,
      fullMark: 100,
    },
    {
      competency: "Data Quality & Validation",
      required: 80,
      demonstrated: 68,
      gap: 12,
      fullMark: 100,
    },
    {
      competency: "Data Analysis & Statistics",
      required: 85,
      demonstrated: 82,
      gap: 3,
      fullMark: 100,
    },
    {
      competency: "Survey Methodology",
      required: 70,
      demonstrated: 72,
      gap: 0,
      fullMark: 100,
    },
  ],
  topPriorityGaps: [
    {
      competencyId: "comp-stat-model",
      competencyName: "Statistical Modeling",
      requiredScore: 80,
      demonstratedScore: 42,
      gap: 38,
      priority: "Critical",
      aiInsight: "Strengthening statistical modeling (OLS regression & time series) will have the highest immediate impact on your role readiness.",
    },
    {
      competencyId: "comp-stat-comp",
      competencyName: "Statistical Computing (Python)",
      requiredScore: 75,
      demonstratedScore: 38,
      gap: 37,
      priority: "Critical",
      aiInsight: "Vectorized pandas manipulation and database querying are critical for processing large-scale NSSO microdata.",
    },
    {
      competencyId: "comp-data-vis",
      competencyName: "Data Visualization",
      requiredScore: 70,
      demonstratedScore: 55,
      gap: 15,
      priority: "Moderate",
      aiInsight: "Official data dissemination mandates interactive choropleth thematic mapping and accessible charts.",
    },
  ],
  aiInsight: {
    strongestOpportunity: "Statistical Modeling",
    demonstratedScore: 42,
    requiredScore: 80,
    summary:
      "Your largest demonstrated gap is in Statistical Modeling (38% gap) followed closely by Statistical Computing / Python (37% gap). Closing these deficits is essential for Official Statistical Officer mandates.",
    recommendationText:
      "We recommend starting your personalized learning path with 'Econometric Modeling for Official Statistics' and 'Python for Microdata' on iGOT Karmayogi.",
  },
  questionsReview: [
    {
      id: "q-1",
      questionNumber: 1,
      competencyName: "Statistical Modeling",
      difficulty: "Intermediate",
      result: "Correct",
      questionText:
        "When fitting an Ordinary Least Squares (OLS) linear regression on macroeconomic indicators, if the variance of error terms is not constant across observations (heteroscedasticity), what is the primary statistical consequence?",
      selectedOptionText:
        "The OLS estimators remain unbiased, but standard errors are biased, invalidating hypothesis tests",
      correctOptionText:
        "The OLS estimators remain unbiased, but standard errors are biased, invalidating hypothesis tests",
      explanation:
        "Under heteroscedasticity, OLS estimators retain unbias and consistency, but conventional standard errors are biased.",
      isFlagged: false,
    },
    {
      id: "q-2",
      questionNumber: 2,
      competencyName: "Statistical Modeling",
      difficulty: "Intermediate",
      result: "Incorrect",
      questionText:
        "In time-series modeling using ARIMA(p, d, q) for monthly Consumer Price Index (CPI) projections, what does the differencing parameter 'd' primarily accomplish?",
      selectedOptionText:
        "Removes autoregressive lags from seasonal quarterly shocks",
      correctOptionText:
        "Transforms a non-stationary time series with a stochastic trend into a stationary series",
      explanation:
        "The integration parameter 'd' indicates the degree of differencing required to achieve stationarity.",
      isFlagged: true,
    },
    {
      id: "q-3",
      questionNumber: 3,
      competencyName: "Data Analysis",
      difficulty: "Intermediate",
      result: "Correct",
      questionText:
        "When estimating total household consumer expenditure from an NSSO survey with a large sample size (n > 5,000), which theorem justifies constructing symmetric normal confidence intervals for the mean even when individual household expenditures are right-skewed?",
      selectedOptionText: "Central Limit Theorem (CLT)",
      correctOptionText: "Central Limit Theorem (CLT)",
      explanation:
        "The CLT guarantees that sample mean distribution tends toward normal as n increases.",
      isFlagged: false,
    },
    {
      id: "q-4",
      questionNumber: 4,
      competencyName: "Data Analysis",
      difficulty: "Hard",
      result: "Correct",
      questionText:
        "An official statistical audit tests the null hypothesis (H₀) that regional agricultural crop yields follow historical benchmarks. If the P-value is 0.032 and the pre-specified significance level (α) is 0.05, what is the correct statistical deduction?",
      selectedOptionText:
        "Reject H₀; there is statistically significant evidence at the 5% level that yields differ from the benchmark",
      correctOptionText:
        "Reject H₀; there is statistically significant evidence at the 5% level that yields differ from the benchmark",
      explanation:
        "Because P-value (0.032) < α (0.05), we reject the null hypothesis at the 5% significance level.",
      isFlagged: false,
    },
    {
      id: "q-5",
      questionNumber: 5,
      competencyName: "Data Visualization",
      difficulty: "Intermediate",
      result: "Incorrect",
      questionText:
        "When publishing thematic choropleth maps of district-level multidimensional poverty rates in an official dashboard, why is a quantile classification scheme often preferred over equal-interval classification for skewed distributions?",
      selectedOptionText:
        "Equal intervals guarantee that zero districts appear in outlier categories",
      correctOptionText:
        "Quantile classification assigns an equal number of geographic districts to each color bin, highlighting relative standing",
      explanation:
        "Quantile binning places an equal number of observations in each class, preventing empty bins in skewed data.",
      isFlagged: false,
    },
    {
      id: "q-6",
      questionNumber: 6,
      competencyName: "Statistical Computing",
      difficulty: "Intermediate",
      result: "Correct",
      questionText:
        "When transforming microdata with 10 million survey records in Python pandas, which practice achieves maximum computational efficiency and memory optimization?",
      selectedOptionText:
        "Applying vectorized NumPy/pandas array operations and downcasting numeric datatypes",
      correctOptionText:
        "Applying vectorized NumPy/pandas array operations and downcasting numeric datatypes",
      explanation:
        "Vectorized operations take advantage of SIMD C-level loops without Python per-row overhead.",
      isFlagged: false,
    },
    {
      id: "q-7",
      questionNumber: 7,
      competencyName: "Statistical Computing",
      difficulty: "Intermediate",
      result: "Incorrect",
      questionText:
        "In SQL, when merging an official establishment register with annual survey returns where you must retain ALL registered establishments regardless of whether survey returns have been submitted, which JOIN type is mandatory?",
      selectedOptionText: "INNER JOIN",
      correctOptionText: "LEFT OUTER JOIN (with register as left table)",
      explanation:
        "A LEFT OUTER JOIN preserves all rows from the left table even if no matching right record exists.",
      isFlagged: true,
    },
    {
      id: "q-8",
      questionNumber: 8,
      competencyName: "Survey Methodology",
      difficulty: "Hard",
      result: "Correct",
      questionText:
        "In a stratified random sampling design with known stratum standard deviations (S_h) and stratum population counts (N_h), which allocation formula minimizes the sampling variance of the overall population estimate for a fixed sample size (n)?",
      selectedOptionText:
        "Neyman Optimal Allocation: n_h = n * (N_h * S_h) / sum(N_i * S_i)",
      correctOptionText:
        "Neyman Optimal Allocation: n_h = n * (N_h * S_h) / sum(N_i * S_i)",
      explanation:
        "Neyman allocation minimizes the variance of the stratified estimator for a fixed total sample size.",
      isFlagged: false,
    },
    {
      id: "q-9",
      questionNumber: 9,
      competencyName: "Data Quality",
      difficulty: "Intermediate",
      result: "Correct",
      questionText:
        "In household expenditure surveys, when addressing item non-response for a specific consumption category, why is Hot-Deck Imputation generally superior to Mean Imputation?",
      selectedOptionText:
        "Mean imputation artificially deflates sample variance and distorts bivariate correlations, whereas hot-deck donor matching preserves natural variance",
      correctOptionText:
        "Mean imputation artificially deflates sample variance and distorts bivariate correlations, whereas hot-deck donor matching preserves natural variance",
      explanation:
        "Hot-deck donor matching replaces missing values with observed values from similar respondents, preserving distributional variance.",
      isFlagged: false,
    },
    {
      id: "q-10",
      questionNumber: 10,
      competencyName: "Data Quality",
      difficulty: "Hard",
      result: "Correct",
      questionText:
        "Under the National Data Governance Framework Policy (NDGFP) for official microdata dissemination, which technique ensures that no individual can be re-identified by joining quasi-identifiers with voter registries?",
      selectedOptionText:
        "Enforcing k-anonymity (each quasi-identifier combination matches at least k individuals) and l-diversity for sensitive attributes",
      correctOptionText:
        "Enforcing k-anonymity (each quasi-identifier combination matches at least k individuals) and l-diversity for sensitive attributes",
      explanation:
        "k-anonymity ensures each equivalence class contains at least k records, preventing quasi-identifier linkage attacks.",
      isFlagged: false,
    },
  ],
  progressData: [
    { stage: "Baseline", score: 42, label: "Demonstrated (42%)", status: "completed" },
    { stage: "Target", score: 80, label: "Role Target (80%)", status: "completed" },
    { stage: "Practice", score: 55, label: "Projected Practice (55%)", status: "sample" },
    { stage: "Post-test", score: 68, label: "Projected Post-Test (68%)", status: "sample" },
  ],
};
