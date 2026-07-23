import { apiFetch } from "./apiFetch";
import { HandleError } from "./handleError";
import {
  InventoryConsumptionFormData,
  InventoryItem,
  InventoryJob,
  InventoryLocation,
  InventoryLineItem
} from "../store/types/inventory";

interface LocationsAndJobsResponse {
  locations: InventoryLocation[];
  jobs: InventoryJob[];
}

class InventoryService {
  async getLocationsAndJobs(): Promise<LocationsAndJobsResponse> {
    try {
      const [locationsResponse, jobsResponse] = await Promise.all([
        apiFetch("/api/user/filters/locations", { method: "GET" }),
        apiFetch("/api/jobs", { method: "GET" })
      ]);

      if (!locationsResponse.ok) {
        await new HandleError().handleApiError(
          locationsResponse,
          "InventoryService.getLocationsAndJobs"
        );
      }
      if (!jobsResponse.ok) {
        await new HandleError().handleApiError(
          jobsResponse,
          "InventoryService.getLocationsAndJobs"
        );
      }

      const locations: InventoryLocation[] = await locationsResponse.json();
      const jobs: InventoryJob[] = await jobsResponse.json();

      return { locations, jobs };
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch locations and jobs",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  async getItems(locationCode: string, _jobNo: string): Promise<InventoryItem[]> {
    try {
      const response = await apiFetch(
        `/api/inventory/items/${encodeURIComponent(locationCode)}`,
        { method: "GET" }
      );

      if (!response.ok) {
        await new HandleError().handleApiError(response, "InventoryService.getItems");
      }

      const data: InventoryItem[] = await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch inventory items",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  async postInventory(
    formData: InventoryConsumptionFormData,
    lineItems: InventoryLineItem[]
  ): Promise<void> {
    try {
      const payload = {
        location: formData.location,
        group: formData.group,
        postingDate: formData.postingDate,
        itemList: lineItems.map((li) => ({
          item: {
            number: li.itemNumber,
            description: li.description,
            type: li.type,
            cost: li.cost,
            unit: li.unit
          },
          quantity: li.quantity,
          acres: 0
        })),
        comments: formData.comments
      };

      const response = await apiFetch("/api/inventory", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "InventoryService.postInventory");
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "POST_ERROR",
        "Failed to post inventory entry",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
}

export const inventoryService = new InventoryService();
