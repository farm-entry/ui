import { create } from "zustand";
import { livestockActivityApi as api } from "../services/livestockActivityApi";
import type {
  ActivityType,
  Job,
  EventType,
  Reason,
  HealthStatus,
  DimensionPacker,
  FormData,
} from "./types/livestockActivity";

interface LivestockActivityStore {
  // Form data
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;

  // Reference data
  jobs: Job[];
  eventTypes: EventType[];
  healthStatuses: HealthStatus[];
  dimensionPackers: DimensionPacker[];

  // Set reference data
  setJobs: (jobs: Job[]) => void;
  setEventTypes: (eventTypes: EventType[]) => void;
  setHealthStatuses: (healthStatuses: HealthStatus[]) => void;
  setDimensionPackers: (dimensionPackers: DimensionPacker[]) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;

  // Clear form
  clearForm: () => void;

  //get data
  getEventTypes: (template: string) => Promise<EventType[] | undefined>;
  getHealthStatuses: (job: string) => Promise<HealthStatus[] | undefined>;
}

const initialFormData: FormData = {
  activityType: null,
  job: "",
  fromJob: "",
  toJob: "",
  event: "",
  postingDate: null,
  quantity: null,
  smallLivestockQuantity: null,
  totalWeight: null,
  livestockWeight: null,
  deadsOnArrivalQuantity: null,
  quantities: {},
  dimensionPacker: "",
  comments: "",
};

export const useLivestockActivityStore = create<LivestockActivityStore>(
  (set, get) => ({
    // Form data
    formData: initialFormData,

    updateFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),

    //get data
    getEventTypes: async (template: string) => {
      try {
        if (get().eventTypes.length === 0) {
          // Set loading state
          set({ isLoading: true, error: null });

          // Make API call
          const eventTypes = await api.fetchEventTypes(template);

          // Update state with fetched data
          set((state) => ({
            ...state,
            eventTypes,
            isLoading: false,
          }));
        }
        return get().eventTypes;
      } catch (error) {
        // Handle error
        set((state) => ({
          ...state,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        }));
      }
    },
    getHealthStatuses: async (job: string) => {
      try {
        if (get().healthStatuses.length === 0) {
          // Set loading state
          set({ isLoading: true, error: null });

          // Make API call
          const healthStatuses = await api.fetchHealthStatuses(job);

          // Update state with fetched data
          set((state) => ({
            ...state,
            healthStatuses,
            isLoading: false,
          }));
        }
        return get().healthStatuses;
      } catch (error) {
        // Handle error
        set((state) => ({
          ...state,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        }));
      }
    },

    // Reference data
    jobs: [],
    eventTypes: [],
    healthStatuses: [],
    dimensionPackers: [],

    setJobs: (jobs) => set({ jobs }),
    setEventTypes: (eventTypes) => set({ eventTypes }),
    setHealthStatuses: (healthStatuses) => set({ healthStatuses }),
    setDimensionPackers: (dimensionPackers) => set({ dimensionPackers }),

    // Loading states
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),

    // Error handling
    error: null,
    setError: (error) => set({ error }),

    // Clear form
    clearForm: () =>
      set({
        formData: initialFormData,
        error: null,
      }),
  })
);
