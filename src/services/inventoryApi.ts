import inventoryItemsData from "../mock/inventoryItems.json";
import inventoryLookupData from "../mock/inventoryLookup.json";
import { InventoryItem, InventoryJob, InventoryLocation } from "../store/types/inventory";

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
}

export const inventoryService = new InventoryService();
