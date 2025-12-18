// Error types for better error handling
export interface ApiError {
    code: string;
    message: string;
    details?: string;
}

// Function to redirect to login page
const redirectToLogin = () => {
    if(process.env.FRONTLINE_SKIP_AUTH === 'true') {
        return;
    }
    // Store the current URL for redirect after login
    const currentUrl = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
    window.location.href = '/login';
};

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
        // Check for 401 unauthorized and redirect to login
        if (response.status === 401) {
            console.warn('Unauthorized access detected. Redirecting to login page.');
            redirectToLogin();
            // Still throw error but after redirect is initiated
        }

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