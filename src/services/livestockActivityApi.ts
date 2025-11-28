import {
  ActivityType,
  EventType,
  FormData,
  HealthStatus,
  Job,
} from "../store/types/livestockActivity";
import { HandleError } from "./handleError";
import { delay } from "./localConfig";

// Mock data based on farm-entry GraphQL schema
const mockJobs: Job[] = [
  {
    number: "2401",
    description: "Nursery Group 2401",
    healthStatus: { code: "HEALTHY", description: "Healthy", color: "green" },
    inventory: 450,
    deadQuantity: 5,
    startQuantity: 455,
  },
  {
    number: "2402",
    description: "Nursery Group 2402",
    healthStatus: {
      code: "TREATMENT",
      description: "Treatment",
      color: "yellow",
    },
    inventory: 380,
    deadQuantity: 8,
    startQuantity: 388,
  },
  {
    number: "2403",
    description: "Finisher Group 2403",
    healthStatus: { code: "HEALTHY", description: "Healthy", color: "green" },
    inventory: 220,
    deadQuantity: 2,
    startQuantity: 222,
  },
  {
    number: "2404",
    description: "Finisher Group 2404",
    healthStatus: { code: "SICK", description: "Sick", color: "red" },
    inventory: 195,
    deadQuantity: 15,
    startQuantity: 210,
  },
];

const mockEventTypes: EventType[] = [
  { Code: "WEAN_STD", Description: "Standard Wean" },
  { Code: "WEAN_EARLY", Description: "Early Wean" },
  { Code: "MORT_STD", Description: "Standard Mortality" },
  { Code: "MOVE_STD", Description: "Standard Move" },
  { Code: "MOVE_TREATMENT", Description: "Move to Treatment" },
  { Code: "GRADE_MARKET", Description: "Grade to Market" },
  { Code: "ADJ_POS", Description: "Positive Adjustment" },
  { Code: "ADJ_NEG", Description: "Negative Adjustment" },
  { Code: "PURCH_STD", Description: "Standard Purchase" },
  { Code: "PURCH_REPLACEMENT", Description: "Replacement Purchase" },
  { Code: "SHIP_MARKET", Description: "Ship to Market" },
  { Code: "SHIP_PROCESSOR", Description: "Ship to Processor" },
];

const mockHealthStatuses: HealthStatus[] = [
  { code: "HEALTHY", description: "Healthy", color: "green" },
  { code: "TREATMENT", description: "Treatment", color: "yellow" },
  { code: "SICK", description: "Sick", color: "red" },
  { code: "QUARANTINE", description: "Quarantine", color: "orange" },
];

class LivestockActivityApi {
  async fetchJobs(): Promise<Job[]> {
    await delay(500); // Simulate API delay
    return mockJobs;
  }

  async fetchEventTypes(template: string): Promise<EventType[]> {
    try {
      console.log("Fetching event types from API...");

      const response = await fetch(
        `/api/livestock/events?template=${template}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        await new HandleError().handleApiError(
          response,
          "LivestockActivityApi.fetchEventTypes"
        );
      }

      const data: any[] = await response.json();

      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        // Re-throw API errors as-is
        throw error;
      }

      // Handle unexpected errors
      const apiError = new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch posting groups",
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      console.error("Unexpected error fetching posting groups:", error);
      throw apiError;
    }
  }

  async fetchHealthStatuses(job: string): Promise<HealthStatus[]> {
    await delay(200);
    return mockHealthStatuses;
  }

  async saveFormData(
    data: FormData
  ): Promise<{ success: boolean; message: string }> {
    await delay(800);

    // Simulate occasional failure for testing
    if (Math.random() < 0.1) {
      throw new Error("Failed to save form data - please try again");
    }

    console.log("Saving form data:", data);

    return {
      success: true,
      message: "Form data saved successfully",
    };
  }

  // REST endpoints that would connect to farm-entry backend
  async submitToFarmEntry(
    data: FormData
  ): Promise<{ success: boolean; message: string }> {
    // This would be the actual REST call to farm-entry backend
    // For now, just simulate the API call
    await delay(1000);

    console.log("Submitting to farm-entry backend:", data);

    return {
      success: true,
      message: `${data.activityType} activity submitted successfully`,
    };
  }
}

export const livestockActivityApi = new LivestockActivityApi();
