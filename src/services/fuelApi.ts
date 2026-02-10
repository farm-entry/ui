import { HandleError } from "./handleError";
import { FuelAsset, FuelAssetDetails } from "../store/types/fuel";
import fuelAssetDetails from "../mock/fuelAsset.json";
import fuelData from "../mock/fuelAssets.json";

class FuelService {
  /* Fetch all fuel assets * Currently returns static mock data */
  async getFuelAssets(): Promise<FuelAsset[]> {
    try {
      console.log("Fetching fuel assets from mock data...");

      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return fuelData as FuelAsset[];
    } catch (error) {
      console.log("Caught error while fetching fuel assets:", error);
      throw new HandleError().handleApiError(error as any, "FuelService.getFuelAssets");
    }
  }

  /* Fetch a single fuel asset by number */
  async getFuelAssetDetails(number: string): Promise<FuelAssetDetails | null> {
    try {
      console.log(`Fetching fuel asset ${number} from mock data...`);

      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const foundAsset = fuelAssetDetails as FuelAssetDetails;

      return foundAsset || null;
    } catch (error) {
      console.log("Caught error while fetching fuel asset:", error);
      throw new HandleError().handleApiError(error as any, "FuelService.getFuelAsset");
    }
  }
}

// Export a singleton instance
export const fuelService = new FuelService();