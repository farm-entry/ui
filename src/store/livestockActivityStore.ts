import { create } from 'zustand';

export type ActivityType = 'WEAN' | 'MORTALITY' | 'MOVE' | 'GRADEOFF' | 'QTYADJ' | 'PURCHASE' | 'SHIPMENT';

export interface Job {
  number: string;
  description: string;
  healthStatus?: {
    code: string;
    description: string;
    color?: string;
  };
  inventory?: number;
  deadQuantity?: number;
  startQuantity?: number;
}

export interface EventType {
  code: string;
  description: string;
  reasons?: Reason[];
}

export interface Reason {
  code: string;
  description: string;
}

export interface HealthStatus {
  code: string;
  description: string;
  color?: string;
}

export interface DimensionPacker {
  code: string;
  description: string;
}

export interface FormData {
  // Activity type selection
  activityType: ActivityType | null;
  
  // Job selection
  job: string;
  fromJob: string;
  toJob: string;
  
  // Event selection
  event: string;
  
  // Date
  postingDate: Date | null;
  
  // Quantities
  quantity: number | null;
  smallLivestockQuantity: number | null;
  totalWeight: number | null;
  livestockWeight: number | null;
  deadsOnArrivalQuantity: number | null;
  
  // Dynamic quantities for MORTALITY/GRADEOFF
  quantities: { [reasonCode: string]: number };
  
  // Shipment specific
  dimensionPacker: string;
  
  // Comments
  comments: string;
}

interface LivestockActivityStore {
  // Form data
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  
  // Reference data
  jobs: Job[];
  eventTypes: EventType[];
  healthStatuses: HealthStatus[];
  dimensionPackers: DimensionPacker[];
  
  // Set reference data
  setJobs: (jobs: Job[]) => void;
  setEventTypes: (eventTypes: EventType[]) => void;
  setHealthStatuses: (healthStatuses: HealthStatus[]) => void;
  setDimensionPackers: (dimensionPackers: DimensionPacker[]) => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
  
  // Clear form
  clearForm: () => void;
  
  // Validation
  validateForm: () => { isValid: boolean; errors: string[] };
}

const initialFormData: FormData = {
  activityType: null,
  job: '',
  fromJob: '',
  toJob: '',
  event: '',
  postingDate: null,
  quantity: null,
  smallLivestockQuantity: null,
  totalWeight: null,
  livestockWeight: null,
  deadsOnArrivalQuantity: null,
  quantities: {},
  dimensionPacker: '',
  comments: '',
};

export const useLivestockActivityStore = create<LivestockActivityStore>((set, get) => ({
  // Form data
  formData: initialFormData,
  
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  
  // Reference data
  jobs: [],
  eventTypes: [],
  healthStatuses: [],
  dimensionPackers: [],
  
  setJobs: (jobs) => set({ jobs }),
  setEventTypes: (eventTypes) => set({ eventTypes }),
  setHealthStatuses: (healthStatuses) => set({ healthStatuses }),
  setDimensionPackers: (dimensionPackers) => set({ dimensionPackers }),
  
  // Loading states
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Error handling
  error: null,
  setError: (error) => set({ error }),
  
  // Clear form
  clearForm: () =>
    set({
      formData: initialFormData,
      error: null,
    }),
  
  // Validation
  validateForm: () => {
    const { formData } = get();
    const errors: string[] = [];
    
    if (!formData.activityType) {
      errors.push('Activity type is required');
    }
    
    if (!formData.job && formData.activityType !== 'MOVE') {
      errors.push('Job is required');
    }
    
    if (formData.activityType === 'MOVE') {
      if (!formData.fromJob) errors.push('From job is required');
      if (!formData.toJob) errors.push('To job is required');
    }
    
    if (!formData.event) {
      errors.push('Event is required');
    }
    
    if (!formData.postingDate) {
      errors.push('Posting date is required');
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      errors.push('Quantity must be a positive number');
    }
    
    if (formData.smallLivestockQuantity && formData.quantity && 
        formData.smallLivestockQuantity > formData.quantity) {
      errors.push('Small livestock quantity cannot exceed total quantity');
    }
    
    // Activity-specific validations
    if (['WEAN', 'PURCHASE', 'SHIPMENT', 'MOVE'].includes(formData.activityType || '')) {
      if (!formData.totalWeight || formData.totalWeight <= 0) {
        errors.push('Total weight is required and must be positive');
      }
    }
    
    if (formData.activityType === 'GRADEOFF') {
      if (!formData.livestockWeight || formData.livestockWeight <= 0) {
        errors.push('Livestock weight is required and must be positive');
      }
    }
    
    if (formData.activityType === 'SHIPMENT' && !formData.dimensionPacker) {
      errors.push('Dimension packer is required for shipments');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
}));
