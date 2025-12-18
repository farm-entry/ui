/**
 * Represents an individual element within a scorecard page section
 */
export interface ScorecardElement {
  /** Unique identifier for the element (e.g., "NG00SUPERVISOR", "NG01SLIDER-1-5-2") */
  id: string;
  /** Display label for the element */
  label: string;
  /** Code identifier for the element type (e.g., "SUPERVISOR", "SLIDER-1-5-2") */
  code: string;
  /** Display order of the element */
  order: number;
  /** Maximum value allowed for the element */
  max: number;
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

/**
 * Type for the complete scorecard pages array
 */
export type ScorecardPages = ScorecardPage[];
