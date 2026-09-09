import {
  AdminAnalytics,
  TeamMemberCompetency,
  MCQReviewItem,
  CompetencyDistributionDomain,
  ProficiencyLevelDistribution,
  HeatmapDivisionScore,
  AssessmentPerformanceTrendItem,
  ScoreTierDistribution,
  CourseCompletionTrendItem,
  TopOrganizationalGap,
  HeatmapTeamRow,
  HeatmapEmployeeRow
} from "@/types";

export const mockAdminAnalytics: AdminAnalytics = {
  totalLearners: 2840,
  activeLearnersLast30Days: 1965,
  averageAssessmentScore: 74.2,
  overallCourseCompletionRate: 68.5,
  totalAssessmentsConducted: 4120,
  mostCommonGaps: [
    { competencyName: "Statistical Computing & Programming", gapCount: 1420, averageDeficit: 1.8 },
    { competencyName: "Data Management & Microdata Curation", gapCount: 980, averageDeficit: 1.3 },
    { competencyName: "Data Visualization & Thematic Mapping", gapCount: 840, averageDeficit: 1.1 },
    { competencyName: "Official Statistics Standards & Indicators", gapCount: 650, averageDeficit: 0.9 },
    { competencyName: "Statistical Methods & Estimation", gapCount: 510, averageDeficit: 0.8 },
  ],
  monthlyActivityTrends: [
    { month: "Apr 2026", assessmentsTaken: 310, coursesCompleted: 240, quizzesAttempted: 890 },
    { month: "May 2026", assessmentsTaken: 450, coursesCompleted: 380, quizzesAttempted: 1240 },
    { month: "Jun 2026", assessmentsTaken: 620, coursesCompleted: 510, quizzesAttempted: 1650 },
    { month: "Jul 2026", assessmentsTaken: 780, coursesCompleted: 640, quizzesAttempted: 2100 },
    { month: "Aug 2026", assessmentsTaken: 950, coursesCompleted: 790, quizzesAttempted: 2750 },
    { month: "Sep 2026", assessmentsTaken: 1010, coursesCompleted: 850, quizzesAttempted: 3120 },
  ],
  departmentPerformance: [
    { department: "National Accounts Division (NAD)", averageCompetencyScore: 82.4, learnerCount: 340 },
    { department: "Field Operations Division (FOD)", averageCompetencyScore: 71.8, learnerCount: 1120 },
    { department: "Survey Design & Research Division (SDRD)", averageCompetencyScore: 86.1, learnerCount: 290 },
    { department: "Data Quality Assurance Division (DQAD)", averageCompetencyScore: 79.5, learnerCount: 420 },
    { department: "Economic Statistics Division (ESD)", averageCompetencyScore: 76.9, learnerCount: 670 },
  ]
};

