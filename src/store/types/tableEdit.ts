export interface TableEditJob extends Record<string, unknown> {
  number: string;
  description: string;
}

export interface TableEditJobDetail {
  number: string;
  description: string;
  startDate: string;
  endDate: string;
  deadQuantity: number;
  status: "Planning" | "Open" | "Completed";
  healthStatus: string;
  pigSourceFlow: string;
  nutrition: string;
  feedmill: string;
  personResponsible: string;
  projectManager: string;
}

export interface TableEditCodeOption extends Record<string, unknown> {
  code: string;
  description: string;
}

export interface TableEditResource extends Record<string, unknown> {
  number: string;
  name: string;
}

export interface TableEditUser extends Record<string, unknown> {
  username: string;
  name: string;
}

export interface TableEditJobDetailResponse {
  job: TableEditJobDetail;
  resources: TableEditResource[];
  users: TableEditUser[];
  healthStatuses: TableEditCodeOption[];
  pigSourceFlow: TableEditCodeOption[];
  feedmill: TableEditCodeOption[];
  nutrition: TableEditCodeOption[];
}

export interface TableEditJobFormData {
  form: string;
  jobNumber: string;
  status: "Planning" | "Open" | "Completed" | "";
  startDate: string;
  endDate: string;
  description: string;
  healthStatus: string;
  pigSourceFlow: string;
  feedmill: string;
  nutrition: string;
  person: string;
}

export type JobStatus = "Planning" | "Open" | "Completed";

export const JOB_STATUSES: JobStatus[] = ["Planning", "Open", "Completed"];
