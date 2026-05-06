import { FormData } from "./forms";

export interface MaintenanceAsset extends Record<string, unknown> {
  number: string;
  description: string;
  classCode: string;
  code: string;
  interval: number;
  unitType: string;
  maintenanceDesc: string;
}

export interface MaintenanceHistoryAsset {
  entry: number;
  number: string;
  amount: number;
  maintenanceCode: string;
  reasonCode: string;
  postingDate: string;
  quantity: number;
  description: string;
  meta: number;
  codeDescription: string;
  payToName: string;
  documentNo: string;
}

export interface MaintenanceAssetDetails extends MaintenanceAsset {
  history: MaintenanceHistoryAsset[];
}

export interface MaintenanceFormData extends FormData {
  asset: string;
  postingDate: string;
  type: string;
  workHours: number | null;
  mileage: number | null;
  comments?: string;
}