export const mockTeamCompetencies: TeamMemberCompetency[] = [
  {
    userId: "usr-8841",
    name: "Rajesh Kumar Verma",
    role: "Senior Statistical Officer",
    department: "Field Operations Division",
    competencies: [
      { competencyId: "comp-stat-methods", competencyName: "Statistical Methods", currentLevel: 3, requiredLevel: 4, status: "moderate" },
      { competencyId: "comp-survey-method", competencyName: "Survey Methodology", currentLevel: 4, requiredLevel: 4, status: "meets" },
      { competencyId: "comp-data-mgmt", competencyName: "Data Management", currentLevel: 3, requiredLevel: 4, status: "moderate" },
      { competencyId: "comp-stat-comp", competencyName: "Statistical Computing", currentLevel: 2, requiredLevel: 4, status: "critical" },
      { competencyId: "comp-data-vis", competencyName: "Data Visualization", currentLevel: 2, requiredLevel: 3, status: "moderate" },
      { competencyId: "comp-official-std", competencyName: "Official Standards", currentLevel: 3, requiredLevel: 4, status: "moderate" },
      { competencyId: "comp-policy-comm", competencyName: "Policy Communication", currentLevel: 3, requiredLevel: 3, status: "meets" },
    ]
  },
  {
    userId: "usr-9102",
    name: "Priya Sundaram",
    role: "Junior Statistical Officer",
    department: "Survey Design & Research Division",
    competencies: [
      { competencyId: "comp-stat-methods", competencyName: "Statistical Methods", currentLevel: 2, requiredLevel: 2, status: "meets" },
      { competencyId: "comp-survey-method", competencyName: "Survey Methodology", currentLevel: 3, requiredLevel: 3, status: "meets" },
      { competencyId: "comp-data-mgmt", competencyName: "Data Management", currentLevel: 3, requiredLevel: 2, status: "exceeds" },
      { competencyId: "comp-stat-comp", competencyName: "Statistical Computing", currentLevel: 3, requiredLevel: 2, status: "exceeds" },
      { competencyId: "comp-data-vis", competencyName: "Data Visualization", currentLevel: 2, requiredLevel: 1, status: "exceeds" },
      { competencyId: "comp-official-std", competencyName: "Official Standards", currentLevel: 2, requiredLevel: 2, status: "meets" },
      { competencyId: "comp-policy-comm", competencyName: "Policy Communication", currentLevel: 1, requiredLevel: 1, status: "meets" },
    ]
  },
  {
    userId: "usr-7419",
    name: "Amitabh Banerjee",
    role: "Assistant Director",
    department: "National Accounts Division",
    competencies: [
      { competencyId: "comp-stat-methods", competencyName: "Statistical Methods", currentLevel: 4, requiredLevel: 4, status: "meets" },
      { competencyId: "comp-survey-method", competencyName: "Survey Methodology", currentLevel: 4, requiredLevel: 4, status: "meets" },
      { competencyId: "comp-data-mgmt", competencyName: "Data Management", currentLevel: 4, requiredLevel: 4, status: "meets" },
      { competencyId: "comp-stat-comp", competencyName: "Statistical Computing", currentLevel: 4, requiredLevel: 4, status: "meets" },
      { competencyId: "comp-data-vis", competencyName: "Data Visualization", currentLevel: 4, requiredLevel: 3, status: "exceeds" },
      { competencyId: "comp-official-std", competencyName: "Official Standards", currentLevel: 5, requiredLevel: 4, status: "exceeds" },
      { competencyId: "comp-policy-comm", competencyName: "Policy Communication", currentLevel: 4, requiredLevel: 3, status: "exceeds" },
    ]
  },
  {
    userId: "usr-6321",
    name: "Sunita Meena",
    role: "Senior Statistical Officer",
    department: "Data Quality Assurance Division",
    competencies: [
      { competencyId: "comp-stat-methods", competencyName: "Statistical Methods", currentLevel: 2, requiredLevel: 3, status: "moderate" },
      { competencyId: "comp-survey-method", competencyName: "Survey Methodology", currentLevel: 3, requiredLevel: 4, status: "moderate" },
      { competencyId: "comp-data-mgmt", competencyName: "Data Management", currentLevel: 2, requiredLevel: 3, status: "moderate" },
      { competencyId: "comp-stat-comp", competencyName: "Statistical Computing", currentLevel: 1, requiredLevel: 3, status: "critical" },
      { competencyId: "comp-data-vis", competencyName: "Data Visualization", currentLevel: 1, requiredLevel: 2, status: "moderate" },
      { competencyId: "comp-official-std", competencyName: "Official Standards", currentLevel: 3, requiredLevel: 3, status: "meets" },
      { competencyId: "comp-policy-comm", competencyName: "Policy Communication", currentLevel: 2, requiredLevel: 2, status: "meets" },
    ]
  }
];

