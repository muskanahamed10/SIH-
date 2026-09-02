import { Assessment } from "@/types";

export const mockAssessment: Assessment = {
  id: "asm-iss-2026-ad",
  title: "Target Role Assessment: Assistant Director / Data Analytics Lead",
  description: "Comprehensive diagnostic assessment evaluating core competencies required for ISS Group 'A' analytical leadership roles, including sampling frame design, Python/R automation, econometric modeling, and NDGF standards.",
  targetRoleId: "role-asst-dir",
  competencyIds: [
    "comp-stat-methods",
    "comp-survey-method",
    "comp-data-mgmt",
    "comp-stat-comp",
    "comp-data-vis",
    "comp-official-std",
    "comp-policy-comm"
  ],
  totalQuestions: 5,
  durationMinutes: 15,
  passingPercentage: 70,
  questions: [
    {
      id: "q-1",
      competencyId: "comp-survey-method",
      competencyName: "Survey Methodology & Sampling Design",
      difficulty: "intermediate",
      questionText: "In a multi-stage stratified sampling design conducted by NSSO, when allocating primary sampling units (PSUs) across heterogeneous strata, which method minimizes the variance of the overall estimator for a fixed sample size?",
      options: [
        { id: "opt-1a", text: "Proportional Allocation to strata population sizes" },
        { id: "opt-1b", text: "Neyman Optimal Allocation considering stratum standard deviation" },
        { id: "opt-1c", text: "Equal allocation across all administrative strata" },
        { id: "opt-1d", text: "Systematic circular sampling with unequal intervals" }
      ],
      correctOptionId: "opt-1b",
      explanation: "Neyman allocation allocates sample size to each stratum proportional to the product of the stratum size and the stratum standard deviation (N_h * S_h), which theoretically minimizes the variance of the sample mean for a fixed sample size.",
      sourceMaterial: "NSSO Master Sampling Design Manual, Chapter 4",
      aiConfidence: 0.96
    },
    {
      id: "q-2",
      competencyId: "comp-stat-comp",
      competencyName: "Statistical Computing & Programming",
      difficulty: "intermediate",
      questionText: "When cleaning a large administrative dataset of 5 million records in Python using pandas, which technique avoids the SettingWithCopyWarning and guarantees memory-efficient in-place modification?",
      options: [
        { id: "opt-2a", text: "df.ix[mask, 'column'] = new_val" },
        { id: "opt-2b", text: "df.loc[mask, 'column'] = new_val after explicit copy if slicing" },
        { id: "opt-2c", text: "df[column][mask] = new_val with chain indexing" },
        { id: "opt-2d", text: "Iterating through rows using df.iterrows() and assignment" }
      ],
      correctOptionId: "opt-2b",
      explanation: "Using .loc[row_indexer, col_indexer] provides unambiguous assignment to the underlying DataFrame. Chained indexing (df[col][mask]) creates a temporary slice that risks modifying a copy rather than the original data.",
      sourceMaterial: "Official Statistics Data Engineering Handbook (NSSTA)",
      aiConfidence: 0.94
    },
    {
      id: "q-3",
      competencyId: "comp-official-std",
      competencyName: "Official Statistics Standards & Indicators",
      difficulty: "advanced",
      questionText: "In the National Accounts Statistics (NAS) compiled under System of National Accounts (SNA 2008), what is the relationship between Gross Value Added (GVA) at basic prices and Gross Domestic Product (GDP) at market prices?",
      options: [
        { id: "opt-3a", text: "GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies" },
        { id: "opt-3b", text: "GDP at market prices = GVA at basic prices - Production Taxes + Production Subsidies" },
        { id: "opt-3c", text: "GDP at market prices = GVA at factor cost + Consumption of Fixed Capital" },
        { id: "opt-3d", text: "GDP at market prices = Net Value Added + Net Primary Income from Abroad" }
      ],
      correctOptionId: "opt-3a",
      explanation: "Under SNA 2008 / CSO base year 2011-12 series, GDP at market prices is derived by adding Net Product Taxes (Product Taxes minus Product Subsidies) to GVA at basic prices.",
      sourceMaterial: "National Accounts Statistics: Sources and Methods (CSO/MoSPI)",
      aiConfidence: 0.98
    },
    {
      id: "q-4",
      competencyId: "comp-stat-methods",
      competencyName: "Statistical Methods & Estimation",
      difficulty: "intermediate",
      questionText: "When testing for stationarity in an official monthly time series like the Index of Industrial Production (IIP) prior to ARIMA forecasting, which statistical test is standardly applied?",
      options: [
        { id: "opt-4a", text: "Durbin-Watson d-statistic" },
        { id: "opt-4b", text: "Augmented Dickey-Fuller (ADF) unit root test" },
        { id: "opt-4c", text: "Breusch-Pagan test for heteroscedasticity" },
        { id: "opt-4d", text: "Kolmogorov-Smirnov test for normality" }
      ],
      correctOptionId: "opt-4b",
      explanation: "The Augmented Dickey-Fuller (ADF) test tests the null hypothesis that a unit root is present in a time series sample, establishing whether differencing is required to achieve stationarity.",
      sourceMaterial: "Econometric Modeling Guidelines for Statistical Officers",
      aiConfidence: 0.95
    },
    {
      id: "q-5",
      competencyId: "comp-data-mgmt",
      competencyName: "Data Management & Microdata Curation",
      difficulty: "intermediate",
      questionText: "Under the National Data Governance Framework Policy (NDGFP) for official microdata dissemination, which technique ensures that an individual survey respondent cannot be re-identified by linking quasi-identifiers?",
      options: [
        { id: "opt-5a", text: "Removing only primary phone numbers and email addresses" },
        { id: "opt-5b", text: "Enforcing k-anonymity and l-diversity across sensitive demographic combinations" },
        { id: "opt-5c", text: "Encrypting the database with SHA-256 without microdata perturbation" },
        { id: "opt-5d", text: "Publishing all microdata unmasked under creative commons license" }
      ],
      correctOptionId: "opt-5b",
      explanation: "k-Anonymity guarantees that each release of data cannot be distinguished from at least k-1 other individuals with the same quasi-identifiers, while l-diversity ensures representation of diverse sensitive values within each equivalence group.",
      sourceMaterial: "National Data Governance & Anonymization Guidelines, MeitY / MoSPI",
      aiConfidence: 0.97
    }
  ]
};
