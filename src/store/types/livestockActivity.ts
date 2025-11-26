export type ActivityType =
  | "WEAN"
  | "MORTALITY"
  | "MOVE"
  | "GRADEOFF"
  | "QTYADJ"
  | "PURCHASE"
  | "SHIPMENT";

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
  Code: string;
  Description: string;
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