export const mockMCQReviewQueue: MCQReviewItem[] = [
  {
    id: "mcq-rev-01",
    sourceDocumentName: "MoSPI_GCES_Field_Manual_2025-26.pdf",
    sourcePage: "Page 14, Section 3.2 (Sampling Framework)",
    extractedSnippet: "Section 3.2.1: In GCES methodology, the revenue village shall be the Primary Sampling Unit (PSU) and the standard experimental plot constitutes the Ultimate Sampling Unit (USU).",
    status: "pending",
    aiConfidence: 0.96,
    createdAt: "2026-09-01T14:20:00Z",
    question: {
      id: "gen-q-01",
      competencyId: "comp-survey-method",
      competencyName: "Survey Methodology & Sampling Design",
      difficulty: "intermediate",
      questionText: "Under the General Crop Estimation Survey (GCES) framework for agricultural yield estimation, what forms the Ultimate Sampling Unit (USU)?",
      options: [
        { id: "opt-a1", text: "The revenue district" },
        { id: "opt-a2", text: "A circular or rectangular experimental crop-cutting plot" },
        { id: "opt-a3", text: "The whole village cadastral map" },
        { id: "opt-a4", text: "The agro-climatic sub-zone" }
      ],
      correctOptionId: "opt-a2",
      explanation: "In GCES, the primary sampling units are villages, the secondary sampling units are fields/survey numbers, and the ultimate sampling unit is an experimental plot of specified dimension for crop-cutting experiments.",
      sourceMaterial: "MoSPI_GCES_Field_Manual_2025-26.pdf",
      aiConfidence: 0.96
    }
  },
  {
    id: "mcq-rev-02",
    sourceDocumentName: "National_Accounts_Methodology_Base_Revision_2025.pdf",
    sourcePage: "Page 28, Paragraph 12 (Asset Classification)",
    extractedSnippet: "Paragraph 12: In the compilation of gross fixed capital formation (GFCF), expenditures on research and development (R&D) are capitalized as intellectual property products.",
    status: "pending",
    aiConfidence: 0.91,
    createdAt: "2026-09-02T09:15:00Z",
    question: {
      id: "gen-q-02",
      competencyId: "comp-official-std",
      competencyName: "Official Statistics Standards & Indicators",
      difficulty: "advanced",
      questionText: "In accordance with SNA 2008 recommendations adopted in National Accounts Statistics, how is expenditure on Research & Development (R&D) classified?",
      options: [
        { id: "opt-b1", text: "Treated entirely as intermediate consumption of industries" },
        { id: "opt-b2", text: "Capitalized as Gross Fixed Capital Formation under Intellectual Property Products" },
        { id: "opt-b3", text: "Classified as final consumption expenditure of households" },
        { id: "opt-b4", text: "Deducted as environmental degradation cost" }
      ],
      correctOptionId: "opt-b2",
      explanation: "Under SNA 2008, R&D expenditures that provide future economic benefits are no longer treated as intermediate consumption, but are capitalized as intellectual property products within GFCF.",
      sourceMaterial: "National_Accounts_Methodology_Base_Revision_2025.pdf",
      aiConfidence: 0.91
    }
  },
  {
    id: "mcq-rev-03",
    sourceDocumentName: "PLFS_Sampling_Design_Guidelines_2025.pdf",
    sourcePage: "Page 18, Section 2.4 (Urban Rotational Panel Design)",
    extractedSnippet: "Section 2.4: For urban rotational panels, each selected UFS block is visited four times in total (once every quarter) with 25% of FSUs rotated out each quarter.",
    status: "pending",
    aiConfidence: 0.95,
    createdAt: "2026-09-03T11:45:00Z",
    question: {
      id: "gen-q-03",
      competencyId: "comp-survey-method",
      competencyName: "Survey Methodology & Sampling Design",
      difficulty: "intermediate",
      questionText: "In the Periodic Labour Force Survey (PLFS), how is the rotational panel scheme structured for urban First Stage Units (FSUs)?",
      options: [
        { id: "opt-c1", text: "2-2-2 panel where each household is visited for 2 consecutive years" },
        { id: "opt-c2", text: "Rotational panel where each selected urban household is visited 4 times (once every quarter)" },
        { id: "opt-c3", text: "Cross-sectional single visit with no re-interviews" },
        { id: "opt-c4", text: "Continuous monthly panel visited for 12 consecutive months" }
      ],
      correctOptionId: "opt-c2",
      explanation: "For urban areas, PLFS adopts a rotational panel sampling design where each selected household is visited four times in total (one visit in each subsequent quarter over one year) with a 25% rotation of FSUs each quarter.",
      sourceMaterial: "PLFS_Sampling_Design_Guidelines_2025.pdf",
      aiConfidence: 0.95
    }
  },
  {
    id: "mcq-rev-04",
    sourceDocumentName: "Python_Official_Statistics_Microdata_Processing_Guide.pdf",
    sourcePage: "Page 45, Section 5.1 (Vectorized Aggregation with Pandas)",
    extractedSnippet: "Section 5.1: For large-scale NSS survey microdata, vectorized group-by operations utilizing multiplier weights yield substantial computational efficiencies over procedural row iterations.",
    status: "pending",
    aiConfidence: 0.93,
    createdAt: "2026-09-04T16:30:00Z",
    question: {
      id: "gen-q-04",
      competencyId: "comp-stat-comp",
      competencyName: "Statistical Computing & Programming",
      difficulty: "beginner",
      questionText: "When calculating weighted survey estimates from NSS 78th round microdata in Python, which method ensures optimal computational performance?",
      options: [
        { id: "opt-d1", text: "Vectorized pandas groupby aggregation with sample weight multiplication" },
        { id: "opt-d2", text: "Iterating row-by-row using a Python for-loop and accumulator variables" },
        { id: "opt-d3", text: "Exporting every record to a temporary CSV file and running a shell script" },
        { id: "opt-d4", text: "Converting all floating-point multipliers into string representations" }
      ],
      correctOptionId: "opt-d1",
      explanation: "Vectorized operations in pandas and numpy leverage optimized C-level contiguous memory arrays, executing batch mathematical multiplications thousands of times faster than iterative Python interpreter loops.",
      sourceMaterial: "Python_Official_Statistics_Microdata_Processing_Guide.pdf",
      aiConfidence: 0.93
    }
  }
];

