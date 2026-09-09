import { SampleLearningMaterial, GeneratedMCQ } from "@/types";

export const mockSampleMaterials: SampleLearningMaterial[] = [
  {
    id: "doc-gces-2025",
    title: "MoSPI General Crop Estimation Survey (GCES) Field Manual 2025-26",
    fileName: "MoSPI_GCES_Field_Manual_2025-26.pdf",
    fileSizeBytes: 4404019, // 4.2 MB
    fileSizeFormatted: "4.2 MB",
    pageCount: 48,
    category: "Agricultural Statistics & Field Operations",
    description:
      "Comprehensive field inspection protocols, multi-stage stratified random sampling, cut-plot harvesting procedures, and biometric recording guidelines issued by the National Statistical Office (NSO).",
    competencies: [
      "Survey Methodology",
      "Sampling Theory & Design",
      "Official Statistics Standards",
    ],
  },
  {
    id: "doc-plfs-2025",
    title: "Periodic Labour Force Survey (PLFS) Sampling Design & Field Guidelines",
    fileName: "PLFS_Sampling_Design_Guidelines_2025.pdf",
    fileSizeBytes: 3984588, // 3.8 MB
    fileSizeFormatted: "3.8 MB",
    pageCount: 64,
    category: "Socio-Economic Surveys & Labour Cadre",
    description:
      "Operational handbook covering urban frame survey (UFS) blocks, rural census enumeration blocks (FSU), rotational panel sampling design, and activity status classification under weekly and usual principal status.",
    competencies: [
      "Survey Methodology",
      "Data Quality & Validation",
      "Statistical Modeling",
    ],
  },
  {
    id: "doc-nas-2025",
    title: "National Accounts Statistics (NAS) Methodology & Base Revision Primer",
    fileName: "National_Accounts_Methodology_Base_Revision_2025.pdf",
    fileSizeBytes: 5347737, // 5.1 MB
    fileSizeFormatted: "5.1 MB",
    pageCount: 82,
    category: "Macroeconomic & National Accounting",
    description:
      "Reference document describing gross value added (GVA) estimation, double deflation methods, supply-use tables (SUT), corporate sector financial statements (MCA-21 database integration), and informal economy extrapolation.",
    competencies: [
      "Official Statistics Standards",
      "Data Analysis & Statistics",
      "Statistical Computing",
    ],
  },
];

