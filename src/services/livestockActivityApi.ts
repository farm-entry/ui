import {
  EventType,
  HealthStatus,
  FormData as LivestockFormData
} from "../store/types/livestockActivity";
import { HandleError } from "./handleError";
import { delay } from "./localConfig";
import { mockHealthStatuses, mockLivestockGradeOffEventTypes, mockLivestockMortalityEventTypes } from "../mock";

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

  async fetchEventTypes(template: string): Promise<{ journals: EventType[], healthStatuses: HealthStatus[] }> {
    if (template === "MORTALITY") return { journals: mockLivestockMortalityEventTypes, healthStatuses: mockHealthStatuses };
    if (template === "GRADEOFF") return { journals: mockLivestockGradeOffEventTypes as EventType[], healthStatuses: mockHealthStatuses };

    try {
      console.log("Fetching event types from API...");

      const response = await fetch(`/api/livestock/events?template=${template}`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "LivestockActivityApi.fetchEventTypes");
      }

      const data: { journals: EventType[], healthStatuses: HealthStatus[] } = await response.json();

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

}

export const livestockActivityApi = new LivestockActivityApi();
