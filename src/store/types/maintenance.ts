export interface MaintenanceAsset extends Record<string, unknown> {
    number: string;
    description: string;
    __typename: string;
}

export interface MaintenanceHistory {
    entry: number;
    number: string;
    amount: number;
    maintenanceCode: string;
    reasonCode: string;
    postingDate: string;
    quantity: number;
    meta: number;
    description: string;
    codeDescription: string;
    payToName: string;
    documentNo: string;
    __typename: string;
}

export interface MaintenanceAssetsByNo {
    code: string;
    interval: number;
    unitType: string;
    maintenanceDesc: string;
    __typename: string;
}

export interface MaintenanceItem {
    number: string;
    cost: number;
}

export interface MaintenanceAssetDetails {
    number: string;
    description: string;
    maintenanceAssetsByNo: MaintenanceAssetsByNo[];
    item: MaintenanceItem;
    history: MaintenanceHistory[];
}

export interface MaintenanceEntry {
    id: string;
    activityDate: string;
    gallons: number;
    pricePerGallon: number;
    totalCost: number;
    currentMiles: number;
    comments: string;
    maintenanceAsset: string;
    createdAt: string;
}

export interface MaintenanceFormData {
    maintenanceAsset: string;
    activityDate: string;
    gallons: number;
    currentMiles: number;
    comments?: string;
}

