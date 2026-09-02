import { AdminAnalytics, TeamMemberCompetency, MCQReviewItem } from "@/types";

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
    sourceDocumentName: "MoSPI_Annual_Report_2025-26_Ch3.pdf",
    extractedSnippet: "Section 3.4: All primary agricultural crops yield estimation utilizes the General Crop Estimation Survey (GCES) methodology with stratified multi-stage random sampling design.",
    status: "pending",
    aiConfidence: 0.94,
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
      sourceMaterial: "GCES Manual of Instructions, Directorate of Economics and Statistics",
      aiConfidence: 0.94
    }
  },
  {
    id: "mcq-rev-02",
    sourceDocumentName: "National_Accounts_Revision_Paper_2026.docx",
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
      sourceMaterial: "CSO Guidelines on SNA 2008 Implementation",
      aiConfidence: 0.91
    }
  }
];
