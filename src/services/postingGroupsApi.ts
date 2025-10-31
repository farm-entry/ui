import { HandleError } from "./handleError";

// Types for Posting Groups based on NAV data
export interface PostingGroup {
    Job_Posting_Group: string;
    Status: string;
    No: string;
    Description: string;
    Person_Responsible: string;
    Barn_Type: string;
    Location_Code: string;
    Entity: string;
    Cost_Center: string;
    Project_Manager: string;
    Inventory_Left: number;
    Dead_Quantity: number;
    Start_Quantity: number;
    Start_Weight: number;
    Start_Date: string;
}

// NAV Posting Groups response
export interface NavPostingGroupsResponse {
    "@odata.context": string;
    value: PostingGroup[];
}

class PostingGroupsApi {
    /* Fetch all posting groups * Currently returns static data, but can be extended to fetch from NAV */
    async fetchAllPostingGroups(): Promise<PostingGroup[]> {
        try {
            // Option 1: Return static data (current implementation)
            // return [...PostingGroupsApi.POSTING_GROUPS];

            // Option 2: Fetch from NAV (uncomment if NAV has a posting groups endpoint)

            const response = await fetch(`/api/nav/Jobs`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic YXBwOnBmVDkxczlKdkFDU3JqellsK1ZqL2M2aWtjdGNmbTNpZEJuSlFVVS9zSTg9',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                console.log("Handling API error for posting groups fetch");
                await new HandleError().handleApiError(response, 'PostingGroups.fetchAllPostingGroups');
            }

            const data: NavPostingGroupsResponse = await response.json();

            // Return the data directly since it already matches our PostingGroup interface
            return data.value;


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
            return allGroups.filter(group => group.Status === 'Open');
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
