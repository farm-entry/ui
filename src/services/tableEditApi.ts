import { apiFetch } from "./apiFetch";
import { HandleError } from "./handleError";
import {
  TableEditJob,
  TableEditJobDetailResponse,
  TableEditJobFormData
} from "../store/types/tableEdit";

class TableEditService {
  /* Fetch all jobs for selection */
  async getJobs(): Promise<TableEditJob[]> {
    try {
      const response = await apiFetch(`/api/table-edit/jobs`, {
        method: "GET"
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "TableEditService.getJobs");
      }

      const data: TableEditJob[] = await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch jobs",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  /* Fetch full job detail by number */
  async getJobDetail(number: string): Promise<TableEditJobDetailResponse | null> {
    try {
      const response = await apiFetch(`/api/table-edit/jobs/${number}`, {
        method: "GET"
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        await new HandleError().handleApiError(response, "TableEditService.getJobDetail");
      }

      const data: TableEditJobDetailResponse = await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "FETCH_ERROR",
        "Failed to fetch job detail",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  /* Patch an existing job header */
  async patchJob(
    number: string,
    data: Omit<TableEditJobFormData, "form" | "jobNumber">
  ): Promise<void> {
    try {
      const response = await apiFetch(`/api/table-edit/jobs/${number}`, {
        method: "PATCH",
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        await new HandleError().handleApiError(response, "TableEditService.patchJob");
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      throw new HandleError().createError(
        "PATCH_ERROR",
        "Failed to update job header",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
}

// Export a singleton instance
export const tableEditService = new TableEditService();
