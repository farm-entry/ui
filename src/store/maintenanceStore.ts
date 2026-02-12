import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { maintenanceService as api } from "../services/maintenanceApi";
import { MaintenanceAsset, MaintenanceAssetDetails } from "./types/maintenance";

interface MaintenanceState {
  maintenanceAssets: MaintenanceAsset[];
  selectedMaintenanceAsset: MaintenanceAssetDetails | null;
  isLoading: boolean;
  error: string | null;
}

interface MaintenanceActions {
  getMaintenanceAssets: () => Promise<MaintenanceAsset[] | undefined>;
  setMaintenanceAssets: (maintenance: MaintenanceAsset[]) => void;
  clearMaintenanceAssets: () => void;
  getMaintenanceAssetDetails: (number: string) => Promise<MaintenanceAsset | null>;
  setSelectedMaintenanceAsset: (asset: MaintenanceAsset | null) => void;
  clearSelectedMaintenanceAsset: () => void;
}

type MaintenanceStore = MaintenanceState & MaintenanceActions;

export const useMaintenanceStore = create<MaintenanceStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      maintenanceAssets: [],
      selectedMaintenanceAsset: null,
      isLoading: false,
      error: null,

      // Actions
      getMaintenanceAssets: async () => {
        try {

          // Only fetch if we don't have data yet
          if (!(get().maintenanceAssets.length > 0)) {
            set((state) => ({ ...state, isLoading: true, error: null }));

            const maintenanceAssets = await api.getMaintenanceAssets();

            set((state) => ({
              ...state,
              maintenanceAssets,
              isLoading: false,
            }));
          }

          return get().maintenanceAssets;
        } catch (error) {
          console.log("Caught error while fetching maintenance assets:", error);
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false,
          }));
          return undefined;
        }
      },

      setMaintenanceAssets: (maintenanceAssets: MaintenanceAsset[]) => {
        set((state) => ({ ...state, maintenanceAssets }));
      },

      clearMaintenanceAssets: () => {
        set((state) => ({
          ...state,
          maintenance: [],
          error: null,
          isLoading: false,
        }));
      },

      getMaintenanceAssetDetails: async (number: string) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          const maintenanceAsset = await api.getMaintenanceAssetDetails(number);

          set((state) => ({
            ...state,
            selectedMaintenanceAsset: maintenanceAsset,
            isLoading: false,
          }));

          return maintenanceAsset;
        } catch (error) {
          console.log("Caught error while fetching maintenance asset:", error);
          set((state) => ({
            ...state,
            selectedMaintenanceAsset: null,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false,
          }));
          return null;
        }
      },

      setSelectedMaintenanceAsset: (asset: MaintenanceAssetDetails | null) => {
        set((state) => ({ ...state, selectedMaintenanceAsset: asset }));
      },

      clearSelectedMaintenanceAsset: () => {
        set((state) => ({ ...state, selectedMaintenanceAsset: null }));
      }
    }),
    {
      name: "maintenance-store",
    }
  )
);