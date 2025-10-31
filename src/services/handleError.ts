// Error types for better error handling
export interface ApiError {
    code: string;
    message: string;
    details?: string;
}

export class HandleError {
    createError(code: string, message: string, details?: string): ApiError {
        return {
            code,
            message,
            details,
        };
    }

    /* Handle API response errors */
    async handleApiError(response: Response, apiLabel: string): Promise<never> {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails: string | undefined;

        try {
            const errorData = await response.json();
            if (errorData.error) {
                errorMessage = errorData.error.message || errorMessage;
                errorDetails = errorData.error.details;
            }
        } catch (parseError) {
            // If we can't parse the error response, use the default message
            errorDetails = `Failed to parse error response: ${parseError}`;
        }

        const error = this.createError(
            `API_ERROR_${response.status}`,
            errorMessage,
            errorDetails
        );

        console.error(`${apiLabel} API Error:`, error);
        throw error;
    }
}