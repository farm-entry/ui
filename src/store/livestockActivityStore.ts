import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { livestockActivityApi as api } from "../services/livestockActivityApi";
import type { ActivityType, EventType, HealthStatus, Job } from "./types/livestockActivity";

type EventsType = {
  template: ActivityType;
  journals: EventType[];
  healthStatuses: HealthStatus[];
};

interface LivestockActivityStore {
  // Reference data
  currentTemplate: ActivityType | null;
  jobs: Job[];
  eventTypes: EventType[];
  healthStatuses: HealthStatus[];

  // Set reference data
  setJobs: (jobs: Job[]) => void;
  setEvents: (eventTypes: EventType[]) => void;
  setHealthStatuses: (healthStatuses: HealthStatus[]) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;

  //get data
  getEvents: (template: ActivityType) => Promise<EventsType | undefined>;
}

export const useLivestockActivityStore = create<LivestockActivityStore>()(
  devtools(
    (set, get) => ({
      // Reference data
      jobs: [],
      currentTemplate: null,
      eventTypes: [],
      healthStatuses: [],

      //get data
      getEvents: async (template: ActivityType): Promise<EventsType | undefined> => {
        console.log(`Fetching events for template: ${template}`);
        try {
          if (
            get().healthStatuses.length === 0 ||
            get().eventTypes.length === 0 ||
            get().eventTypes[0].journal_template_name !== template
          ) {
            // Set loading state
            set({ isLoading: true, error: null });

            // Make API call
            const { journals, healthStatuses } = await api.fetchEventTypes(template);

            // Update state with fetched data
            set((state) => ({
              ...state,
              eventTypes: journals,
              healthStatuses,
              isLoading: false
            }));
          }
          return { template, journals: get().eventTypes, healthStatuses: get().healthStatuses };
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
      setEvents: (eventTypes) => set({ eventTypes }),
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
