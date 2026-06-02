import inventoryItemsData from "../mock/inventoryItems.json";
import inventoryLookupData from "../mock/inventoryLookup.json";
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
    await new Promise((resolve) => setTimeout(resolve, 300));
    return inventoryLookupData as LocationsAndJobsResponse;
  }

  async getItems(_locationCode: string, _jobNo: string): Promise<InventoryItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return inventoryItemsData as InventoryItem[];
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
