export interface FormData {
  form: ActivityType;
  eventLabel?: string | null;
  healthStatusLabel?: string | null;
}

export type ActivityType =
  | "WEAN"
  | "MORTALITY"
  | "MOVE"
  | "GRADEOFF"
  | "QTYADJ"
  | "PURCHASE"
  | "SHIPMENT"
  | "INVENTORY"
  | "FUEL"
  | "MAINTENANCE"
  | "SCORECARDS";
