export interface ScorecardSubmitPayload {
  job: string;
  postingGroup: string;
  data: Array<{
    elementId: string;
    numericValue?: number;
    stringValue?: string;
  }>;
}

export function transformScorecardFormData(
  formData: Record<string, any>,
  job: string,
  postingGroup: string
): ScorecardSubmitPayload {
  const data = Object.entries(formData)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([elementId, value]: [string, any]) => {
      const entry: any = { elementId };

      // Handle nested objects with numericValue and stringValue
      if (typeof value === "object" && value !== null) {
        if (value.numericValue !== undefined && value.numericValue !== null && value.numericValue !== "") {
          entry.numericValue = value.numericValue;
        }
        if (value.stringValue !== undefined && value.stringValue !== null && value.stringValue !== "") {
          entry.stringValue = value.stringValue;
        }
      } else {
        // Handle simple values
        if (typeof value === "number") {
          entry.numericValue = value;
        } else if (typeof value === "string") {
          entry.stringValue = value;
        }
      }

      return entry;
    })
    .filter((entry) => entry.numericValue !== undefined || entry.stringValue !== undefined);

  return {
    job,
    postingGroup,
    data
  };
}
