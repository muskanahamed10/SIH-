import { Competency } from "@/types";

export const mockCompetencies: Competency[] = [
  {
    id: "comp-stat-methods",
    code: "STAT-01",
    name: "Statistical Methods & Estimation",
    category: "statistical_methods",
    description: "Application of probability distributions, hypothesis testing, confidence intervals, and parametric/non-parametric econometric estimation techniques.",
    levels: [
      { level: 1, title: "Foundational", description: "Understands central tendency, dispersion, and basic probability concepts.", behavioralIndicators: ["Computes variance and standard deviation", "Interprets normal distribution"] },
      { level: 2, title: "Intermediate", description: "Performs hypothesis tests (t-test, ANOVA, chi-square) and linear regressions.", behavioralIndicators: ["Executes hypothesis testing", "Interprets p-values correctly"] },
      { level: 3, title: "Proficient", description: "Applies multivariate analysis, generalized linear models, and time-series decomposition.", behavioralIndicators: ["Detects collinearity and heteroscedasticity", "Decomposes seasonal indices"] },
      { level: 4, title: "Advanced", description: "Formulates complex econometric models, panel regression, and stochastic process models.", behavioralIndicators: ["Designs ARIMA and VAR forecasting models", "Validates dynamic structural equations"] },
      { level: 5, title: "Expert", description: "Guides national methodology reforms and acts as statistical authority on estimation standards.", behavioralIndicators: ["Authors national statistical technical guidelines", "Peer reviews research papers for international statistical agencies"] }
    ],
    updatedAt: "2026-08-15T10:00:00Z"
  },
  {
    id: "comp-survey-method",
    code: "STAT-02",
    name: "Survey Methodology & Sampling Design",
    category: "survey_methodology",
    description: "Designing sampling frames, multi-stage stratified designs, non-sampling error minimization, and field validation protocols for national surveys.",
    levels: [
      { level: 1, title: "Foundational", description: "Understands random sampling vs stratified sampling and survey questionnaire structure.", behavioralIndicators: ["Identifies sampling frame errors", "Assists in questionnaire pre-testing"] },
      { level: 2, title: "Intermediate", description: "Calculates sample sizes, allocation weights, and strata variance.", behavioralIndicators: ["Calculates Neyman allocation", "Designs simple stratified random samples"] },
      { level: 3, title: "Proficient", description: "Develops multi-stage cluster designs (NSSO model) and non-response adjustment methods.", behavioralIndicators: ["Computes post-stratification survey multipliers", "Calibrates sampling weights"] },
      { level: 4, title: "Advanced", description: "Conducts small area estimation (SAE) and synthetic estimation for district-level indicators.", behavioralIndicators: ["Formulates Fay-Herriot area-level models", "Minimizes MSE in small area estimations"] },
      { level: 5, title: "Expert", description: "Formulates master survey frame strategy for Government of India socio-economic surveys.", behavioralIndicators: ["Advises National Statistical Commission (NSC)", "Develops global-tier survey standards"] }
    ],
    updatedAt: "2026-08-20T12:00:00Z"
  },
  {
    id: "comp-data-mgmt",
    code: "STAT-03",
    name: "Data Management & Microdata Curation",
    category: "data_management",
    description: "Managing large-scale administrative datasets, microdata validation, anonymization, and National Data & Analytics Platform (NDAP) compliance.",
    levels: [
      { level: 1, title: "Foundational", description: "Performs basic data entry checks, spreadsheet data sanitation, and tabular summaries.", behavioralIndicators: ["Validates data types and nulls", "Exports standardized CSV files"] },
      { level: 2, title: "Intermediate", description: "Implements relational schema queries (SQL), data deduplication, and anomaly detection.", behavioralIndicators: ["Writes multi-table JOIN queries", "Flags outlier records programmatically"] },
      { level: 3, title: "Proficient", description: "Builds ETL pipelines, microdata dissemination standards (DDI/SDMX), and anonymization.", behavioralIndicators: ["Implements k-anonymity and l-diversity", "Converts raw datasets to SDMX format"] },
      { level: 4, title: "Advanced", description: "Architects enterprise data lakes, automated data quality assurance frameworks.", behavioralIndicators: ["Orchestrates data pipelines in Apache Airflow", "Maintains distributed database schemas"] },
      { level: 5, title: "Expert", description: "Establishes National Data Governance Framework policies for official statistics.", behavioralIndicators: ["Authors inter-ministerial data sharing protocols", "Audits national statistical repository integrity"] }
    ],
    updatedAt: "2026-08-22T09:00:00Z"
  },
  {
    id: "comp-stat-comp",
    code: "STAT-04",
    name: "Statistical Computing & Programming",
    category: "statistical_computing",
    description: "Leveraging Python, R, and modern computing tools for automated statistical pipelines, simulations, and algorithmic data auditing.",
    levels: [
      { level: 1, title: "Foundational", description: "Executes basic scripts in R or Python (pandas, tidyverse) for data loading and cleaning.", behavioralIndicators: ["Reads tabular files into dataframes", "Generates summary statistics scripts"] },
      { level: 2, title: "Intermediate", description: "Writes modular scripts, automated data cleaning functions, and basic statistical tests.", behavioralIndicators: ["Creates custom data transformation functions", "Automates repetitive tabular exports"] },
      { level: 3, title: "Proficient", description: "Develops reproducible workflows (Quarto/RMarkdown), package development, and Git version control.", behavioralIndicators: ["Maintains reproducible analytical scripts", "Uses Git for version-controlled statistical code"] },
      { level: 4, title: "Advanced", description: "Implements machine learning algorithms for imputation, classification, and parallel computing.", behavioralIndicators: ["Builds random forest imputation models", "Optimizes distributed computing jobs"] },
      { level: 5, title: "Expert", description: "Architects open-source statistical tooling ecosystem adopted across statistical directorates.", behavioralIndicators: ["Directs state-wide automated analytical pipelines", "Conducts national coding bootcamps for ISS officers"] }
    ],
    updatedAt: "2026-08-25T11:00:00Z"
  },
  {
    id: "comp-data-vis",
    code: "STAT-05",
    name: "Data Visualization & Thematic Mapping",
    category: "data_visualization",
    description: "Creating effective dashboards, spatial statistics (GIS choropleths), and publication-quality charts for cabinet notes and public reports.",
    levels: [
      { level: 1, title: "Foundational", description: "Produces standard line, bar, pie, and scatter plots using best visual communication practices.", behavioralIndicators: ["Chooses appropriate chart types for data", "Applies legible labeling and scales"] },
      { level: 2, title: "Intermediate", description: "Designs multi-variable plots, faceted visualizations, and basic thematic maps in QGIS.", behavioralIndicators: ["Builds faceted ggplot2/seaborn visualizations", "Maps district-level metrics in GIS"] },
      { level: 3, title: "Proficient", description: "Builds interactive analytical dashboards (Shiny, PowerBI) with user filtering capabilities.", behavioralIndicators: ["Deploys parameter-driven web dashboards", "Incorporates accessible color palettes"] },
      { level: 4, title: "Advanced", description: "Constructs spatial econometrics visualizations and real-time national indicator monitors.", behavioralIndicators: ["Integrates Moran's I spatial autocorrelation maps", "Renders high-frequency economic indicator pulses"] },
      { level: 5, title: "Expert", description: "Defines national visual communication standards for official economic releases.", behavioralIndicators: ["Curates national statistical atlas", "Sets guidelines for MoSPI public portal visualizations"] }
    ],
    updatedAt: "2026-08-26T14:00:00Z"
  },
  {
    id: "comp-official-std",
    code: "STAT-06",
    name: "Official Statistics Standards & Indicators",
    category: "official_standards",
    description: "Deep understanding of National Accounts Statistics (SNA 2008), CPI compilation, Index of Industrial Production (IIP), and UN SDG frameworks.",
    levels: [
      { level: 1, title: "Foundational", description: "Familiar with primary national indicators: GDP, CPI, IIP, and Periodic Labour Force Survey (PLFS).", behavioralIndicators: ["Defines headline economic indicators", "Cites official release calendar"] },
      { level: 2, title: "Intermediate", description: "Understands base year revisions, Laspeyres/Paasche index formulas, and classification systems (NIC/NCO).", behavioralIndicators: ["Computes price relative indices", "Classifies industrial activities by NIC code"] },
      { level: 3, title: "Proficient", description: "Calculates Gross Value Added (GVA) by economic activity, double deflation, and seasonal adjustments.", behavioralIndicators: ["Estimates sectoral GVA contributions", "Compiles chain-weighted index series"] },
      { level: 4, title: "Advanced", description: "Synthesizes supply-use tables (SUT), input-output tables, and SDG National Indicator Framework.", behavioralIndicators: ["Harmonizes institutional sector accounts", "Aligns state indicator frameworks with national SDGs"] },
      { level: 5, title: "Expert", description: "Represents India at UN Statistical Commission; leads national base-year revision committees.", behavioralIndicators: ["Formulates national accounting manual", "Spearheads international statistical harmonizations"] }
    ],
    updatedAt: "2026-08-28T16:00:00Z"
  },
  {
    id: "comp-policy-comm",
    code: "STAT-07",
    name: "Public Policy Communication & Synthesis",
    category: "public_policy_communication",
    description: "Translating complex statistical findings into actionable policy briefs, parliamentary answers, and media releases.",
    levels: [
      { level: 1, title: "Foundational", description: "Drafts factual summary paragraphs based on validated statistical tables.", behavioralIndicators: ["Drafts error-free executive bullet points", "Cites official caveats"] },
      { level: 2, title: "Intermediate", description: "Prepares parliamentary question responses (PQ replies) and ministerial briefing notes.", behavioralIndicators: ["Structures concise parliamentary replies", "Cross-references multi-year trends"] },
      { level: 3, title: "Proficient", description: "Authors statistical analytical reports highlighting policy implications and trends.", behavioralIndicators: ["Frames evidence-based policy trade-offs", "Translates confidence intervals for non-technical leadership"] },
      { level: 4, title: "Advanced", description: "Conducts high-stakes press briefings, crisis communication on data revisions, and cabinet notes.", behavioralIndicators: ["Handles complex methodological queries from media", "Drafts cabinet notes on economic indices"] },
      { level: 5, title: "Expert", description: "Serves as principal statistical spokesperson and strategic adviser to senior government leadership.", behavioralIndicators: ["Advises Cabinet Secretaries and NITI Aayog leadership", "Crafts national data narrative"] }
    ],
    updatedAt: "2026-08-30T10:00:00Z"
  }
];
