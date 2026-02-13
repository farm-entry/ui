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
  | "INVENTORY"
  | "FUEL"
  | "MAINTENANCE";
