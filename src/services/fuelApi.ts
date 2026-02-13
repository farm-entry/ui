import { HandleError } from "./handleError";
import { FuelAsset, FuelAssetDetails, FuelFormData } from "../store/types/fuel";

class FuelService {
  /* Fetch all fuel assets */
  async getFuelAssets(): Promise<FuelAsset[]> {
    try {
      console.log("Fetching fuel assets from API...");

      const response = await fetch(`/api/fuel/assets`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "FuelService.getFuelAssets");
      }

      const data: FuelAsset[] = await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        // Re-throw API errors as-is
        throw error;
      }

      // Handle unexpected errors
      const apiError = new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch fuel assets",
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      console.error("Unexpected error fetching fuel assets:", error);
      throw apiError;
    }
  }

  /* Fetch a single fuel asset by number */
  async getFuelAssetDetails(number: string): Promise<FuelAssetDetails | null> {
    try {
      console.log(`Fetching fuel asset ${number} from API...`);

      const response = await fetch(`/api/fuel/${number}`, {
        method: "GET",
        credentials: "include"
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
        // Re-throw API errors as-is
        throw error;
      }

      // Handle unexpected errors
      const apiError = new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch fuel asset details",
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      console.error("Unexpected error fetching fuel asset:", error);
      throw apiError;
    }
  }

  /* Post a new fuel entry */
  async postFuel(data: FuelFormData): Promise<void> {
    try {
      console.log("Posting fuel entry:", data);

      const response = await fetch(`/api/fuel`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "FuelService.postFuel");
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        // Re-throw API errors as-is
        throw error;
      }

      // Handle unexpected errors
      const apiError = new HandleError().createError(
        "POST_ERROR",
        "Failed to post fuel entry",
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      console.error("Unexpected error posting fuel entry:", error);
      throw apiError;
    }
  }

  /* Auto-post fuel maintenance entries */
  async autoPostFuelMaintenance(): Promise<void> {
    try {
      console.log("Auto-posting fuel maintenance...");

      const response = await fetch(`/api/fuel/auto-post`, {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "FuelService.autoPostFuelMaintenance");
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        // Re-throw API errors as-is
        throw error;
      }

      // Handle unexpected errors
      const apiError = new HandleError().createError(
        "POST_ERROR",
        "Failed to auto-post fuel maintenance",
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      console.error("Unexpected error auto-posting fuel maintenance:", error);
      throw apiError;
    }
  }
}

// Export a singleton instance
export const fuelService = new FuelService();