export const mockCompetencyDistributionDomains: CompetencyDistributionDomain[] = [
  {
    domain: "Statistical Methods",
    code: "comp-stat-methods",
    demonstrated: 76,
    benchmark: 80,
    deficit: -4,
    officersCount: 2150,
    status: "moderate"
  },
  {
    domain: "Survey Methodology",
    code: "comp-survey-method",
    demonstrated: 82,
    benchmark: 80,
    deficit: 2,
    officersCount: 2330,
    status: "meets"
  },
  {
    domain: "Data Management",
    code: "comp-data-mgmt",
    demonstrated: 67,
    benchmark: 80,
    deficit: -13,
    officersCount: 1900,
    status: "moderate"
  },
  {
    domain: "Statistical Computing",
    code: "comp-stat-comp",
    demonstrated: 48,
    benchmark: 80,
    deficit: -32,
    officersCount: 1360,
    status: "critical"
  },
  {
    domain: "Official Standards (SNA)",
    code: "comp-official-std",
    demonstrated: 74,
    benchmark: 80,
    deficit: -6,
    officersCount: 2100,
    status: "moderate"
  },
  {
    domain: "Data Visualization",
    code: "comp-data-vis",
    demonstrated: 63,
    benchmark: 75,
    deficit: -12,
    officersCount: 1790,
    status: "moderate"
  }
];

export const mockProficiencyLevelDistribution: ProficiencyLevelDistribution[] = [
  {
    level: "Level 1: Foundation",
    levelNumber: 1,
    officersCount: 340,
    percentage: 12,
    description: "Introductory knowledge; requires regular supervision"
  },
  {
    level: "Level 2: Working",
    levelNumber: 2,
    officersCount: 740,
    percentage: 26,
    description: "Executes standard statistical procedures independently"
  },
  {
    level: "Level 3: Practitioner",
    levelNumber: 3,
    officersCount: 1080,
    percentage: 38,
    description: "Applies methodologies to complex departmental surveys"
  },
  {
    level: "Level 4: Specialist",
    levelNumber: 4,
    officersCount: 510,
    percentage: 18,
    description: "Designs sampling frameworks & diagnostic rubrics"
  },
  {
    level: "Level 5: Expert",
    levelNumber: 5,
    officersCount: 170,
    percentage: 6,
    description: "National authority on statistical policy & methodology"
  }
];

