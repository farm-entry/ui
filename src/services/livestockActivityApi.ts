import {
  mockHealthStatuses,
  mockLivestockGradeOffEventTypes,
  mockLivestockMortalityEventTypes
} from "../mock";
import type { ActivityType, FormData as LivestockFormData } from "../store/types/forms";
import { EventType, HealthStatus } from "../store/types/livestockActivity";
import { HandleError } from "./handleError";

class LivestockActivityApi {
  async postLivestockEvent(data: LivestockFormData): Promise<void> {
    console.log({ data });
    console.log({ data: JSON.stringify(data) });
    const response = await fetch(`/api/livestock`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await new HandleError().handleApiError(response, "LivestockActivityApi.postLivestockEvent");
    }
  }

  async fetchEventTypes(
    template: string
  ): Promise<{ events: EventType[]; healthStatuses: HealthStatus[]; template: ActivityType }> {
    try {
      console.log("Fetching event types from API...");

      const response = await fetch(`/api/livestock/events?template=${template}`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "LivestockActivityApi.fetchEventTypes");
      }

      const data: { events: EventType[]; healthStatuses: HealthStatus[]; template: ActivityType } =
        await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        // Re-throw API errors as-is
        throw error;
      }

      // Handle unexpected errors
      const apiError = new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch event types",
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      console.error("Unexpected error fetching event types:", error);
      throw apiError;
    }
  }
}

export const livestockActivityApi = new LivestockActivityApi();
