import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { livestockActivityApi as api } from "../services/livestockActivityApi";
import type {
  ActivityType,
  EventType,
  FormData,
  HealthStatus,
  Job
} from "./types/livestockActivity";

// Re-export FormData for components
export type { FormData };

interface LivestockActivityStore {
  // Reference data
  jobs: Job[];
  eventTypes: EventType[];
  healthStatuses: HealthStatus[];

  // Set reference data
  setJobs: (jobs: Job[]) => void;
  setEventTypes: (eventTypes: EventType[]) => void;
  setHealthStatuses: (healthStatuses: HealthStatus[]) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;

  //get data
  getEventTypes: (template: ActivityType) => Promise<EventType[] | undefined>;
  getHealthStatuses: () => Promise<HealthStatus[] | undefined>;
}

export const useLivestockActivityStore = create<LivestockActivityStore>()(
  devtools(
    (set, get) => ({
      // Reference data
      jobs: [],
      eventTypes: [],
      healthStatuses: [],

      //get data
      getEventTypes: async (template: ActivityType): Promise<EventType[] | undefined> => {
        console.log(`Fetching event types for template: ${template}`);
        try {
          if (
            get().eventTypes.length === 0 ||
            get().eventTypes[0].journal_template_name !== template
          ) {
            // Set loading state
            set({ isLoading: true, error: null });

            // Make API call
            const eventTypes = await api.fetchEventTypes(template);

            // Update state with fetched data
            set((state) => ({
              ...state,
              eventTypes,
              isLoading: false
            }));
          }
          return get().eventTypes;
        } catch (error) {
          // Handle error
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          }));
        }
      },
      getHealthStatuses: async () => {
        try {
          if (get().healthStatuses.length === 0) {
            // Set loading state
            set({ isLoading: true, error: null });

            // Make API call
            const healthStatuses = await api.fetchHealthStatuses();

            // Update state with fetched data
            set((state) => ({
              ...state,
              healthStatuses,
              isLoading: false
            }));
          }
          return get().healthStatuses;
        } catch (error) {
          // Handle error
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          }));
        }
      },
      setJobs: (jobs) => set({ jobs }),
      setEventTypes: (eventTypes) => set({ eventTypes }),
      setHealthStatuses: (healthStatuses) => set({ healthStatuses }),

      // Loading states
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Error handling
      error: null,
      setError: (error) => set({ error })
    }),
    { name: "LivestockActivityStore" }
  )
);