export const mockHeatmapDivisions: HeatmapDivisionScore[] = [
  {
    divisionCode: "div-nad",
    divisionName: "National Accounts Division",
    shortName: "NAD",
    officerCount: 340,
    averageScore: 82.4,
    scores: {
      methods: 86,
      sampling: 78,
      dataManagement: 84,
      computing: 68,
      standards: 94,
      visualization: 84
    },
    statuses: {
      methods: "meets",
      sampling: "moderate",
      dataManagement: "meets",
      computing: "moderate",
      standards: "exceeds",
      visualization: "meets"
    }
  },
  {
    divisionCode: "div-fod",
    divisionName: "Field Operations Division",
    shortName: "FOD",
    officerCount: 1120,
    averageScore: 71.8,
    scores: {
      methods: 72,
      sampling: 88,
      dataManagement: 62,
      computing: 42,
      standards: 76,
      visualization: 58
    },
    statuses: {
      methods: "moderate",
      sampling: "exceeds",
      dataManagement: "moderate",
      computing: "critical",
      standards: "moderate",
      visualization: "critical"
    }
  },
  {
    divisionCode: "div-sdrd",
    divisionName: "Survey Design & Research Division",
    shortName: "SDRD",
    officerCount: 290,
    averageScore: 86.1,
    scores: {
      methods: 92,
      sampling: 96,
      dataManagement: 82,
      computing: 78,
      standards: 84,
      visualization: 85
    },
    statuses: {
      methods: "exceeds",
      sampling: "exceeds",
      dataManagement: "meets",
      computing: "moderate",
      standards: "meets",
      visualization: "meets"
    }
  },
  {
    divisionCode: "div-dqad",
    divisionName: "Data Quality Assurance Division",
    shortName: "DQAD",
    officerCount: 420,
    averageScore: 79.5,
    scores: {
      methods: 78,
      sampling: 82,
      dataManagement: 88,
      computing: 58,
      standards: 82,
      visualization: 68
    },
    statuses: {
      methods: "moderate",
      sampling: "meets",
      dataManagement: "exceeds",
      computing: "critical",
      standards: "meets",
      visualization: "moderate"
    }
  },
  {
    divisionCode: "div-esd",
    divisionName: "Economic Statistics Division",
    shortName: "ESD",
    officerCount: 670,
    averageScore: 76.9,
    scores: {
      methods: 80,
      sampling: 79,
      dataManagement: 74,
      computing: 52,
      standards: 88,
      visualization: 71
    },
    statuses: {
      methods: "meets",
      sampling: "moderate",
      dataManagement: "moderate",
      computing: "critical",
      standards: "meets",
      visualization: "moderate"
    }
  }
];

export const mockAssessmentPerformanceTrends: AssessmentPerformanceTrendItem[] = [
  { month: "Apr 2026", assessmentsCount: 310, averageScore: 71.2, passRate: 84.5 },
  { month: "May 2026", assessmentsCount: 450, averageScore: 72.4, passRate: 85.8 },
  { month: "Jun 2026", assessmentsCount: 620, averageScore: 73.1, passRate: 86.4 },
  { month: "Jul 2026", assessmentsCount: 780, averageScore: 73.8, passRate: 87.2 },
  { month: "Aug 2026", assessmentsCount: 950, averageScore: 74.0, passRate: 87.9 },
  { month: "Sep 2026", assessmentsCount: 1010, averageScore: 74.2, passRate: 88.4 }
];

export const mockScoreTierDistribution: ScoreTierDistribution[] = [
  { tier: "Distinction", range: "Score ≥ 85%", percentage: 32, count: 1318, color: "#15803d" },
  { tier: "Proficient", range: "Score 70–84%", percentage: 44, count: 1813, color: "#0B2545" },
  { tier: "Developing", range: "Score 50–69%", percentage: 18, count: 742, color: "#d97706" },
  { tier: "Critical Remediation", range: "Score < 50%", percentage: 6, count: 247, color: "#e11d48" }
];

export const mockCourseCompletionTrends: CourseCompletionTrendItem[] = [
  { month: "Apr 2026", enrolled: 580, completed: 240, quizzes: 890, learningHours: 3840 },
  { month: "May 2026", enrolled: 760, completed: 380, quizzes: 1240, learningHours: 5620 },
  { month: "Jun 2026", enrolled: 940, completed: 510, quizzes: 1650, learningHours: 7250 },
  { month: "Jul 2026", enrolled: 1120, completed: 640, quizzes: 2100, learningHours: 8490 },
  { month: "Aug 2026", enrolled: 1280, completed: 790, quizzes: 2750, learningHours: 9820 },
  { month: "Sep 2026", enrolled: 1410, completed: 850, quizzes: 3120, learningHours: 11160 }
];

