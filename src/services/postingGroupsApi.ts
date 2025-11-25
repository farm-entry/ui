import { HandleError } from "./handleError";

// Types for Posting Groups based on NAV data
export interface PostingGroup {
    deadQuantity: number;
    description: string;
    inventory: number;
    number: string;
    postingGroup: string;
    startDate: string;
    startQuantity: number;
    status: string;
}

class PostingGroupsApi {
    /* Fetch all posting groups * Currently returns static data, but can be extended to fetch from NAV */
    async fetchAllPostingGroups(): Promise<PostingGroup[]> {
        try {
            console.log('Fetching all posting groups from API...');

            const response = await fetch(`/api/livestock/jobs`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                await new HandleError().handleApiError(response, 'PostingGroupsApi.fetchAllPostingGroups');
            }

            const data: PostingGroup[] = await response.json();

            return data;


        } catch (error) {
            if (error && typeof error === 'object' && 'code' in error) {
                // Re-throw API errors as-is
                throw error;
            }

            // Handle unexpected errors
            const apiError = new HandleError().createError(
                'FETCH_ERROR',
                'Failed to fetch posting groups',
                error instanceof Error ? error.message : 'Unknown error occurred'
            );

            console.error('Unexpected error fetching posting groups:', error);
            throw apiError;
        }
    }

    /* Fetch active posting groups only */
    async fetchActivePostingGroups(): Promise<PostingGroup[]> {
        try {
            const allGroups = await this.fetchAllPostingGroups();
            // return allGroups.filter(group => group.status === 'Open');
            return allGroups
        } catch (error) {
            const apiError = new HandleError().createError(
                'ACTIVE_FETCH_ERROR',
                'Failed to fetch active posting groups',
                error instanceof Error ? error.message : 'Unknown error occurred'
            );

            console.error('Error fetching active posting groups:', error);
            throw apiError;
        }
    }
}

// Export singleton instance
export const postingGroupsApi = new PostingGroupsApi();
