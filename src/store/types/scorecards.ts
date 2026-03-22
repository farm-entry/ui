import type { FormData } from "./forms";

/**
 * Represents an individual element within a scorecard page section
 */
export interface ScorecardType extends Record<string, any> {
  code: string;
  description: string;
}

export interface ScorecardElement {
  /** Unique identifier for the element (e.g., "NG00SUPERVISOR", "NG01SLIDER-1-5-2") */
  id: string;
  /** Display label for the element */
  label: string;
  /** Code identifier for the element type (e.g., "SUPERVISOR", "SLIDER-1-5-2") */
  code: string;
  /** Display order of the element */
  min: number;
  max: number;

  order?: number;
  step?: number;
  defaultValue?: any;
}

/**
 * Represents a section/page in the scorecard
 */
export interface ScorecardPage {
  /** Title of the scorecard section */
  title: string;
  /** Array of elements within this section */
  elements: ScorecardElement[];
}

export type ScorecardPages = ScorecardPage[];

export interface ScorecardConfig {
  jobNo: string;
  postingGroup: string;
  pages: ScorecardPage[];
}

export interface ScorecardFormData extends FormData {
  job: string | null;
  postingGroup: string | null;
  data: Array<{
    elementId: string;
    numericValue?: number;
    stringValue?: string;
  }>;
}

export interface ScorecardUser extends Record<string, unknown> {
  username: string;
  name: string;
}

export interface ScorecardResources {
  caretakers: ScorecardUser[];
  users: ScorecardUser[];
}