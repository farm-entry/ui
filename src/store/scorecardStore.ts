import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { scorecardApi as api } from "../services/scorecardApi";
import { ScorecardConfig, ScorecardFormData, ScorecardPage, ScorecardType, ScorecardUser } from "./types/scorecards";

interface ScorecardState {
  // Data
  scorecardTypes: ScorecardType[];
  scorecardConfig: ScorecardConfig | null;
  currentJob: string | null;
  currentPostingGroup: string | null;
  users: ScorecardUser[];

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Error handling
  error: string | null;
}

interface ScorecardActions {
  // Fetch scorecard types for a job
  getScorecardTypes: (job: string) => Promise<ScorecardType[] | undefined>;
  setScorecardTypes: (types: ScorecardType[]) => void;
  clearScorecardTypes: () => void;

  // Fetch scorecard configuration
  getScorecardConfig: (jobNo: string, postingGroup: string) => Promise<ScorecardConfig | undefined>;
  setScorecardConfig: (config: ScorecardConfig | null) => void;
  clearScorecardConfig: () => void;

  // Fetch scorecard resources
  getResources: () => Promise<void>;

  // Post scorecard
  postScorecard: (jobNo: string, input: ScorecardFormData) => Promise<void>;

  // Auto-post scorecard journals
  autoPostScorecard: (postingGroup: string) => Promise<void>;

  // Set current context
  setCurrentJob: (job: string | null) => void;
  setCurrentPostingGroup: (postingGroup: string | null) => void;

  // Loading state management
  setLoading: (loading: boolean) => void;
  setTypesLoading: (loading: boolean) => void;
  setConfigLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;

  // Error management
  setError: (error: string | null) => void;
  clearError: () => void;

  // Clear all
  clearAll: () => void;
  reset: () => void;
}

type ScorecardStore = ScorecardState & ScorecardActions;

export const useScorecardStore = create<ScorecardStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      scorecardTypes: [],
      scorecardConfig: null,
      currentJob: null,
      currentPostingGroup: null,
      users: [],
      isLoading: false,
      isSubmitting: false,
      error: null,

      // Fetch scorecard resources
      getResources: async () => {
        try {
          const resources = await api.getResources();
          set((state) => ({ ...state, users: resources.users }));
        } catch (error) {
          console.error("Error fetching scorecard resources:", error);
        }
      },

      // Fetch scorecard types
      getScorecardTypes: async (job: string) => {
        try {
          set((state) => ({
            ...state,
            isLoading: true,
            error: null,
            currentJob: job
          }));

          const types = await api.getScorecardTypes(job);

          set((state) => ({
            ...state,
            scorecardTypes: types,
            isLoading: false
          }));

          return types;
        } catch (error) {
          console.error("Caught error while fetching scorecard types:", error);
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false
          }));
          return undefined;
        }
      },

      setScorecardTypes: (types: ScorecardType[]) => {
        set((state) => ({ ...state, scorecardTypes: types }));
      },

      clearScorecardTypes: () => {
        set((state) => ({
          ...state,
          scorecardTypes: [],
          error: null
        }));
      },

      // Fetch scorecard configuration
      getScorecardConfig: async (jobNo: string, postingGroup: string) => {
        try {
          set((state) => ({
            ...state,
            isLoading: true,
            error: null,
            currentJob: jobNo,
            currentPostingGroup: postingGroup
          }));

          const config = await api.getScorecardConfig(jobNo, postingGroup);

          set((state) => ({
            ...state,
            scorecardConfig: config,
            isLoading: false
          }));

          return config;
        } catch (error) {
          console.error("Caught error while fetching scorecard config:", error);
          set((state) => ({
            ...state,
            scorecardConfig: null,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false
          }));
          return undefined;
        }
      },

      setScorecardConfig: (config: ScorecardConfig | null) => {
        set((state) => ({ ...state, scorecardConfig: config }));
      },

      clearScorecardConfig: () => {
        set((state) => ({
          ...state,
          scorecardConfig: null,
          error: null
        }));
      },

      // Post scorecard
      postScorecard: async (jobNo: string, input: ScorecardFormData) => {
        try {
          set((state) => ({ ...state, isSubmitting: true, error: null }));

          const result = await api.postScorecard(jobNo, input);

          set((state) => ({ ...state, isSubmitting: false }));

          return result;
        } catch (error) {
          console.error("Error posting scorecard:", error);
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isSubmitting: false
          }));
          throw error;
        }
      },

      // Auto-post scorecard journals
      autoPostScorecard: async (postingGroup: string) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          const result = await api.autoPostScorecard(postingGroup);

          set((state) => ({ ...state, isLoading: false }));

          return result;
        } catch (error) {
          console.error("Error auto-posting scorecard:", error);
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false
          }));
          throw error;
        }
      },

      // Set current context
      setCurrentJob: (job: string | null) => {
        set((state) => ({ ...state, currentJob: job }));
      },

      setCurrentPostingGroup: (postingGroup: string | null) => {
        set((state) => ({ ...state, currentPostingGroup: postingGroup }));
      },

      // Loading state management
      setSubmitting: (submitting: boolean) => {
        set((state) => ({ ...state, isSubmitting: submitting }));
      },

      // Error management
      setError: (error: string | null) => {
        set((state) => ({ ...state, error }));
      },

      clearError: () => {
        set((state) => ({ ...state, error: null }));
      },

      reset: () => get().clearAll(),

      // Clear all
      clearAll: () => {
        set({
          scorecardTypes: [],
          scorecardConfig: null,
          currentJob: null,
          currentPostingGroup: null,
          users: [],
          isLoading: false,
          isSubmitting: false,
          error: null
        });
      }
    }),
    {
      name: "scorecard-store"
    }
  )
);
