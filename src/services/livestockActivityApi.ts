import {
  EventType,
  FormData,
  HealthStatus
} from "../store/types/livestockActivity";
import { HandleError } from "./handleError";
import { delay } from "./localConfig";


const mockHealthStatuses: HealthStatus[] = [
  {
    "code": "GOOD",
    "description": "Solid overall health",
    "color": null,
  },
  {
    "code": "GUT",
    "description": "Gut, scours, prolapse",
    "color": null,
  },
  {
    "code": "LAME",
    "description": "Structure, lameness",
    "color": null,
  },
  {
    "code": "MEDS",
    "description": "Heavy use of antibiotics",
    "color": null,
  },
  {
    "code": "PERF",
    "description": "Picture perfect health",
    "color": null,
  },
  {
    "code": "PFIN",
    "description": "PRRS @ finisher",
    "color": null,
  },
  {
    "code": "PNUR",
    "description": "PRRS @ nursery",
    "color": null,
  },
  {
    "code": "PSOW",
    "description": "PRRS @ wean",
    "color": null,
  },
  {
    "code": "RESP",
    "description": "Excessive coughing, respiratory",
    "color": null,
  },
  {
    "code": "VICE",
    "description": "Tail, ear, and fighting",
    "color": null,
  }
];

class LivestockActivityApi {
  async postLivestockEvent(data: FormData): Promise<void> {
    const response = await fetch(
      `/api/livestock`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      await new HandleError().handleApiError(
        response,
        "LivestockActivityApi.postLivestockEvent"
      );
    }
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

  async fetchHealthStatuses(): Promise<HealthStatus[]> {
    await delay(200);
    return mockHealthStatuses;
  }

}

export const livestockActivityApi = new LivestockActivityApi();
