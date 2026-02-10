import maintenanceAssetDetails from "../mock/maintenanceAsset.json";
import maintenanceData from "../mock/maintenanceAssets.json";
import { MaintenanceAsset, MaintenanceAssetDetails } from "../store/types/maintenance";
import { HandleError } from "./handleError";

class MaintenanceService {
    /* Fetch all maintenance assets * Currently returns static mock data */
    async getMaintenanceAssets(): Promise<MaintenanceAsset[]> {
        try {
            console.log("Fetching maintenance assets from mock data...");

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return maintenanceData as MaintenanceAsset[];
        } catch (error) {
            console.log("Caught error while fetching maintenance assets:", error);
            throw new HandleError().handleApiError(error as any, "MaintenanceService.getMaintenanceAssets");
        }
    }

    /* Fetch a single maintenance asset by number */
    async getMaintenanceAssetDetails(number: string): Promise<MaintenanceAssetDetails | null> {
        try {
            console.log(`Fetching maintenance asset ${number} from mock data...`);

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            const foundAsset = maintenanceAssetDetails as MaintenanceAssetDetails;

            return foundAsset || null;
        } catch (error) {
            console.log("Caught error while fetching maintenance asset:", error);
            throw new HandleError().handleApiError(error as any, "MaintenanceService.getMaintenanceAsset");
        }
    }
}

// Export a singleton instance
export const maintenanceService = new MaintenanceService();