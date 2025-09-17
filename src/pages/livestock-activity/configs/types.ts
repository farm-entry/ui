export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'typeahead' | 'textarea';
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    maxValue?: string; // Reference to another field for dynamic max
  };
  helperText?: string;
  options?: Array<{ value: string; label: string }>;
  step?: string;
}

export interface ActivityTypeConfig {
  code: string;
  label: string;
  description: string;
  sections: {
    jobSelection: {
      showFromJob: boolean;
      showToJob: boolean;
      jobLabel?: string;
      fromJobLabel?: string;
      toJobLabel?: string;
    };
    fields: FieldConfig[];
    dynamicQuantities: boolean;
  };
}
