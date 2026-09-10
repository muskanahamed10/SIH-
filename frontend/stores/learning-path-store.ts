"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LearningPathItem, LearningPathStatus } from "@/types";
import { mockPersonalizedLearningPath } from "@/mocks/data/learning-path";

interface LearningPathStoreState {
  items: LearningPathItem[];
  overallProgress: number;
  initPath: (initialItems?: LearningPathItem[]) => void;
  startLearningItem: (itemId: string) => void;
  updateItemProgress: (itemId: string, progress: number, status?: LearningPathStatus) => void;
  resetPath: () => void;
}

export const useLearningPathStore = create<LearningPathStoreState>()(
  persist(
    (set, get) => ({
      items: mockPersonalizedLearningPath.items,
      overallProgress: mockPersonalizedLearningPath.overallProgress,

      initPath: (initialItems) => {
        const currentItems = get().items;
        // Don't overwrite if learner already has saved state
        if (currentItems && currentItems.length > 0) return;
        set({
          items: initialItems || mockPersonalizedLearningPath.items,
          overallProgress: mockPersonalizedLearningPath.overallProgress,
        });
      },

      startLearningItem: (itemId) => {
        set((state) => {
          const nextItems = state.items.map((item) => {
            if (item.id === itemId || item.resourceId === itemId) {
              return {
                ...item,
                status: "IN_PROGRESS" as LearningPathStatus,
                progress: Math.max(item.progress, 10),
              };
            }
            return item;
          });

          // Recompute overall path progress
          const total = nextItems.reduce((acc, curr) => acc + curr.progress, 0);
          const computedOverall = Math.round(total / nextItems.length);

          return {
            items: nextItems,
            overallProgress: Math.max(computedOverall, 25),
          };
        });
      },

      updateItemProgress: (itemId, progress, status) => {
        set((state) => {
          const nextItems = state.items.map((item) => {
            if (item.id === itemId || item.resourceId === itemId) {
              const nextStatus = status || (progress >= 100 ? "COMPLETED" : "IN_PROGRESS");
              return {
                ...item,
                progress,
                status: nextStatus as LearningPathStatus,
              };
            }
            return item;
          });

          const total = nextItems.reduce((acc, curr) => acc + curr.progress, 0);
          const computedOverall = Math.round(total / nextItems.length);

          return {
            items: nextItems,
            overallProgress: computedOverall,
          };
        });
      },

      resetPath: () => {
        set({
          items: mockPersonalizedLearningPath.items,
          overallProgress: mockPersonalizedLearningPath.overallProgress,
        });
      },
    }),
    {
      name: "sih_personalized_learning_path_v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
