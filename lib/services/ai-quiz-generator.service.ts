import {
  SampleLearningMaterial,
  GeneratedMCQ,
  UploadedMaterialInfo,
  QuizGenerationConfig,
  QuizProcessingStage,
} from "@/types";
import { mockSampleMaterials, mockGeneratedQuestions, defaultMockQuestions } from "@/mocks/data/quiz-generator";

export interface ProgressCallback {
  (stage: QuizProcessingStage, progress: number, message: string): void;
}

export interface AiQuizGeneratorService {
  readonly isLiveRAG: boolean;
  getSampleMaterials(): Promise<SampleLearningMaterial[]>;
  processAndGenerateQuiz(
    fileInfo: UploadedMaterialInfo,
    config: QuizGenerationConfig,
    onProgress?: ProgressCallback
  ): Promise<GeneratedMCQ[]>;
}

/**
 * Mock AI/RAG Service Adapter
 * Simulates document ingestion, OCR layout extraction, vector retrieval, and grounded MCQ synthesis
 */
export class MockAiQuizGeneratorAdapter implements AiQuizGeneratorService {
  readonly isLiveRAG = false;

  async getSampleMaterials(): Promise<SampleLearningMaterial[]> {
    // Return sample MoSPI learning materials
    return [...mockSampleMaterials];
  }

  async processAndGenerateQuiz(
    fileInfo: UploadedMaterialInfo,
    config: QuizGenerationConfig,
    onProgress?: ProgressCallback
  ): Promise<GeneratedMCQ[]> {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Stage 1: Uploading
    onProgress?.(
      "uploading",
      15,
      `Ingesting document payload ${fileInfo.fileName} (${fileInfo.fileSizeFormatted}) into secure MoSPI staging enclave...`
    );
    await sleep(400);

    // Stage 2: Extracting content
    onProgress?.(
      "extracting",
      35,
      `Parsing PDF layout structures, identifying section headings, and OCR-verifying ${fileInfo.pageCount || 48} document pages...`
    );
    await sleep(450);

    // Stage 3: Retrieving relevant content
    onProgress?.(
      "retrieving",
      65,
      `Partitioning text into 512-token chunks, computing dense vector embeddings, and retrieving high-relevance statistical paragraphs for ${config.competencyFocus || "Official Statistics Standards"}...`
    );
    await sleep(500);

    // Stage 4: Generating questions
    onProgress?.(
      "generating",
      85,
      `Invoking LLM prompt pipeline with domain grounding constraints, synthesizing 4 distinct options, verifying single ground truth, and authoring in-depth statistical explanations...`
    );
    await sleep(550);

    // Stage 5: Ready for review
    onProgress?.(
      "ready",
      100,
      "Validating question psychometric difficulty, checking SME formatting guidelines, and rendering questions for review."
    );
    await sleep(300);

    // Match questions to document ID, or fallback to default
    const matchingKey = Object.keys(mockGeneratedQuestions).find((key) => key === fileInfo.id) || "doc-gces-2025";
    const availableQuestions = mockGeneratedQuestions[matchingKey] || defaultMockQuestions;

    // Filter or slice according to requested count
    const count = Math.min(config.questionCount || 5, availableQuestions.length);
    const selected = availableQuestions.slice(0, count);

    return selected.map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
      sourceDocument: fileInfo.fileName,
    }));
  }
}

/**
 * Live Backend RAG Service Adapter
 * Connects to production MoSPI RAG endpoints (FastAPI / LangChain / Vector DB)
 */
export class BackendRagQuizGeneratorAdapter implements AiQuizGeneratorService {
  readonly isLiveRAG = true;
  private readonly baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_AI_RAG_API_URL || "/api/v1/rag") {
    this.baseUrl = baseUrl;
  }

  async getSampleMaterials(): Promise<SampleLearningMaterial[]> {
    try {
      const res = await fetch(`${this.baseUrl}/sample-materials`);
      if (!res.ok) throw new Error(`Failed to fetch sample materials: ${res.statusText}`);
      return await res.json();
    } catch {
      return [...mockSampleMaterials];
    }
  }

  async processAndGenerateQuiz(
    fileInfo: UploadedMaterialInfo,
    config: QuizGenerationConfig,
    onProgress?: ProgressCallback
  ): Promise<GeneratedMCQ[]> {
    onProgress?.("uploading", 20, "Initiating multi-modal ingest to live RAG cluster...");

    const response = await fetch(`${this.baseUrl}/generate-quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileInfo, config }),
    });

    if (!response.ok) {
      throw new Error(`Live AI/RAG service error (${response.status}): ${response.statusText}`);
    }

    onProgress?.("ready", 100, "Successfully received live generated MCQs from backend.");
    return await response.json();
  }
}

// Singleton factory
let serviceInstance: AiQuizGeneratorService | null = null;

export function getAiQuizGeneratorService(): AiQuizGeneratorService {
  if (!serviceInstance) {
    const isLive = process.env.NEXT_PUBLIC_AI_RAG_LIVE === "true";
    serviceInstance = isLive ? new BackendRagQuizGeneratorAdapter() : new MockAiQuizGeneratorAdapter();
  }
  return serviceInstance;
}
