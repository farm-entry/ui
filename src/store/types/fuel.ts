export interface FuelAsset {
  number: string;
  code: string;
  description: string;
  fuelType: string;
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
  __typename: string;
}

export interface FuelAssetDetails extends FuelAsset {
  fuelCost: number;
  unitOfMeasureCode: string;
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

export interface FuelFormData {
  fuelAsset: string;
  activityDate: string;
  gallons: number;
  currentMiles: number;
  comments?: string;
}

