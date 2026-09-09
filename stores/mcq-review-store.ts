"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MCQReviewItem, Question } from "@/types";
import { mockMCQReviewQueue } from "@/mocks/data/admin";

export interface MCQReviewState {
  items: MCQReviewItem[];
  statusFilter: "all" | "pending" | "approved" | "rejected";
  searchQuery: string;
  editingItem: MCQReviewItem | null;

  // Actions
  approveMCQ: (id: string) => void;
  rejectMCQ: (id: string, reason?: string) => void;
  updateMCQ: (
    id: string,
    updatedQuestion: Partial<Question>,
    sourceDocumentName?: string,
    sourcePage?: string
  ) => void;
  setEditingItem: (item: MCQReviewItem | null) => void;
  setStatusFilter: (filter: "all" | "pending" | "approved" | "rejected") => void;
  setSearchQuery: (query: string) => void;
  resetQueue: () => void;
}

export const useMCQReviewStore = create<MCQReviewState>()(
  persist(
    (set) => ({
      items: mockMCQReviewQueue,
      statusFilter: "all",
      searchQuery: "",
      editingItem: null,

      approveMCQ: (id: string) => {
        const now = new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "approved",
                  reviewedBy: "Dr. K. S. Murthy (MoSPI / NSSTA Lead SME)",
                  reviewedAt: now,
                  rejectionReason: undefined,
                }
              : item
          ),
        }));
      },

      rejectMCQ: (id: string, reason?: string) => {
        const now = new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "rejected",
                  reviewedBy: "Dr. K. S. Murthy (MoSPI / NSSTA Lead SME)",
                  reviewedAt: now,
                  rejectionReason:
                    reason || "Assessment distractor ambiguity or weak manual alignment.",
                }
              : item
          ),
        }));
      },

      updateMCQ: (
        id: string,
        updatedQuestion: Partial<Question>,
        sourceDocumentName?: string,
        sourcePage?: string
      ) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;

            return {
              ...item,
              sourceDocumentName: sourceDocumentName || item.sourceDocumentName,
              sourcePage: sourcePage || item.sourcePage,
              question: {
                ...item.question,
                ...updatedQuestion,
              },
            };
          }),
          editingItem: null,
        }));
      },

      setEditingItem: (item) => set({ editingItem: item }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      resetQueue: () =>
        set({
          items: mockMCQReviewQueue,
          statusFilter: "all",
          searchQuery: "",
          editingItem: null,
        }),
    }),
    {
      name: "sih_sme_mcq_review_v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
