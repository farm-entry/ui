import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { maintenanceService as api } from "../services/maintenanceApi";
import { MaintenanceAsset, MaintenanceAssetDetails, MaintenanceFormData } from "./types/maintenance";

interface MaintenanceState {
  maintenanceAssets: MaintenanceAsset[];
  selectedMaintenanceAsset: MaintenanceAssetDetails | null;
  isLoading: boolean;
  error: string | null;
}

interface MaintenanceActions {
  getMaintenanceAssets: () => Promise<MaintenanceAsset[] | undefined>;
  setMaintenanceAssets: (assets: MaintenanceAsset[]) => void;
  clearMaintenanceAssets: () => void;
  getMaintenanceAssetDetails: (number: string) => Promise<MaintenanceAssetDetails | null>;
  setSelectedMaintenanceAsset: (asset: MaintenanceAssetDetails | null) => void;
  clearSelectedMaintenanceAsset: () => void;
  postMaintenance: (data: MaintenanceFormData) => Promise<void>;
  reset: () => void;
}

type MaintenanceStore = MaintenanceState & MaintenanceActions;

export const useMaintenanceStore = create<MaintenanceStore>()(
  devtools(
    (set, get) => ({
      maintenanceAssets: [],
      selectedMaintenanceAsset: null,
      isLoading: false,
      error: null,

      getMaintenanceAssets: async () => {
        try {
          if (get().maintenanceAssets.length > 0) return get().maintenanceAssets;

          set((state) => ({ ...state, isLoading: true, error: null }));
          const maintenanceAssets = await api.getMaintenanceAssets();
          set((state) => ({ ...state, maintenanceAssets, isLoading: false }));
          return get().maintenanceAssets;
        } catch (error) {
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false
          }));
          return undefined;
        }
      },

      setMaintenanceAssets: (maintenanceAssets) => {
        set((state) => ({ ...state, maintenanceAssets }));
      },

      clearMaintenanceAssets: () => {
        set((state) => ({ ...state, maintenanceAssets: [], error: null, isLoading: false }));
      },

      getMaintenanceAssetDetails: async (number) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));
          const selectedMaintenanceAsset = await api.getMaintenanceAssetDetails(number);
          set((state) => ({ ...state, selectedMaintenanceAsset, isLoading: false }));
          return selectedMaintenanceAsset;
        } catch (error) {
          set((state) => ({
            ...state,
            selectedMaintenanceAsset: null,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false
          }));
          return null;
        }
      },

      setSelectedMaintenanceAsset: (asset) => {
        set((state) => ({ ...state, selectedMaintenanceAsset: asset }));
      },

      clearSelectedMaintenanceAsset: () => {
        set((state) => ({ ...state, selectedMaintenanceAsset: null }));
      },

      reset: () => set({ maintenanceAssets: [], selectedMaintenanceAsset: null, isLoading: false, error: null }),

      postMaintenance: async (data) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));
          await api.postMaintenance(data);

          if (data.asset) {
            const updatedAsset = await api.getMaintenanceAssetDetails(data.asset);
            set((state) => ({ ...state, selectedMaintenanceAsset: updatedAsset, isLoading: false }));
          } else {
            set((state) => ({ ...state, isLoading: false }));
          }
        } catch (error) {
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false
          }));
          throw error;
        }
      }
    }),
    { name: "maintenance-store" }
  )
);
