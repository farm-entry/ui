import { apiFetch } from './apiFetch';

export interface DataloadLog {
  _id: string;
  filename: string;
  domain: string;
  entitySet: string;
  user: string;
  count: number;
  errorCount: number;
  results?: Array<{
    rowNumber: number;
    status: 'fulfilled' | 'rejected';
    message?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface LogsResponse {
  items: DataloadLog[];
  total: number;
  page: number;
  limit: number;
}

export interface ProcessResult {
  id: string;
  count: number;
  errorCount: number;
}

async function getPresignedUrl(filename: string): Promise<{ url: string; key: string }> {
  const res = await apiFetch('/api/dataload/presigned-url', {
    method: 'POST',
    body: JSON.stringify({ filename }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? `Failed to get upload URL (${res.status})`);
  }
  return res.json();
}

async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/csv' },
    body: file,
  });
  if (!res.ok) throw new Error(`S3 upload failed (${res.status})`);
}

async function processUpload(
  filename: string,
  key: string,
  entitySet: string,
): Promise<ProcessResult> {
  const res = await apiFetch('/api/dataload/process', {
    method: 'POST',
    body: JSON.stringify({ filename, key, entitySet }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? `Processing failed (${res.status})`);
  }
  return res.json();
}

async function getLogs(page = 0, limit = 50): Promise<LogsResponse> {
  const res = await apiFetch(`/api/dataload/logs?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load history');
  return res.json();
}

async function getLog(logId: string): Promise<DataloadLog> {
  const res = await apiFetch(`/api/dataload/logs/${logId}`);
  if (!res.ok) throw new Error('Failed to load log');
  return res.json();
}

export const dataloadApi = {
  getPresignedUrl,
  uploadToS3,
  processUpload,
  getLogs,
  getLog,
};
