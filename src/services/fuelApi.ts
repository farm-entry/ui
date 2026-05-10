import { apiFetch } from "./apiFetch";
import { HandleError } from "./handleError";
import { FuelAsset, FuelAssetDetails, FuelFormData } from "../store/types/fuel";

class FuelService {
  /* Fetch all fuel assets */
  async getFuelAssets(): Promise<FuelAsset[]> {
    try {
      const response = await apiFetch(`/api/fuel/assets`, {
        method: "GET"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "FuelService.getFuelAssets");
      }

      const data: FuelAsset[] = await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch fuel assets",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  /* Fetch a single fuel asset by number */
  async getFuelAssetDetails(number: string): Promise<FuelAssetDetails | null> {
    try {
      const response = await apiFetch(`/api/fuel/${number}`, {
        method: "GET"
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        await new HandleError().handleApiError(response, "FuelService.getFuelAssetDetails");
      }

      const data: FuelAssetDetails = await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch fuel asset details",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  /* Post a new fuel entry */
  async postFuel(data: FuelFormData): Promise<void> {
    try {
      const response = await apiFetch(`/api/fuel`, {
        method: "POST",
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "FuelService.postFuel");
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "POST_ERROR",
        "Failed to post fuel entry",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  /* Auto-post fuel maintenance entries */
  async autoPostFuelMaintenance(): Promise<void> {
    try {
      const response = await apiFetch(`/api/fuel/auto-post`, {
        method: "POST"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "FuelService.autoPostFuelMaintenance");
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "POST_ERROR",
        "Failed to auto-post fuel maintenance",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
}

// Export a singleton instance
export const fuelService = new FuelService();