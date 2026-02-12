import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { fuelService as api } from "../services/fuelApi";
import { FuelAsset, FuelAssetDetails } from "./types/fuel";

interface FuelState {
  fuelAssets: FuelAsset[];
  selectedFuelAsset: FuelAssetDetails | null;
  isLoading: boolean;
  error: string | null;
}

interface FuelActions {
  getFuelAssets: () => Promise<FuelAsset[] | undefined>;
  setFuelAssets: (fuel: FuelAsset[]) => void;
  clearFuelAssets: () => void;
  getFuelAssetDetails: (number: string) => Promise<FuelAsset | null>;
  setSelectedFuelAsset: (asset: FuelAsset | null) => void;
  clearSelectedFuelAsset: () => void;
}

type FuelStore = FuelState & FuelActions;

export const useFuelStore = create<FuelStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      fuelAssets: [],
      selectedFuelAsset: null,
      isLoading: false,
      error: null,

      // Actions
      getFuelAssets: async () => {
        try {

          // Only fetch if we don't have data yet
          if (!(get().fuelAssets.length > 0)) {
            set((state) => ({ ...state, isLoading: true, error: null }));

            const fuelAssets = await api.getFuelAssets();

            set((state) => ({
              ...state,
              fuelAssets,
              isLoading: false,
            }));
          }

          return get().fuelAssets;
        } catch (error) {
          console.log("Caught error while fetching fuel assets:", error);
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false,
          }));
          return undefined;
        }
      },

      setFuelAssets: (fuelAssets: FuelAsset[]) => {
        set((state) => ({ ...state, fuelAssets }));
      },

      clearFuelAssets: () => {
        set((state) => ({
          ...state,
          fuel: [],
          error: null,
          isLoading: false,
        }));
      },

      getFuelAssetDetails: async (number: string) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          const fuelAsset = await api.getFuelAssetDetails(number);

          set((state) => ({
            ...state,
            selectedFuelAsset: fuelAsset,
            isLoading: false,
          }));

          return fuelAsset;
        } catch (error) {
          console.log("Caught error while fetching fuel asset:", error);
          set((state) => ({
            ...state,
            selectedFuelAsset: null,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isLoading: false,
          }));
          return null;
        }
      },

      setSelectedFuelAsset: (asset: FuelAssetDetails | null) => {
        set((state) => ({ ...state, selectedFuelAsset: asset }));
      },

      clearSelectedFuelAsset: () => {
        set((state) => ({ ...state, selectedFuelAsset: null }));
      }
    }),
    {
      name: "fuel-store",
    }
  )
);