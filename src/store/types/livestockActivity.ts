import { ActivityType } from "./forms";

export interface LivestockQuantity {
  code: string;
  quantity: number | null;
}

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
export interface EventType extends Record<string, unknown> {
  journal_template_name?: ActivityType;
  code: string;
  description: string;
  reasons?: Reason[];
}

export interface HealthStatus extends Record<string, unknown> {
  code: string;
  description: string;
  color?: string | null;
}
