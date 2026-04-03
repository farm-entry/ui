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

type ErrorParser = {
  name: string;
  matches: (input: string) => boolean;
  parse: (input: string) => string | null;
};

const stringParsers: ErrorParser[] = [
  {
    name: "navOData",
    // Matches strings like: "Nav OData error! status: 400, message: {"error":{"code":"...","message":"..."}}"
    matches: (input) => input.startsWith("Nav OData error!"),
    parse: (input) => {
      const jsonMatch = input.match(/message:\s*(\{.*\})$/s);
      if (!jsonMatch) return null;
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return parsed?.error?.message ?? null;
      } catch {
        return null;
      }
    }
  }
];

export function parseStringError(input: string): string {
  for (const parser of stringParsers) {
    if (parser.matches(input)) {
      const result = parser.parse(input);
      if (result != null) return result;
    }
  }
  return input;
}

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

    // Read body once as text, then attempt JSON parse — avoids double-read of the stream
    try {
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        if (errorData.code && errorData.message) {
          errorCode = errorData.code;
          errorMessage = errorData.message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Not JSON — run through string parsers (e.g. Nav OData error format)
        errorMessage = parseStringError(text) || response.statusText || defaultMessage;
      }
    } catch {
      errorMessage = response.statusText || defaultMessage;
    }

    console.error(`${apiLabel} API Error:`, { code: errorCode, message: errorMessage });
    throw new Error(errorMessage);
  }
}
