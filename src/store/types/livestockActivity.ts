export interface LivestockQuantity {
  code: string;
  quantity: number | null;
}
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
  code: string;
  description: string;
}
export interface EventType {
  journal_template_name?: ActivityType;
  code: string;
  description: string;
  reasons?: Reason[];
}

export interface HealthStatus {
  code: string;
  description: string;
  color?: string | null;
}