export const mockGeneratedQuestions: Record<string, GeneratedMCQ[]> = {
  "doc-gces-2025": [
    {
      id: "mcq-gces-001",
      questionNumber: 1,
      question:
        "Under the standard Multi-Stage Stratified Sampling design prescribed in the MoSPI GCES Manual, what constitutes the Primary Sampling Unit (PSU) at the rural level?",
      options: [
        { id: "opt-1", label: "A", text: "Individual agricultural holding or operational parcel" },
        { id: "opt-2", label: "B", text: "Revenue village (or sub-divided village unit)" },
        { id: "opt-3", label: "C", text: "Community Development Block (CDB)" },
        { id: "opt-4", label: "D", text: "Standard 5m × 5m experimental cut-plot quadrant" },
      ],
      correctOptionId: "opt-2",
      correctOptionLabel: "B",
      explanation:
        "In the GCES methodology, the revenue village serves as the Primary Sampling Unit (PSU / First Stage Unit). Within each selected village, fields growing the specified crop form the second stage units, and the standard experimental plot constitutes the Ultimate Sampling Unit (USU).",
      difficulty: "Intermediate",
      competency: "Survey Methodology",
      competencyId: "comp-survey-meth",
      sourceDocument: "MoSPI_GCES_Field_Manual_2025-26.pdf",
      sourcePage: "Page 14, Section 3.2 (Sampling Framework)",
      sourceSnippet:
        "Section 3.2.1: The first-stage unit (PSU) shall invariably be the cadastral revenue village listed in the 2011 Census frame. A minimum of 5 sample villages per stratum shall be selected using simple random sampling without replacement (SRSWOR).",
      aiConfidence: 0.96,
    },
    {
      id: "mcq-gces-002",
      questionNumber: 2,
      question:
        "When conducting crop-cutting experiments for paddy under GCES, what standard plot shape and dimension are mandatorily prescribed by MoSPI field protocols?",
      options: [
        { id: "opt-1", label: "A", text: "Circular plot with a radius of 3.5 meters" },
        { id: "opt-2", label: "B", text: "Equilateral triangle with 10-meter sides" },
        { id: "opt-3", label: "C", text: "Right-angled isosceles triangle with 5m × 5m legs (or 5m × 5m square)" },
        { id: "opt-4", label: "D", text: "Linear strip transect measuring 1m × 25m" },
      ],
      correctOptionId: "opt-3",
      correctOptionLabel: "C",
      explanation:
        "According to MoSPI/NSO crop-cutting standards for food grains including paddy and wheat, the experimental plot size is standardized as a 5m × 5m square (25 sq meters) or an equilateral/isosceles triangle of designated sub-area to minimize border edge bias and ensure uniform statistical weight.",
      difficulty: "Beginner",
      competency: "Official Statistics Standards",
      competencyId: "comp-stat-standards",
      sourceDocument: "MoSPI_GCES_Field_Manual_2025-26.pdf",
      sourcePage: "Page 22, Section 4.5 (Experimental Plot Layout)",
      sourceSnippet:
        "Section 4.5.3: For paddy and wheat, demarcate a 5m × 5m square plot in the South-West corner of the selected Khasra field using pegs, measuring tape, and string before initiating the harvest cut.",
      aiConfidence: 0.94,
    },
    {
      id: "mcq-gces-003",
      questionNumber: 3,
      question:
        "In biometric moisture loss adjustment for harvested grain yield under GCES, how is the driage ratio calculated and applied to green weight?",
      options: [
        { id: "opt-1", label: "A", text: "Driage factor = (Dry Weight / Green Weight), multiplied by total green yield" },
        { id: "opt-2", label: "B", text: "Fixed deduction of 12% moisture across all agro-climatic zones" },
        { id: "opt-3", label: "C", text: "Driage factor = (Green Weight - Dry Weight) / Field temperature (°C)" },
        { id: "opt-4", label: "D", text: "Driage is not measured; field estimates use unadjusted green weight" },
      ],
      correctOptionId: "opt-1",
      correctOptionLabel: "A",
      explanation:
        "The standard driage experiment requires drying a known sample of freshly harvested green grain (e.g. 1 kg) for 15-20 days until constant weight is reached. The ratio of dry weight to green weight is the driage factor, which is applied to the aggregate green harvest to compute standardized yield at standard storage moisture content.",
      difficulty: "Advanced",
      competency: "Data Quality & Validation",
      competencyId: "comp-data-quality",
      sourceDocument: "MoSPI_GCES_Field_Manual_2025-26.pdf",
      sourcePage: "Page 31, Section 6.1 (Moisture & Driage Protocol)",
      sourceSnippet:
        "Section 6.1.4: Let Wg be green weight and Wd be weight after sun-drying to equilibrium moisture (approx 12%). The driage coefficient Kd = Wd / Wg shall be submitted in Form-IV.",
      aiConfidence: 0.92,
    },
    {
      id: "mcq-gces-004",
      questionNumber: 4,
      question:
        "What is the primary purpose of Super-Check inspections mandated for Senior Statistical Officers (SSOs) during the harvest window?",
      options: [
        { id: "opt-1", label: "A", text: "To replace state revenue officials with central enumerators" },
        { id: "opt-2", label: "B", text: "To independently validate field demarcation, green weighment, and reduce non-sampling errors" },
        { id: "opt-3", label: "C", text: "To negotiate minimum support price directly with agricultural cultivators" },
        { id: "opt-4", label: "D", text: "To verify land ownership title deeds in the District Collectorate" },
      ],
      correctOptionId: "opt-2",
      correctOptionLabel: "B",
      explanation:
        "Super-checks under the Improvement of Crop Statistics (ICS) scheme ensure quality control by verifying that primary state enumerators correctly follow random coordinate generation, field identification, cut-plot demarcation, and weighing procedures, thereby curtailing non-sampling variance.",
      difficulty: "Intermediate",
      competency: "Survey Methodology",
      competencyId: "comp-survey-meth",
      sourceDocument: "MoSPI_GCES_Field_Manual_2025-26.pdf",
      sourcePage: "Page 39, Section 8.2 (Quality Control & Supervision)",
      sourceSnippet:
        "Section 8.2.2: SSOs of FOD shall supervise at least 15% of selected plots during actual harvesting to ensure zero deviation from random number selection charts.",
      aiConfidence: 0.95,
    },
    {
      id: "mcq-gces-005",
      questionNumber: 5,
      question:
        "When a selected survey village has undergone severe urbanization and contains zero cultivated area during the reference agricultural year, what is the protocol-compliant action?",
      options: [
        { id: "opt-1", label: "A", text: "Arbitrarily choose a neighbouring agricultural village without notification" },
        { id: "opt-2", label: "B", text: "Record zero yield and treat the sample as a valid zero-cultivation observation in the stratum" },
        { id: "opt-3", label: "C", text: "Delete the village from the sample frame and reduce total stratum sample size" },
        { id: "opt-4", label: "D", text: "Re-stratify the entire district and conduct a fresh baseline census" },
      ],
      correctOptionId: "opt-2",
      correctOptionLabel: "B",
      explanation:
        "In probability proportional to size or stratified random sampling, replacing an uninhabited or zero-cultivation selected PSU introduces positive bias. The village must be recorded as zero-crop area so that the aggregate stratum acreage and production estimates remain unbiased.",
      difficulty: "Advanced",
      competency: "Sampling Theory & Design",
      competencyId: "comp-sampling-theory",
      sourceDocument: "MoSPI_GCES_Field_Manual_2025-26.pdf",
      sourcePage: "Page 44, Appendix B (Zero-Yield Village Treatment)",
      sourceSnippet:
        "Appendix B.3: If a selected village has zero cropped area under the survey crop, it must not be substituted. It shall be accounted with zero acreage in stratum estimation.",
      aiConfidence: 0.91,
    },
  ],
  "doc-plfs-2025": [
    {
      id: "mcq-plfs-001",
      questionNumber: 1,
      question:
        "In the Periodic Labour Force Survey (PLFS), how is the rotational panel scheme structured for urban First Stage Units (FSUs)?",
      options: [
        { id: "opt-1", label: "A", text: "2-2-2 panel where each household is visited for 2 consecutive years" },
        { id: "opt-2", label: "B", text: "Rotational panel where each selected urban household is visited 4 times (once every quarter)" },
        { id: "opt-3", label: "C", text: "Cross-sectional single visit with no re-interviews" },
        { id: "opt-4", label: "D", text: "Continuous monthly panel visited for 12 consecutive months" },
      ],
      correctOptionId: "opt-2",
      correctOptionLabel: "B",
      explanation:
        "For urban areas, PLFS adopts a rotational panel sampling design where each selected household is visited four times in total (one visit in each subsequent quarter over one year) with a 25% rotation of FSUs each quarter.",
      difficulty: "Intermediate",
      competency: "Survey Methodology",
      competencyId: "comp-survey-meth",
      sourceDocument: "PLFS_Sampling_Design_Guidelines_2025.pdf",
      sourcePage: "Page 18, Section 2.4 (Urban Rotational Panel Design)",
      sourceSnippet:
        "Section 2.4.1: Each selected UFS block in urban areas remains in the panel for 4 quarters. In each quarter, 25% of FSUs are replaced by new FSUs from the same sub-stratum.",
      aiConfidence: 0.95,
    },
    {
      id: "mcq-plfs-002",
      questionNumber: 2,
      question:
        "Under PLFS definitions, what criterion distinguishes an individual classified as Employed under the Current Weekly Status (CWS) approach?",
      options: [
        { id: "opt-1", label: "A", text: "Worked for at least 40 hours during the 7 days preceding the survey date" },
        { id: "opt-2", label: "B", text: "Worked for at least 1 hour on any day during the 7 days preceding the survey date" },
        { id: "opt-3", label: "C", text: "Received wages exceeding statutory minimum wage for at least 3 days" },
        { id: "opt-4", label: "D", text: "Engaged in economic activity for the major part of the preceding 365 days" },
      ],
      correctOptionId: "opt-2",
      correctOptionLabel: "B",
      explanation:
        "Under the Current Weekly Status (CWS) criterion aligned with ILO recommendations, a person is classified as employed if they pursued any economic activity for at least 1 hour on at least one day during the 7 reference days.",
      difficulty: "Beginner",
      competency: "Official Statistics Standards",
      competencyId: "comp-stat-standards",
      sourceDocument: "PLFS_Sampling_Design_Guidelines_2025.pdf",
      sourcePage: "Page 27, Section 3.8 (Current Weekly Status Criteria)",
      sourceSnippet:
        "Section 3.8.2: A person is considered working (or employed) if he/she engaged in any economic activity for at least 1 hour on any day of the reference week.",
      aiConfidence: 0.97,
    },
    {
      id: "mcq-plfs-003",
      questionNumber: 3,
      question:
        "What stratification mechanism is employed in PLFS rural areas to segregate large Census Enumeration Blocks into Hamlet Groups (hgs)?",
      options: [
        { id: "opt-1", label: "A", text: "Distance of households from the nearest National Highway" },
        { id: "opt-2", label: "B", text: "Approximate population thresholds exceeding 1,200 (or ~300 households)" },
        { id: "opt-3", label: "C", text: "Total agricultural land acreage owned by the Gram Panchayat" },
        { id: "opt-4", label: "D", text: "Average household monthly per-capita expenditure" },
      ],
      correctOptionId: "opt-2",
      correctOptionLabel: "B",
      explanation:
        "When an FSU has a large population (typically >1,200 persons or >300 households in rural areas), it is divided into two or more hamlet groups of roughly equal population size, and two hamlet groups are selected for listing.",
      difficulty: "Advanced",
      competency: "Sampling Theory & Design",
      competencyId: "comp-sampling-theory",
      sourceDocument: "PLFS_Sampling_Design_Guidelines_2025.pdf",
      sourcePage: "Page 35, Section 4.2 (Sub-Division & Hamlet-Group Formation)",
      sourceSnippet:
        "Section 4.2.1: If present population of sample village is 1,200 or more, it shall be divided into equal-sized hamlet-groups.",
      aiConfidence: 0.93,
    },
  ],
  "doc-nas-2025": [
    {
      id: "mcq-nas-001",
      questionNumber: 1,
      question:
        "In the compilation of Gross Value Added (GVA) at basic prices according to the System of National Accounts (SNA 2008), what is the correct relation to GDP at market prices?",
      options: [
        { id: "opt-1", label: "A", text: "GDP at Market Prices = GVA at Basic Prices + Net Product Taxes (Taxes - Subsidies)" },
        { id: "opt-2", label: "B", text: "GDP at Market Prices = GVA at Basic Prices - Consumption of Fixed Capital" },
        { id: "opt-3", label: "C", text: "GDP at Market Prices = GVA at Factor Cost + Gross Capital Formation" },
        { id: "opt-4", label: "D", text: "GVA at Basic Prices = GDP at Market Prices + Import Duties" },
      ],
      correctOptionId: "opt-1",
      correctOptionLabel: "A",
      explanation:
        "Under the revised National Accounts framework (base 2011-12 onwards aligned with SNA 2008), headline GDP at market prices equals GVA at basic prices plus net product taxes (product taxes minus product subsidies).",
      difficulty: "Intermediate",
      competency: "Official Statistics Standards",
      competencyId: "comp-stat-standards",
      sourceDocument: "National_Accounts_Methodology_Base_Revision_2025.pdf",
      sourcePage: "Page 9, Section 1.4 (Macroeconomic Accounting Identities)",
      sourceSnippet:
        "Section 1.4.2: GDP at market prices = ∑ GVA at basic prices + (Product Taxes - Product Subsidies).",
      aiConfidence: 0.96,
    },
    {
      id: "mcq-nas-002",
      questionNumber: 2,
      question:
        "What method does the Central Statistics Office (CSO / NSO) utilize to deflate constant price estimates of manufacturing GVA when suitable volume indicators are absent?",
      options: [
        { id: "opt-1", label: "A", text: "Single deflation using Consumer Price Index for Agricultural Labourers (CPI-AL)" },
        { id: "opt-2", label: "B", text: "Double deflation using commodity-specific Wholesale Price Index (WPI) for outputs and inputs separately" },
        { id: "opt-3", label: "C", text: "Unadjusted nominal exchange rate parity conversion" },
        { id: "opt-4", label: "D", text: "Flat inflation assumption pegged to the RBI Repo rate" },
      ],
      correctOptionId: "opt-2",
      correctOptionLabel: "B",
      explanation:
        "The conceptually ideal approach in national accounting is double deflation, where gross output is deflated by output price indices (WPI commodities) and intermediate consumption is deflated by an input price index derived from input-output coefficients.",
      difficulty: "Advanced",
      competency: "Data Analysis & Statistics",
      competencyId: "comp-data-analysis",
      sourceDocument: "National_Accounts_Methodology_Base_Revision_2025.pdf",
      sourcePage: "Page 42, Section 5.3 (Deflation Techniques & Price Indices)",
      sourceSnippet:
        "Section 5.3.1: Constant price GVA should ideally be derived by double deflation: GVA_constant = (Output / P_out) - (Intermediate Consumption / P_in).",
      aiConfidence: 0.93,
    },
  ],
};

export const defaultMockQuestions: GeneratedMCQ[] = mockGeneratedQuestions["doc-gces-2025"];
