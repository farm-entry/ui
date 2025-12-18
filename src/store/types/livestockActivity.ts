export interface FormData {
  form: ActivityType;
}

export type ActivityType =
  | "WEAN"
  | "MORTALITY"
  | "MOVE"
  | "GRADEOFF"
  | "QTYADJ"
  | "PURCHASE"
  | "SHIPMENT"
  | "INVENTORY";

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

export interface Reason {
  Code: string;
  Description: string;
}
export interface EventType {
  Journal_Template_Name: ActivityType;
  Code: string;
  Description: string;
  Reasons?: Reason[];
}

export interface HealthStatus {
  code: string;
  description: string;
  color?: string | null;
}
