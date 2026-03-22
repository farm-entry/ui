import { FormData } from "./forms";

export interface InventoryLocation extends Record<string, unknown> {
  code: string;
  name: string;
}

export interface InventoryJob extends Record<string, unknown> {
  number: string;
  description: string;
  postingGroup: string;
}

export interface InventoryItem extends Record<string, unknown> {
  number: string;
  location: string;
  balance: number;
  description: string;
  type: string;
  cost: number;
  unit: string;
}

export interface InventoryLineItem {
  itemNumber: string;
  description: string;
  type: string;
  quantity: number;
  cost: number;
  unit: string;
}

export interface InventoryConsumptionFormData extends FormData {
  location: string;
  group: string;
  postingDate: string;
  lineItems: InventoryLineItem[];
  comments: string;
}