export const mockTopOrganizationalGaps: TopOrganizationalGap[] = [
  {
    id: "org-gap-01",
    rank: 1,
    competencyName: "Statistical Computing & Programming (Python / R)",
    competencyCode: "comp-stat-comp",
    category: "Technical / Analytical",
    affectedOfficers: 1420,
    affectedPercentage: 50.0,
    averageDeficit: 1.8,
    currentScore: 48,
    requiredScore: 80,
    priority: "Critical",
    recommendedCourse: {
      id: "course-py-01",
      title: "Python for Official Statistics: Survey Data Cleaning & Tabulation",
      provider: "iGOT Karmayogi / NSSTA",
      duration: "18 Hours"
    },
    remedialAction: "Issue departmental directive for mandatory completion of Python foundational certification within 60 days."
  },
  {
    id: "org-gap-02",
    rank: 2,
    competencyName: "Data Management & Microdata Curation",
    competencyCode: "comp-data-mgmt",
    category: "Data Governance",
    affectedOfficers: 980,
    affectedPercentage: 34.5,
    averageDeficit: 1.3,
    currentScore: 67,
    requiredScore: 80,
    priority: "High",
    recommendedCourse: {
      id: "course-dm-02",
      title: "Microdata Curation, Anonymization & SDMX Standards",
      provider: "iGOT Karmayogi / DQAD",
      duration: "12 Hours"
    },
    remedialAction: "Deploy mandatory microdata curation modules for all FOD and DQAD statistical field officers."
  },
  {
    id: "org-gap-03",
    rank: 3,
    competencyName: "Data Visualization & Thematic Mapping (GIS)",
    competencyCode: "comp-data-vis",
    category: "Communication & Dissemination",
    affectedOfficers: 840,
    affectedPercentage: 29.6,
    averageDeficit: 1.1,
    currentScore: 63,
    requiredScore: 75,
    priority: "High",
    recommendedCourse: {
      id: "course-vis-03",
      title: "Spatial Data Analysis & Thematic Cartography for Survey Statistics",
      provider: "iGOT Karmayogi / SDRD",
      duration: "10 Hours"
    },
    remedialAction: "Nominate statistical officers for NSSTA GIS mapping workshops to elevate survey dissemination."
  },
  {
    id: "org-gap-04",
    rank: 4,
    competencyName: "Official Statistics Standards (SNA 2008 & SDDS)",
    competencyCode: "comp-official-std",
    category: "Domain / Regulatory",
    affectedOfficers: 650,
    affectedPercentage: 22.9,
    averageDeficit: 0.9,
    currentScore: 74,
    requiredScore: 80,
    priority: "Moderate",
    recommendedCourse: {
      id: "course-sna-04",
      title: "System of National Accounts: Supply-Use Tables & GFCF Compilation",
      provider: "NSSTA Masterclass / NAD",
      duration: "15 Hours"
    },
    remedialAction: "Enroll junior officers in NAD base revision masterclasses ahead of national accounts re-basing."
  },
  {
    id: "org-gap-05",
    rank: 5,
    competencyName: "Statistical Methods & Small Area Estimation",
    competencyCode: "comp-stat-methods",
    category: "Methodological",
    affectedOfficers: 510,
    affectedPercentage: 18.0,
    averageDeficit: 0.8,
    currentScore: 76,
    requiredScore: 80,
    priority: "Moderate",
    recommendedCourse: {
      id: "course-sae-05",
      title: "Small Area Estimation & Calibration in Large Scale Sample Surveys",
      provider: "NSSTA / ISI Kolkata",
      duration: "14 Hours"
    },
    remedialAction: "Organize targeted webinar series with Indian Statistical Institute on district-level estimation."
  }
];

export const mockHeatmapTeams: HeatmapTeamRow[] = [
  {
    id: "team-a",
    teamName: "Team A",
    department: "National Accounts Division (NAD)",
    headcount: 340,
    scores: {
      python: 38,
      statistics: 82,
      survey: 76,
      visualization: 52,
      dataManagement: 84,
      officialStandards: 94
    },
    averageScore: 62.0,
    status: "moderate"
  },
  {
    id: "team-b",
    teamName: "Team B",
    department: "Field Operations Division (FOD)",
    headcount: 1120,
    scores: {
      python: 61,
      statistics: 78,
      survey: 65,
      visualization: 71,
      dataManagement: 62,
      officialStandards: 76
    },
    averageScore: 68.8,
    status: "moderate"
  },
  {
    id: "team-c",
    teamName: "Team C",
    department: "Survey Design & Research Division (SDRD)",
    headcount: 290,
    scores: {
      python: 42,
      statistics: 91,
      survey: 58,
      visualization: 49,
      dataManagement: 82,
      officialStandards: 84
    },
    averageScore: 60.0,
    status: "moderate"
  },
  {
    id: "team-d",
    teamName: "Team D",
    department: "Data Quality Assurance Division (DQAD)",
    headcount: 420,
    scores: {
      python: 56,
      statistics: 74,
      survey: 84,
      visualization: 66,
      dataManagement: 88,
      officialStandards: 82
    },
    averageScore: 70.0,
    status: "meets"
  },
  {
    id: "team-e",
    teamName: "Team E",
    department: "Economic Statistics Division (ESD)",
    headcount: 670,
    scores: {
      python: 49,
      statistics: 85,
      survey: 72,
      visualization: 63,
      dataManagement: 74,
      officialStandards: 88
    },
    averageScore: 67.3,
    status: "moderate"
  }
];

