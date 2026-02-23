import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { livestockActivityApi as api } from "../services/livestockActivityApi";
import type { EventType, HealthStatus, Job } from "./types/livestockActivity";
import type { ActivityType } from "./types/forms";

type EventsType = {
  template: ActivityType;
  events: EventType[];
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
  getEvents: (template: ActivityType, job: string) => Promise<EventsType | undefined>;
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
      getEvents: async (template: ActivityType, job: string): Promise<EventsType | undefined> => {
        console.log(`Fetching events for template: ${template}, job: ${job}`);
        try {
          // Set loading state
          set({ isLoading: true, error: null });

          // Make API call with job parameter
          const { events, healthStatuses } = await api.fetchEventTypes(template, job);

          // Update state with fetched data
          set((state) => ({
            ...state,
            currentTemplate: template,
            eventTypes: events,
            healthStatuses,
            isLoading: false
          }));

          return { template, events: get().eventTypes, healthStatuses: get().healthStatuses };
        } catch (error) {
          // Handle error
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          }));
          throw error;
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
