import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

export interface UploadQueuedResponse {
  jobId: string;
}

export interface UploadStatusResponse {
  jobId: string;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'unknown';
  result: {
    total: number;
    inserted: number;
    skipped: number;
    errors: { row: number; reason: string }[];
  } | null;
  failedReason: string | null;
}
@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/upload`;

  uploadCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/products`, formData);
  }

  getStatus(jobId: string) {
    return this.http.get(`${this.baseUrl}/${jobId}/status`);
  }
}
