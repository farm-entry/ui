import { ScorecardPage } from "../store/types/scorecards";
import { HandleError } from "./handleError";

// Type definitions based on OpenAPI spec

export interface ScorecardType extends Record<string, any> {
  code: string;
  description: string;
}


export interface ScorecardElementData {
  elementId: string;
  numericValue?: number;
  stringValue?: string;
}

export interface ScorecardInput {
  postingGroup: string;
  data: ScorecardElementData[];
}

class ScorecardService {
  /**
   * Get scorecard types for a job
   * GET /api/scorecard/types?job={job}
   */
  async getScorecardTypes(job: string): Promise<ScorecardType[]> {
    try {
      console.log(`Fetching scorecard types for job ${job}...`);

      const response = await fetch(`/api/scorecard/types?job=${encodeURIComponent(job)}`, {
        method: "GET",
        credentials: "include"
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
  async getScorecardConfig(jobNo: string, postingGroup: string): Promise<ScorecardPage> {
    try {
      console.log(`Fetching scorecard config for job ${jobNo}, posting group ${postingGroup}...`);

      const response = await fetch(
        `/api/scorecard/${encodeURIComponent(jobNo)}?postingGroup=${encodeURIComponent(postingGroup)}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      if (!response.ok) {
        await new HandleError().handleApiError(response, "ScorecardService.getScorecardConfig");
      }

      const data: ScorecardPage = await response.json();
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
  async postScorecard(jobNo: string, input: ScorecardInput): Promise<void> {
    try {
      console.log(`Posting scorecard for job ${jobNo}:`, input);

      const response = await fetch(`/api/scorecard/${encodeURIComponent(jobNo)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
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
   * Auto-post scorecard journals
   * POST /api/scorecard/auto-post
   */
  async autoPostScorecard(postingGroup: string): Promise<void> {
    try {
      console.log(`Auto-posting scorecard for posting group ${postingGroup}...`);

      const response = await fetch("/api/scorecard/auto-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
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
export const scorecardService = new ScorecardService();
