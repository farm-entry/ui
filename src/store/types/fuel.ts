import { FormData } from "../../store/types/forms";

export interface FuelAsset extends Record<string, unknown> {
  number: string;
  code: string;
  description: string;
  fuelType: string;
  fuelCost: number;
  unitOfMeasureCode: string;
}

export interface FuelHistory {
  entry: number;
  number: string;
  amount: number;
  maintenanceCode: string;
  reasonCode: string;
  postingDate: string;
  quantity: number;
  meta: number;
  description: string;
}

export interface FuelAssetDetails extends FuelAsset {
  history: FuelHistory[];
}

export interface FuelEntry {
  id: string;
  activityDate: string;
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
  currentMiles: number;
  comments: string;
  fuelAsset: string;
  createdAt: string;
}

export interface FuelFormData extends FormData {
  asset: string;
  postingDate: string;
  gallons: number | null;
  mileage: number | null;
  comments?: string;
}
