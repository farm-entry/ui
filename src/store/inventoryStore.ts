import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { inventoryService as api } from "../services/inventoryApi";
import { InventoryConsumptionFormData, InventoryItem, InventoryJob, InventoryLineItem, InventoryLocation } from "./types/inventory";
import { applyLocationFilter } from "../utils/filterHelpers";
import { useUserStore } from "./userStore";

interface InventoryState {
  locations: InventoryLocation[];
  jobs: InventoryJob[];
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
}

interface InventoryActions {
  getLocationsAndJobs: () => Promise<void>;
  setLocations: (locations: InventoryLocation[]) => void;
  setJobs: (jobs: InventoryJob[]) => void;
  getItems: (locationCode: string, jobNo: string) => Promise<void>;
  setItems: (items: InventoryItem[]) => void;
  postInventory: (formData: InventoryConsumptionFormData, lineItems: InventoryLineItem[]) => Promise<void>;
}

type InventoryStore = InventoryState & InventoryActions;

export const useInventoryStore = create<InventoryStore>()(
  devtools(
    (set) => ({
      locations: [],
      jobs: [],
      items: [],
      isLoading: false,
      error: null,

      getLocationsAndJobs: async () => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));
          const { locations, jobs } = await api.getLocationsAndJobs();
          set((state) => ({ ...state, locations, jobs, isLoading: false }));
        } catch (error) {
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false
          }));
        }
      },

      setLocations: (locations) => set((state) => ({ ...state, locations })),

      setJobs: (jobs) => set((state) => ({ ...state, jobs })),

      getItems: async (locationCode, jobNo) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));
          const items = await api.getItems(locationCode, jobNo);
          set((state) => ({ ...state, items, isLoading: false }));
        } catch (error) {
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false
          }));
        }
      },

      setItems: (items) => set((state) => ({ ...state, items })),

      postInventory: async (formData, lineItems) => {
        await api.postInventory(formData, lineItems);
      }
    }),
    { name: "inventory-store" }
  )
);

/**
 * Returns inventory locations filtered by the current user's locations filter settings.
 * Drop-in replacement for useInventoryStore(state => state.locations) in components
 * that should respect the user's filter preferences.
 */
export function useFilteredLocations(): InventoryLocation[] {
  const locations = useInventoryStore(state => state.locations);
  const filter = useUserStore(state => state.filters.locations);
  return applyLocationFilter(locations, filter);
}
