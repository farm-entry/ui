import { apiFetch } from "./apiFetch";
import { HandleError } from "./handleError";

export interface PostingGroup extends Record<string, unknown> {
  number: string;
  description: string;
  inventory: number;
  deadQuantity: number;
  startDate: string;
  location: string;
  status: string;
  startQuantity: number;
}

// Detailed Posting Group with nested objects
export interface PostingGroupDetails extends Record<string, unknown> {
  number: string;
  description: string;
  personResponsible: {
    No: string;
    Name: string;
    Resource_Group_No: string;
    Type: string;
    Unit_Price: number;
  };
  inventory: number;
  deadQuantity: number;
  startDate: string;
  location: {
    Code: string;
    Name: string;
  };
  projectManager: {
    User_Security_ID: string;
    User_Name: string;
    License_Type: string;
    Full_Name: string;
  };
  status: string;
  startQuantity: number;
  postingGroup: string;
  healthStatus: {
    Code: string;
    Description: string;
  };
}

class PostingGroupsApi {
  /* Fetch all posting groups * Currently returns static data, but can be extended to fetch from NAV */
  async fetchAllPostingGroups(): Promise<PostingGroup[]> {
    try {
      console.log("Fetching all posting groups from API...");

      const response = await apiFetch(`/api/livestock/jobs`, {
        method: "GET",
      });

      if (!response.ok) {
        await new HandleError().handleApiError(
          response,
          "PostingGroupsApi.fetchAllPostingGroups"
        );
      }

      const data: PostingGroup[] = await response.json();

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

  /* Fetch single posting group */
  async fetchPostingGroup(group: string): Promise<PostingGroupDetails> {
    try {
      console.log("Fetching posting group from API:", group);

      const response = await apiFetch(`/api/livestock/jobs/${group}`, {
        method: "GET",
      });

      if (!response.ok) {
        await new HandleError().handleApiError(
          response,
          "PostingGroupsApi.fetchPostingGroup"
        );
      }

      const data: PostingGroupDetails = await response.json();

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

// Export singleton instance
export const postingGroupsApi = new PostingGroupsApi();
