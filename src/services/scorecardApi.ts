import { ScorecardConfig, ScorecardFormData, ScorecardResources, ScorecardType } from "../store/types/scorecards";
import { apiFetch } from "./apiFetch";
import { HandleError } from "./handleError";

class ScorecardApi {
  /**
   * Get scorecard types for a job
   * GET /api/scorecard/types?job={job}
   */
  async getScorecardTypes(job: string): Promise<ScorecardType[]> {
    try {
      console.log(`Fetching scorecard types for job ${job}...`);

      const response = await apiFetch(`/api/scorecard/types?job=${encodeURIComponent(job)}`, {
        method: "GET"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "ScorecardService.getScorecardTypes");
      }

      const data: ScorecardType[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching scorecard types:", error);
      throw error;
    }
  }

  /**
   * Get scorecard configuration for a job
   * GET /api/scorecard/{jobNo}?postingGroup={postingGroup}
   */
  async getScorecardConfig(jobNo: string, postingGroup: string): Promise<ScorecardConfig> {
    try {
      console.log(`Fetching scorecard config for job ${jobNo}, posting group ${postingGroup}...`);

      const response = await apiFetch(
        `/api/scorecard/${encodeURIComponent(jobNo)}?postingGroup=${encodeURIComponent(postingGroup)}`,
        { method: "GET" }
      );

      if (!response.ok) {
        await new HandleError().handleApiError(response, "ScorecardService.getScorecardConfig");
      }

      const data: ScorecardConfig = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching scorecard config:", error);
      throw error;
    }
  }

  /**
   * Post scorecard to NAV
   * POST /api/scorecard/{jobNo}
   */
  async postScorecard(jobNo: string, input: ScorecardFormData): Promise<void> {
    try {
      console.log(`Posting scorecard for job ${jobNo}:`, input);

      const response = await apiFetch(`/api/scorecard/${encodeURIComponent(jobNo)}`, {
        method: "POST",
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "ScorecardService.postScorecard");
      }

      const result = await response.json();
      console.log("Scorecard posted successfully");
      return result;
    } catch (error) {
      console.error("Error posting scorecard:", error);
      throw error;
    }
  }

  /**
   * Get scorecard resources (users, caretakers)
   * GET /api/scorecard/resources
   */
  async getResources(): Promise<ScorecardResources> {
    try {
      const response = await apiFetch("/api/scorecard/resources", {
        method: "GET"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "ScorecardService.getResources");
      }

      const data: ScorecardResources = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching scorecard resources:", error);
      throw error;
    }
  }

  /**
   * Auto-post scorecard journals
   * POST /api/scorecard/auto-post
   */
  async autoPostScorecard(postingGroup: string): Promise<void> {
    try {
      console.log(`Auto-posting scorecard for posting group ${postingGroup}...`);

      const response = await apiFetch("/api/scorecard/auto-post", {
        method: "POST",
        body: JSON.stringify({ postingGroup })
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "ScorecardService.autoPostScorecard");
      }

      const result = await response.json();
      console.log("Scorecard auto-posted successfully");
      return result;
    } catch (error) {
      console.error("Error auto-posting scorecard:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const scorecardApi = new ScorecardApi();