export const mockHeatmapEmployees: HeatmapEmployeeRow[] = [
  {
    id: "emp-01",
    name: "Amitabh Banerjee",
    role: "Assistant Director",
    department: "National Accounts Division (NAD)",
    team: "Team A",
    scores: {
      python: 38,
      statistics: 86,
      survey: 78,
      visualization: 54,
      dataManagement: 85,
      officialStandards: 96
    },
    averageScore: 64.0,
    status: "moderate"
  },
  {
    id: "emp-02",
    name: "Ananya Sengupta",
    role: "Statistical Officer",
    department: "National Accounts Division (NAD)",
    team: "Team A",
    scores: {
      python: 35,
      statistics: 80,
      survey: 75,
      visualization: 48,
      dataManagement: 82,
      officialStandards: 92
    },
    averageScore: 59.5,
    status: "critical"
  },
  {
    id: "emp-03",
    name: "Rajesh Kumar Verma",
    role: "Senior Statistical Officer",
    department: "Field Operations Division (FOD)",
    team: "Team B",
    scores: {
      python: 42,
      statistics: 78,
      survey: 88,
      visualization: 62,
      dataManagement: 64,
      officialStandards: 78
    },
    averageScore: 67.5,
    status: "moderate"
  },
  {
    id: "emp-04",
    name: "Mohammad Tariq",
    role: "Junior Statistical Officer",
    department: "Field Operations Division (FOD)",
    team: "Team B",
    scores: {
      python: 61,
      statistics: 74,
      survey: 62,
      visualization: 71,
      dataManagement: 60,
      officialStandards: 74
    },
    averageScore: 67.0,
    status: "moderate"
  },
  {
    id: "emp-05",
    name: "Priya Sundaram",
    role: "Junior Statistical Officer",
    department: "Survey Design & Research Division (SDRD)",
    team: "Team C",
    scores: {
      python: 64,
      statistics: 92,
      survey: 94,
      visualization: 58,
      dataManagement: 86,
      officialStandards: 88
    },
    averageScore: 77.0,
    status: "meets"
  },
  {
    id: "emp-06",
    name: "Deepak Chauhan",
    role: "Senior Statistical Officer",
    department: "Survey Design & Research Division (SDRD)",
    team: "Team C",
    scores: {
      python: 42,
      statistics: 91,
      survey: 58,
      visualization: 49,
      dataManagement: 80,
      officialStandards: 82
    },
    averageScore: 60.0,
    status: "critical"
  },
  {
    id: "emp-07",
    name: "Sunita Meena",
    role: "Senior Statistical Officer",
    department: "Data Quality Assurance Division (DQAD)",
    team: "Team D",
    scores: {
      python: 52,
      statistics: 76,
      survey: 82,
      visualization: 68,
      dataManagement: 88,
      officialStandards: 80
    },
    averageScore: 69.5,
    status: "moderate"
  },
  {
    id: "emp-08",
    name: "Kavita Nambiar",
    role: "Assistant Director",
    department: "Data Quality Assurance Division (DQAD)",
    team: "Team D",
    scores: {
      python: 60,
      statistics: 78,
      survey: 86,
      visualization: 70,
      dataManagement: 90,
      officialStandards: 84
    },
    averageScore: 73.5,
    status: "meets"
  },
  {
    id: "emp-09",
    name: "Vikas Deshmukh",
    role: "Deputy Director",
    department: "Economic Statistics Division (ESD)",
    team: "Team E",
    scores: {
      python: 58,
      statistics: 88,
      survey: 74,
      visualization: 72,
      dataManagement: 78,
      officialStandards: 90
    },
    averageScore: 73.0,
    status: "meets"
  },
  {
    id: "emp-10",
    name: "Harish Chandra",
    role: "Statistical Officer",
    department: "Economic Statistics Division (ESD)",
    team: "Team E",
    scores: {
      python: 49,
      statistics: 85,
      survey: 72,
      visualization: 63,
      dataManagement: 72,
      officialStandards: 86
    },
    averageScore: 67.3,
    status: "moderate"
  }
];
