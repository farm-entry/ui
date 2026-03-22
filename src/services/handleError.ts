// Error types for better error handling
export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

// Function to redirect to login page
const redirectToLogin = () => {
  if (process.env.FRONTLINE_SKIP_AUTH === "true") {
    return;
  }
  // Store the current URL for redirect after login
  const currentUrl = window.location.pathname + window.location.search;
  sessionStorage.setItem("redirectAfterLogin", currentUrl);
  window.location.href = "/login";
};

export class HandleError {
  createError(code: string, message: string, details?: string): ApiError {
    return {
      code,
      message,
      details
    };
  }

  /* Handle API response errors */
  async handleApiError(response: Response, apiLabel: string): Promise<never> {
    // 401s are handled upstream by apiFetch (token refresh + retry).
    // Reaching here with a 401 means the refresh already failed — redirect.
    if (response.status === 401) {
      redirectToLogin();
    }

    const defaultMessage = "An unexpected error occurred. Please try again.";
    let errorCode = `HTTP_${response.status}`;
    let errorMessage = defaultMessage;

    try {
      const errorData = await response.json();
      
      // Handle consistent API error format: { code, message, timestamp }
      if (errorData.code && errorData.message) {
        errorCode = errorData.code;
        errorMessage = errorData.message;
      } else if (errorData.message) {
        // Fallback if only message is provided
        errorMessage = errorData.message;
      }
    } catch {
      // If JSON parsing fails, use HTTP status as fallback
      errorMessage = `${response.statusText || defaultMessage}`;
    }

    const error = this.createError(errorCode, errorMessage);

    console.error(`${apiLabel} API Error:`, error);
    throw error;
  }
}
