import { MaintenanceAsset, MaintenanceAssetDetails, MaintenanceFormData } from "../store/types/maintenance";
import { apiFetch } from "./apiFetch";
import { HandleError } from "./handleError";

class MaintenanceService {
  async getMaintenanceAssets(): Promise<MaintenanceAsset[]> {
    try {
      const response = await apiFetch("/api/maintenance/assets", { method: "GET" });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "MaintenanceService.getMaintenanceAssets");
      }

      return response.json();
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) throw error;
      throw new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch maintenance assets",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  async getMaintenanceAssetDetails(number: string): Promise<MaintenanceAssetDetails | null> {
    try {
      const response = await apiFetch(`/api/maintenance/${number}`, { method: "GET" });

      if (!response.ok) {
        if (response.status === 404) return null;
        await new HandleError().handleApiError(response, "MaintenanceService.getMaintenanceAssetDetails");
      }

      return response.json();
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) throw error;
      throw new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch maintenance asset details",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  async postMaintenance(data: MaintenanceFormData): Promise<void> {
    try {
      const response = await apiFetch("/api/maintenance", {
        method: "POST",
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "MaintenanceService.postMaintenance");
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) throw error;
      throw new HandleError().createError(
        "POST_ERROR",
        "Failed to post maintenance entry",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
}

export const maintenanceService = new MaintenanceService();
