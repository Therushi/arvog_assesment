import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReportQueuedResponse {
  jobId: string;
}

export interface ReportStatusResponse {
  jobId: string;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'unknown';
  result: { format: 'csv' | 'xlsx'; filename: string; rowCount: number } | null;
  failedReason: string | null;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/reports`;

  generate(
    format: 'csv' | 'xlsx',
    filters: { search?: string; sort?: 'asc' | 'desc' } = {},
  ): Observable<{ success: boolean; data: ReportQueuedResponse; message: string }> {
    return this.http.post<{ success: boolean; data: ReportQueuedResponse; message: string }>(
      `${this.baseUrl}/products`,
      { format, ...filters },
    );
  }

  getStatus(jobId: string): Observable<{ success: boolean; data: ReportStatusResponse; message: string }> {
    return this.http.get<{ success: boolean; data: ReportStatusResponse; message: string }>(
      `${this.baseUrl}/${jobId}`,
    );
  }

  download(jobId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${jobId}/download`, { responseType: 'blob' });
  }
}
